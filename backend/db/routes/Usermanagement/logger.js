const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

const logDir = path.join(__dirname, '../../logs');
const errorLogPath = path.join(logDir, 'errors.log');

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logError = (message, errorDetails = {}) => {
  const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  const logEntry = {
    timestamp,
    message,
    ...errorDetails
  };

  const logString = `${timestamp} - ERROR: ${message}\n${JSON.stringify(errorDetails, null, 2)}\n\n`;

  // Write to console
  console.error(logString);

  // Write to file
  fs.appendFile(errorLogPath, logString, (err) => {
    if (err) console.error('Failed to write to error log:', err);
  });
};

module.exports = { logError };