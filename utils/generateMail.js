import nodemailer from "nodemailer";

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

export const sendMail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    await transporter.sendMail({
        from: `"WebPlus" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
};

export const forgotPasswordTemplate = ({ username, otp }) => {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Password Reset Request</h2>

            <p>Hello <strong>${username}</strong>,</p>

            <p>Use the OTP below to reset your password:</p>

            <h1 style="letter-spacing: 6px; color: #2563eb;">
                ${otp}
            </h1>

            <p>This OTP is valid for <strong>10 minutes</strong>.</p>

            <p>If you didn't request this password reset, you can safely ignore this email.</p>

            <br>

            <p>Regards,</p>
            <strong>WebPlus Team</strong>
        </div>
    `;
};