// module meta
const __moduleName = 'mailer';

// config params & deps
const configParser = require('../configParser');
const __configPath = './config/config.ini';
const __config = configParser(__configPath, __moduleName);

// get transporter
const transporter = require('./connector');

// send email function
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: __config.user,
    to: to,
    subject: subject,
    text: text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = sendEmail;
