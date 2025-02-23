const pool = require('../../databaseConnection/mysqlConnection');

const addCarStock = async (req, res) => {
  const {
    vin,
    manufacturerDate,
    dateIn,
    model,
    color,
    fuelType,
    chassisNumber,
    engineNumber,
    version,
    customerId,
    allotmentCarStatus,
    carType,
    engineCapacity,
    transmission,
    exShowroomPrice,
    bookingAmount,
    mileage,
    batteryCapacity,
    cardiscount,
    groundClearance,
  } = req.body;

  // Validate required fields
  if (
    !vin ||
    !manufacturerDate ||
    !dateIn ||
    !model ||
    !carType ||
    !engineCapacity ||
    !transmission ||
    !exShowroomPrice ||
    !bookingAmount ||
    !mileage
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate VIN length
  if (vin.length !== 17) {
    return res.status(400).json({ error: 'VIN must be exactly 17 characters' });
  }

  try {
    // Check if VIN already exists
    const [existingCar] = await pool.query(
      `SELECT vin FROM carstocks WHERE vin = ?`,
      [vin]
    );

    if (existingCar.length > 0) {
      return res.status(409).json({ error: 'Car with this VIN already exists' });
    }

    // Insert new car stock entry
    const query = `
      INSERT INTO carstocks (
        vin, manufacturerDate, dateIn, model, color, fuelType, chassisNumber, 
        engineNumber, version, customerId, allotmentCarStatus, carType, 
        engineCapacity, transmission, exShowroomPrice, bookingAmount, 
        mileage, batteryCapacity, cardiscount, groundClearance
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      vin,
      manufacturerDate,
      dateIn,
      model,
      color,
      fuelType,
      chassisNumber,
      engineNumber,
      version,
      customerId,
      allotmentCarStatus || 'Not Allocated', // Default status
      carType,
      engineCapacity,
      transmission,
      exShowroomPrice,
      bookingAmount,
      mileage,
      batteryCapacity,
      cardiscount,
      groundClearance,
    ];

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 1) {
      res.status(201).json({ message: 'Car stock added successfully', vin });
    } else {
      throw new Error('Failed to add car stock');
    }
  } catch (error) {
    console.error('Error adding car stock:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

module.exports = { addCarStock };