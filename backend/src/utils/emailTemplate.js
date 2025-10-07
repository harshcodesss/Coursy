export const otpEmailTemplate = (otp, name) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
        <h2 style="color: #2563eb;">Email Verification</h2>
        <p>Hi <b>${name}</b>,</p>
        <p>Thanks for signing up! Your OTP is:</p>
        <h1 style="color:#2563eb; letter-spacing: 4px;">${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you did not request this, ignore this email.</p>
        <hr />
        <p style="font-size: 12px; color: gray;">© ${new Date().getFullYear()} Interview Mate</p>
      </div>
    `;
  };
  