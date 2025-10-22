import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const hasSmtp = !!(process.env.SMTP_USER && process.env.SMTP_PASS);

let transporter = null;
if (hasSmtp) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    logger: true,
    debug: true,
  });

  transporter.verify().then(() => {
    console.log("SMTP verified");
  }).catch((err) => {
    console.error("SMTP verify failed:", err.message || err);
  });
} else {
  console.warn("SMTP not configured — sendEmail will log messages to console (dev only).");
}

export default async function sendEmail({ email, subject, message }) {
  if (!hasSmtp) {
    console.log(`[sendEmail fallback] to=${email} subject=${subject} message=${message}`);
    return Promise.resolve({ info: "logged-to-console-fallback" });
  }
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject,
    text: message,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("sendEmail success:", info.response || info);
    return info;
  } catch (err) {
    console.error("sendEmail error:", err);
    throw err;
  }
}