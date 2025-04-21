const pool = require('../../databaseConnection/mysqlConnection');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
require('dotenv').config();


// Security configurations
const SALT_ROUNDS = 12;
const TEMP_PASSWORD_LENGTH = 6;

const postCustomers = async (personalInfo, orderInfo, additionalInfo) => {
  const connection = await pool.getConnection();
  try {

      // Generate secure temporary password
      const generatedPassword = crypto.randomBytes(TEMP_PASSWORD_LENGTH)
      .toString('base64')
      .replace(/[+/]/g, '')
      .slice(0, TEMP_PASSWORD_LENGTH);

    // Hash password before storage
    const hashedPassword = await bcrypt.hash(generatedPassword, SALT_ROUNDS);


    await connection.beginTransaction();

    // Helper function to convert undefined to null
    const dbValue = (val) => (val === undefined ? null : val);

    // 1. Insert into customers table with hashed password
    const [customerResult] = await connection.execute(
      `INSERT INTO customers (
        customerId, firstName, middleName, lastName, 
        mobileNumber1, mobileNumber2, customerType, 
        birthDate, email, aadhaarNumber, panNumber, 
        city, state, country, address, status, password
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        personalInfo.customerId,
        personalInfo.firstName,
        dbValue(personalInfo.middleName),
        personalInfo.lastName,
        personalInfo.mobileNumber1,
        dbValue(personalInfo.mobileNumber2),
        personalInfo.customerType,
        dbValue(personalInfo.birthDate),
        dbValue(personalInfo.email),
        dbValue(personalInfo.aadhaarNumber),
        dbValue(personalInfo.panNumber),
        personalInfo.city,
        personalInfo.state,
        personalInfo.country,
        personalInfo.address,
        personalInfo.status,
        hashedPassword
      ]
    );

    // 2. Insert into orders_prebooking_date table
    const [orderResult] = await connection.execute(
      `INSERT INTO orders_prebooking_date (
        customerId, order_date, tentative_date, 
        preferred_date, request_date, prebooking, 
        prebooking_date, delivery_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        personalInfo.customerId,
        dbValue(orderInfo.orderDate) || 'NO',
        dbValue(orderInfo.tentativeDate),
        dbValue(orderInfo.preferredDate),
        dbValue(orderInfo.requestDate),
        dbValue(orderInfo.prebooking) || 'NO',
        dbValue(orderInfo.prebookingDate),
        dbValue(orderInfo.deliveryDate)
      ]
    );

    // 3. Insert into additional_info table
    const [additionalInfoResult] = await connection.execute(
      `INSERT INTO additional_info (
        customerId, exchange, finance, accessories, 
        coating, fast_tag, rto, insurance, 
        extended_warranty, auto_card
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        personalInfo.customerId,
        dbValue(additionalInfo.exchange) || 'No',
        dbValue(additionalInfo.finance) || 'No',
        dbValue(additionalInfo.accessories) || 'No',
        dbValue(additionalInfo.coating) || 'No',
        dbValue(additionalInfo.fastTag) || 'No',
        dbValue(additionalInfo.rto) || 'No',
        dbValue(additionalInfo.insurance) || 'No',
        dbValue(additionalInfo.extendedWarranty) || 'No',
        dbValue(additionalInfo.autoCard) || 'No'
      ]
    );

     // 4-6. Insert into other tables
    await connection.execute(
      `INSERT INTO predeliveryinspection (customerId) VALUES (?)`,
      [personalInfo.customerId]
    );

    await connection.execute(
      `INSERT INTO gate_pass (customerId) VALUES (?)`,
      [personalInfo.customerId]
    );

    await connection.execute(
      `INSERT INTO management_security_clearance (customerId) VALUES (?)`,
      [personalInfo.customerId]
    );

    await connection.execute(
      `INSERT INTO account_management (customerId) VALUES (?)`,
      [personalInfo.customerId]
    );

    await connection.commit();

    // Send confirmation email only if email exists
    if (personalInfo.email) {

      const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      const mailOptions = {
        from: `"Customer Service" <${process.env.EMAIL_USER}>`,
        to: personalInfo.email,
        subject: 'Your Car Booking Confirmation',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">Booking Confirmation</h2>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <p><strong>Customer ID:</strong> ${personalInfo.customerId}</p>
              <p><strong>Name:</strong> ${personalInfo.firstName} ${personalInfo.middleName ? personalInfo.middleName + ' ' : ''}${personalInfo.lastName}</p>
              <p><strong>Email:</strong> ${personalInfo.email}</p>
              <p><strong>Temporary Password:</strong> ${generatedPassword}</p>
            </div>
      
            <p style="margin-bottom: 20px; line-height: 1.6;">
              Thank you for your booking! Your vehicle order has been successfully processed.<br>
              You can now track your order status through your account.
            </p>
      
            <p style="margin-top: 20px; margin-bottom: 30px;">
              <a href="${clientUrl}/login" 
                 style="background: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Access Your Account
              </a>
            </p>
      
            <div style="border-top: 1px solid #eee; padding-top: 15px; font-size: 0.9em; color: #777;">
              <p><strong>Important:</strong> For security reasons, please change your password after first login.</p>
              <p>If you didn't request this booking, please contact us immediately.</p>
            </div>
      
            <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; text-align: center; color: #666;">
              <p>Thank you,</p>
              <p><strong>AutoTrack Motors</strong></p>
              <p>📞 +91 9876543210</p>
              <p>✉️ support@autotrackmotors.com</p>
              <p>🌐 <a href="https://www.autotrackmotors.com" style="color: #3498db;">www.autotrackmotors.com</a></p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('Confirmation email sent to:', personalInfo.email);
    }

    return {
      success: true,
      customerId: personalInfo.customerId,
      message: 'Customer created successfully' + 
               (personalInfo.email ? ' and credentials emailed' : '')
    };

  } catch (error) {
    await connection.rollback();
    
    // Handle duplicate entry error
    if (error.code === 'ER_DUP_ENTRY') {
      throw {
        status: 409,
        message: 'Duplicate customer ID detected',
        resolution: 'Please generate a new customer ID'
      };
    }

    // Handle email errors specifically
    if (error.code === 'EENVELOPE' || error.code === 'ECONNECTION') {
      console.error('Email delivery failed:', error);
      throw {
        status: 500,
        message: 'Account created but email failed to send',
        error: 'Email delivery error'
      };
    }

    // Generic error handling
    console.error('Database Operation Error:', error);
    throw {
      status: 500,
      message: 'Customer creation failed',
      error: error.message
    };
  } finally {
    connection.release();
  }
};

 
module.exports = { postCustomers };
