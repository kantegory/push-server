// module meta
const __moduleName = 'mailer';

// config params & deps
const configParser = require('../configParser');
const __configPath = './config/config.ini';
const __config = configParser(__configPath, __moduleName);

// dependecies
const nm = require('nodemailer');

// create transporter
const transporter = nodemailer.createTransport({
  host: __config.host,
  port: __config.port,
  auth: {
    user: __config.user,
    pass: __config.pass
  }
});

module.exports = transporter;
