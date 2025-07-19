import nodemailer from 'nodemailer';
import dotenv from "dotenv"

dotenv.config();
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendInvoiceEmail = async (email, { name, plan, amount, date }) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Subscription Invoice - StackOverflow Clone',
    html: `
      <h3>Thank you for your subscription!</h3>
      <p><strong>User:</strong> ${name}</p>
      <p><strong>Plan:</strong> ${plan}</p>
      <p><strong>Amount Paid:</strong> ₹${amount}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p>Happy asking questions!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendInvoiceEmail;
