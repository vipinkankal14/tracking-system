const pool = require('../../databaseConnection/mysqlConnection');

const postCarBooking = async (req, res) => {
  const {
    customerId,
    teamLeader,
    teamMember,
    carType,
    model,
    version,
    color,
    exShowroomPrice,
    bookingAmount,
    fuelType,
    transmission,
    mileage,
    engineCapacity,
    batteryCapacity
  } = req.body;

  // Validate required fields
  if (!customerId || !carType || !model || !version || !color || !exShowroomPrice || !bookingAmount || !fuelType || !transmission || !mileage) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  let connection;
  try {
    // Get a connection from the pool
    connection = await pool.getConnection();

    // Begin a new transaction
    await connection.beginTransaction();

    // Step 1: Delete old requests for the same customer
    const deleteQuery = `
      DELETE FROM carbooking
      WHERE customerId = ?
    `;
    await connection.query(deleteQuery, [customerId]);

    // Step 2: Insert the new request
    const insertQuery = `
      INSERT INTO carbooking (
        customerId,
        teamLeader,
        teamMember,
        carType,
        model,
        version,
        color,
        exShowroomPrice,
        bookingAmount,
        fuelType,
        transmission,
        mileage,
        engineCapacity,
        batteryCapacity
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      customerId,
      teamLeader,
      teamMember,
      carType,
      model,
      version,
      color,
      exShowroomPrice,
      bookingAmount,
      fuelType,
      transmission,
      mileage,
      engineCapacity,
      batteryCapacity
    ];

    await connection.query(insertQuery, values);

    // Commit the transaction
    await connection.commit();

    console.log('Data inserted successfully');
    res.status(200).json({ message: 'Car selection submitted successfully!' });
  } catch (error) {
    // Rollback the transaction in case of error
    if (connection) await connection.rollback();
    console.error('Error processing request:', error);
    res.status(500).json({ message: 'Failed to submit car selection.' });
  } finally {
    // Release the connection back to the pool
    if (connection) connection.release();
  }
};

module.exports = { postCarBooking };