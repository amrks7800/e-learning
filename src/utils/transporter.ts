import nodemailer from "nodemailer";
import { config } from "../config/config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.mail.ownerMail,
    pass: config.mail.password,
  },
});

export default transporter;
