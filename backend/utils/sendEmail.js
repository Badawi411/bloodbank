const nodemailer = require("nodemailer");

module.exports = async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    text,
  });
};
