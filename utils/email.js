const nodemailer = require('nodemailer');
//const { options } = require('../app');
const sendEmail = async (options) => {
  //1)Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //2) define the Email options
  const mailOptions = {
    from: 'Omar Helmy <helmy1@gmail.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
