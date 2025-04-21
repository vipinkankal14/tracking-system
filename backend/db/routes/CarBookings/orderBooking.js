const pool = require('../../databaseConnection/mysqlConnection');

const postCarBooking = async (req, res) => {
  const {
    customerId,
    bookingType,
    team_Leader,
    team_Member,
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
    batteryCapacity,
    cardiscount,
    groundClearance,
  } = req.body;

  // Validate required fields
  if (
    !customerId ||
    !carType ||
    !model ||
    !version ||
    !color ||
    !exShowroomPrice ||
    !bookingAmount ||
    !fuelType ||
    !transmission ||
    !mileage
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Apply conditional logic based on bookingType
  let finalTeamLeader = team_Leader;
  let finalTeamMember = team_Member;

  if (bookingType === 'Online') {
    finalTeamLeader = null;
    finalTeamMember = null;
  }

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Insert new car booking entry
    const insertQuery = `
      INSERT INTO carbooking (
        customerId, bookingType, team_Leader, team_Member, carType, model, version, color,
        exShowroomPrice, bookingAmount, fuelType, transmission, mileage,
        engineCapacity, batteryCapacity, cardiscount, groundClearance 
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const insertValues = [
      customerId,
      bookingType,
      finalTeamLeader,
      finalTeamMember,
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
      batteryCapacity,
      cardiscount,
      groundClearance,
    ];

    const [insertResult] = await connection.query(insertQuery, insertValues);

    if (insertResult.affectedRows === 1) {
      // Delete old requests
      const deleteQuery = 'DELETE FROM carbooking WHERE customerId = ? AND id != ?';
      await connection.query(deleteQuery, [customerId, insertResult.insertId]);

      // Commit transaction
      await connection.commit();

      res.status(201).json({ message: 'Car booking added successfully', customerId });
    } else {
      throw new Error('Failed to add car booking');
    }
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error adding car booking:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { postCarBooking };
