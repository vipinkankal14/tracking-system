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
        city, state, country, address, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        personalInfo.address,
        personalInfo.status
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
        orderInfo.orderDate || "No",
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

    // 4. Insert into predeliveryinspection table
    await connection.execute(
      `INSERT INTO predeliveryinspection (customerId) VALUES (?)`,
      [personalInfo.customerId]
    );

    // 5. Insert into gate_pass table
    await connection.execute(
      `INSERT INTO gate_pass (customerId) VALUES (?)`,
      [personalInfo.customerId]
    );

    // 6. Insert into management_security_clearance table
    await connection.execute(
      `INSERT INTO management_security_clearance (customerId) VALUES (?)`,
      [personalInfo.customerId]
    );

    await connection.commit();
    return {
      success: true,
      customerId: personalInfo.customerId,
      message: 'Customer created successfully'
    };

  } catch (error) {
    await connection.rollback();
    
    if (error.code === 'ER_DUP_ENTRY') {
      throw {
        status: 409,
        message: 'Duplicate customer ID. Please generate a new ID.'
      };
    }
    
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