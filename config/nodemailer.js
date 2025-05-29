import nodemailer from 'nodemailer';
import dotenv from "dotenv"

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
    port: 587,
  secure: false, // use TLS
    auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS
    }
});

export default transporter
