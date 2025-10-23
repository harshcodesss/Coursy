import { OAuth2Client } from "google-auth-library";
import nodemailer from "nodemailer";


const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

export const sendVerificationEmail = async (toEmail, otp) => {
  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_EMAIL,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken.token, // Use the fresh access token
      },
    });

    // 2. Define the specific subject and HTML body for our OTP email
    const subject = 'Your OTP for Email Verification';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Email Verification</h2>
        <p style="font-size: 16px; color: #555;">
          Hello,
        </p>
        <p style="font-size: 16px; color: #555;">
          Thank you for registering with Your App Name. Please use the following One-Time Password (OTP) to verify your email address:
        </p>
        <div style="text-align: center; margin: 25px 0;">
          <span style="font-size: 24px; font-weight: bold; color: #000; background-color: #f0f0f0; padding: 10px 20px; border-radius: 5px; letter-spacing: 2px;">
            ${otp}
          </span>
        </div>
        <p style="font-size: 16px; color: #555;">
          This code will expire in 10 minutes. If you did not request this, please ignore this email.
        </p>
        <p style="font-size: 16px; color: #555;">
          Best regards,<br/>
          The Your App Name Team
        </p>
      </div>
    `;

    // 3. Create the mailOptions with our new variables
    const mailOptions = {
      // 4. Use the professional "from" format
      from: `"Your App Name" <${process.env.GOOGLE_EMAIL}>`,
      to: toEmail,
      subject: subject,
      html: html,
      text: `Your verification code is: ${otp}`,
    };

    // Send the email
    const result = await transport.sendMail(mailOptions);
    console.log(`Verification email sent successfully to ${toEmail}`);
    return result;

  } catch (error) {
    console.error(`Error sending email to ${toEmail}:`, error.message);
    throw new Error(`Failed to send verification email to ${toEmail}. Reason: ${error.message}`);
  }
};