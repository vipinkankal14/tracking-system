const pool = require('../../databaseConnection/mysqlConnection');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/carImages/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|avif/;
  const isMime = allowed.test(file.mimetype);
  const isExt = allowed.test(path.extname(file.originalname).toLowerCase());
  if (isMime && isExt) cb(null, true);
  else cb(new Error('Only image files allowed (jpeg, jpg, png, webp,avif)'));
};

// Multer upload config
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
}).fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 }
]);

// Upload middleware
const handleUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

// Helpers
const formatDate = (date) => date ? new Date(date).toISOString().slice(0, 10) : null;
const parseNumber = (val) => isNaN(parseFloat(val)) ? null : parseFloat(val);

// Add Car Stock
const addCarStock = async (req, res) => {
  const {
    vin, manufacturerDate, dateIn, model, color, fuelType, chassisNumber,
    engineNumber, version, customerId, allotmentCarStatus, carType, engineCapacity,
    transmission, exShowroomPrice, bookingAmount, mileage, batteryCapacity,
    cardiscount, groundClearance
  } = req.body;

  if (!vin || vin.length !== 17) {
    return res.status(400).json({ error: 'VIN must be exactly 17 characters' });
  }

  try {
    // Check for duplicate VIN
    const [existing] = await pool.query('SELECT vin FROM carstocks WHERE vin = ?', [vin]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Car with this VIN already exists' });
    }

    const imagePaths = {
      image1: req.files?.image1 ? `/carImages/${req.files.image1[0].filename}` : null,
      image2: req.files?.image2 ? `/carImages/${req.files.image2[0].filename}` : null,
      image3: req.files?.image3 ? `/carImages/${req.files.image3[0].filename}` : null,
      image4: req.files?.image4 ? `/carImages/${req.files.image4[0].filename}` : null
    };

    const insertQuery = `
      INSERT INTO carstocks (
        vin, manufacturerDate, dateIn, model, color, fuelType, chassisNumber, engineNumber,
        version, customerId, allotmentCarStatus, carType, engineCapacity, transmission,
        exShowroomPrice, bookingAmount, mileage, batteryCapacity, cardiscount, groundClearance,
        image1, image2, image3, image4, image_updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const values = [
      vin, formatDate(manufacturerDate), formatDate(dateIn), model, color || null,
      fuelType || null, chassisNumber || null, engineNumber || null, version || null,
      customerId || null, allotmentCarStatus || 'Not Allocated', carType,
      engineCapacity || null, transmission, parseNumber(exShowroomPrice),
      parseNumber(bookingAmount), mileage, batteryCapacity || null,
      parseNumber(cardiscount), groundClearance || null,
      imagePaths.image1, imagePaths.image2, imagePaths.image3, imagePaths.image4
    ];

    const [result] = await pool.query(insertQuery, values);

    res.status(201).json({
      message: 'Car stock added successfully',
      vin,
      images: imagePaths
    });
  } catch (error) {
    console.error('Insert error:', error);
    // Remove uploaded files if error
    if (req.files) {
      Object.values(req.files).flat().forEach(file => {
        fs.unlinkSync(file.path);
      });
    }
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
      sqlError: error.sqlMessage
    });
  }
};

module.exports = { handleUpload, addCarStock };
