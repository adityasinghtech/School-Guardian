const morgan = require('morgan');
// We can use morgan directly in server.js, or export a customized format here
const requestLogger = morgan('dev');
module.exports = { requestLogger };