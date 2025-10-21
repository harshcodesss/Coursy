import nodemailer from "nodemailer";

// Create transporter using Ethereal (dev/testing)
export const createTransporter = async () => {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return { transporter, testAccount };
};

// Send verification email
export const sendVerificationEmail = async (to, token) => {
  const { transporter, testAccount } = await createTransporter();

  const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  const mailOptions = {
    from: `"Coursy" <${testAccount.user}>`,
    to,
    subject: "Verify your Coursy account",
    html: `<p>Hello!</p>
           <p>Click <a href="${verificationLink}">here</a> to verify your email.</p>
           <p>If you did not sign up, ignore this email.</p>`,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Verification email sent:", nodemailer.getTestMessageUrl(info));
};
