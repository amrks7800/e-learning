import { TEN_MINUTES } from "../constants";
import cloudinary from "./cloudinary";
import redis from "./redis";
import otpTemplate from "../email/otp-template";
import { config } from "../config/config";
import transporter from "./transporter";

export async function uploadToCloudinary(path: string) {
  return cloudinary.uploader.upload(path);
}

export const generate6DigitsOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
export async function verifyOTP({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) {
  const storedOTP = (await redis.get(`otp:${email}`)) as string;

  if (+storedOTP !== +otp) {
    return false;
  }
  await redis.del(`otp:${email}`);
  return true;
}

export async function sendOTP({
  email,
  otp,
  username,
}: {
  email: string;
  otp: string;
  username: string;
}) {
  await redis.setex(`otp:${email}`, TEN_MINUTES, otp);

  await sendEmail({
    to: email,
    subject: "Your Learning Verification Code",
    html: otpTemplate(otp, username),
  });
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const mailOptions = {
    from: config.mail.ownerMail,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
