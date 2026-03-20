import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 100000, 
  greetingTimeout: 100000,
  socketTimeout: 100000,
});

export const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"Coursy" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${options.to}`);
    return result;
  } catch (error) {
    console.error(`❌ Error in sendEmail helper:`, error.message);
    throw new Error(`Failed to send email. Reason: ${error.message}`);
  }
};

export const sendVerificationEmail = async (toEmail, otp) => {
  const subject = 'Your OTP for Email Verification';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">Email Verification</h2>
      <p style="font-size: 16px; color: #555;">Hello,</p>
      <p style="font-size: 16px; color: #555;">
        Thank you for registering with Coursy. Please use the following One-Time Password (OTP) to verify your email address:
      </p>
      <div style="text-align: center; margin: 25px 0;">
        <span style="font-size: 24px; font-weight: bold; color: #000; background-color: #f0f0f0; padding: 10px 20px; border-radius: 5px; letter-spacing: 2px;">
          ${otp}
        </span>
      </div>
      <p style="font-size: 16px; color: #555;">
        This code will expire in 10 minutes. If you did not request this, please ignore this email.
      </p>
      <p style="font-size: 16px; color: #555;">Best regards,<br/>Coursy Developer</p>
    </div>
  `;
  const text = `Your verification code is: ${otp}`;

  try {
    await sendEmail({ to: toEmail, subject, html, text });
    console.log(`Verification email sent successfully to ${toEmail}`);
  } catch (error) {
    console.error(`Failed to send verification email to ${toEmail}.`, error);
    throw error;
  }
};

export const sendForgotPasswordEmail = async (toEmail, resetUrl) => {
  const subject = 'Coursy - Password Reset Request';
  const text = `
    You are receiving this email because you requested a password reset for your Coursy account.
    Please click on the following link, or paste it into your browser to complete the process:
    ${resetUrl}
    This link will expire in 15 minutes.
    If you did not request this, please ignore this email and your password will remain unchanged.
  `;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
      <p style="font-size: 16px; color: #555;">Hello,</p>
      <p style="font-size: 16px; color: #555;">
        You are receiving this email because you (or someone else) requested a password reset for your Coursy account.
      </p>
      <div style="text-align: center; margin: 25px 0;">
        <a href="${resetUrl}" target="_blank" style="font-size: 18px; font-weight: bold; color: #ffffff; background-color: #007bff; padding: 12px 25px; border-radius: 5px; text-decoration: none; display: inline-block;">
          Reset Your Password
        </a>
      </div>
      <p style="font-size: 16px; color: #555;">This link will expire in 15 minutes.</p>
      <p style="font-size: 16px; color: #555;">
        If you did not request this, please ignore this email and your password will remain unchanged.
      </p>
      <p style="font-size: 16px; color: #555;">Best regards,<br/>Coursy Developer</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin-top: 20px;" />
      <p style="font-size: 12px; color: #999;">
        If you're having trouble clicking the button, copy and paste this URL into your browser:
        <br>
        <a href="${resetUrl}" target="_blank" style="color: #007bff; word-break: break-all;">${resetUrl}</a>
      </p>
    </div>
  `;

  try {
    await sendEmail({ to: toEmail, subject, text, html });
    console.log(`Password reset email sent successfully to ${toEmail}`);
  } catch (error) {
    console.error(`Failed to send password reset email to ${toEmail}.`, error);
    throw error;
  }
};
