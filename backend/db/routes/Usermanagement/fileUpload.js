// utils/fileUpload.js
const fs = require('fs');
const path = require('path');

const ensureUploadsDirExists = () => {
  const uploadsDir = path.join(__dirname, '../public/uploads/profile-images');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
};

module.exports = { ensureUploadsDirExists };