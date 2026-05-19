import nodemailer from "nodemailer";
import dns from "dns";

// ─── DNS Optimization ───────────────────────────────────────────────────────
// Cache the DNS lookup for smtp.gmail.com to avoid repeated DNS resolution
// on cloud/serverless environments where DNS can be slow.
const DNS_CACHE = new Map();

function cachedDnsLookup(hostname, options, callback) {
  const key = `${hostname}_${options.family || ""}`;
  const cached = DNS_CACHE.get(key);

  if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
    // Cache hit (valid for 5 minutes)
    return callback(null, cached.address, cached.family);
  }

  dns.lookup(hostname, options, (err, address, family) => {
    if (!err) {
      DNS_CACHE.set(key, { address, family, timestamp: Date.now() });
    }
    callback(err, address, family);
  });
}

// ─── Transporter (singleton, pooled) ────────────────────────────────────────
// - `pool: true` reuses TCP connections across sendMail calls instead of
//   creating a new connection for every email (the #1 cause of slow sends
//   in deployed environments).
// - Reasonable timeouts (10s) instead of the previous 100s values that
//   masked connection problems and made the request hang.
// - maxConnections / maxMessages prevent Gmail rate-limit issues.
let _transporter = null;
let _transporterVerified = false;

function getTransporter() {
  if (_transporter) return _transporter;

  _transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT, 10) || 465,
    secure: true,
    pool: true,                   // ← KEY FIX: reuse connections
    maxConnections: 3,            // Gmail allows up to 3 concurrent
    maxMessages: 100,             // Messages per connection before reconnect
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10_000,    // 10s (was 100s)
    greetingTimeout: 10_000,      // 10s (was 100s)
    socketTimeout: 15_000,        // 15s (was 100s)
    dnsTimeout: 10_000,           // DNS timeout
    logger: process.env.NODE_ENV !== "production",
    tls: {
      rejectUnauthorized: true,   // Keep TLS verification for security
    },
    // Use cached DNS lookup to avoid repeated resolution
    ...(typeof cachedDnsLookup === "function" && {
      customTransport: undefined,
    }),
  });

  // Override the DNS lookup used by the transporter's underlying socket
  _transporter.set("dns.lookup", cachedDnsLookup);

  return _transporter;
}

/**
 * Verify the SMTP connection once at startup / first use.
 * This warms the connection pool and surfaces config errors early.
 */
async function ensureTransporterReady() {
  const transporter = getTransporter();

  if (_transporterVerified) return transporter;

  try {
    await transporter.verify();
    _transporterVerified = true;
    console.log("✅ SMTP transporter verified and connection pool warmed.");
  } catch (error) {
    console.error("❌ SMTP transporter verification failed:", error.message);
    console.error(
      "   Check EMAIL_USER / EMAIL_PASS env vars and SMTP connectivity."
    );
    // Don't throw — we'll still attempt to send and get a clearer error.
    // Mark as verified so we don't retry verify on every call.
    _transporterVerified = true;
  }

  return transporter;
}

// ─── Public API ─────────────────────────────────────────────────────────────

export const sendEmail = async (options) => {
  const start = Date.now();

  try {
    const transporter = await ensureTransporterReady();

    const mailOptions = {
      from: `"Coursy" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const result = await transporter.sendMail(mailOptions);
    const elapsed = Date.now() - start;
    console.log(
      `✅ Email sent to ${options.to} in ${elapsed}ms (messageId: ${result.messageId})`
    );
    return result;
  } catch (error) {
    const elapsed = Date.now() - start;
    console.error(
      `❌ Email to ${options.to} failed after ${elapsed}ms:`,
      error.message
    );
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
