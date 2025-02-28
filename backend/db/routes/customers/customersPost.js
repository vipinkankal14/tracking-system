const pool = require('../../databaseConnection/mysqlConnection');

const postCustomers = async (personalInfo, orderInfo, additionalInfo) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insert into customers table
    const [customerResult] = await connection.execute(
      `INSERT INTO customers (
        customerId, firstName, middleName, lastName, 
        mobileNumber1, mobileNumber2, customerType, 
        birthDate, email, aadhaarNumber, panNumber, 
        city, state, country, address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        personalInfo.customerId,
        personalInfo.firstName,
        personalInfo.middleName || null,
        personalInfo.lastName,
        personalInfo.mobileNumber1,
        personalInfo.mobileNumber2 || null,
        personalInfo.customerType,
        personalInfo.birthDate || null,
        personalInfo.email || null,
        personalInfo.aadhaarNumber || null,
        personalInfo.panNumber || null,
        personalInfo.city,
        personalInfo.state,
        personalInfo.country,
        personalInfo.address
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
        orderInfo.orderDate || null,
        orderInfo.tentativeDate || null,
        orderInfo.preferredDate || null,
        orderInfo.requestDate || null,
        orderInfo.prebooking || 'NO',
        orderInfo.prebookingDate || null,
        orderInfo.deliveryDate || null
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
        additionalInfo.exchange || 'No',
        additionalInfo.finance || 'No',
        additionalInfo.accessories || 'No',
        additionalInfo.coating || 'No',
        additionalInfo.fastTag || 'No',
        additionalInfo.rto || 'No',
        additionalInfo.insurance || 'No',
        additionalInfo.extendedWarranty || 'No',
        additionalInfo.autoCard || 'No'
      ]
    );

    await connection.commit();
    return {
      success: true,
      customerId: personalInfo.customerId,
      message: 'Customer created successfully'
    };

  } catch (error) {
    await connection.rollback();
    
    // Handle specific MySQL errors
    if (error.code === 'ER_DUP_ENTRY') {
      throw {
        status: 409,
        message: 'Duplicate customer ID. Please generate a new ID.'
      };
    }
    
    // Log the full error for debugging
    console.error('Database Error:', error);
    
    throw {
      status: 500,
      message: 'Database operation failed',
      error: error.message
    };
  } finally {
    connection.release();
  }
};

module.exports = { postCustomers };

 