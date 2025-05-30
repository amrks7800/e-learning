"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate6DigitsOTP = void 0;
exports.uploadToCloudinary = uploadToCloudinary;
exports.verifyOTP = verifyOTP;
exports.sendOTP = sendOTP;
exports.sendEmail = sendEmail;
const constants_1 = require("../constants");
const cloudinary_1 = __importDefault(require("./cloudinary"));
const redis_1 = __importDefault(require("./redis"));
const otp_template_1 = __importDefault(require("../email/otp-template"));
const config_1 = require("../config/config");
const transporter_1 = __importDefault(require("./transporter"));
async function uploadToCloudinary(path) {
    return cloudinary_1.default.uploader.upload(path);
}
const generate6DigitsOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generate6DigitsOTP = generate6DigitsOTP;
async function verifyOTP({ email, otp, }) {
    const storedOTP = (await redis_1.default.get(`otp:${email}`));
    if (+storedOTP !== +otp) {
        return false;
    }
    await redis_1.default.del(`otp:${email}`);
    return true;
}
async function sendOTP({ email, otp, username, }) {
    await redis_1.default.setex(`otp:${email}`, constants_1.TEN_MINUTES, otp);
    await sendEmail({
        to: email,
        subject: "Your Learning Verification Code",
        html: (0, otp_template_1.default)(otp, username),
    });
}
async function sendEmail({ to, subject, html, }) {
    const mailOptions = {
        from: config_1.config.mail.ownerMail,
        to,
        subject,
        html,
    };
    try {
        await transporter_1.default.sendMail(mailOptions);
        console.log("Email sent successfully");
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
}
