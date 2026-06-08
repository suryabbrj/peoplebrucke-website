require('dotenv').config();
const nodemailer = require('nodemailer');

const { SMTP_USER, SMTP_PASS } = process.env;

if (!SMTP_USER || !SMTP_PASS) {
  console.error('Missing SMTP_USER or SMTP_PASS in .env');
  process.exit(1);
}

const transport = nodemailer.createTransport({
  service: SMTP_USER.endsWith('@gmail.com') ? 'gmail' : undefined,
  host: SMTP_USER.endsWith('@gmail.com') ? undefined : process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

transport.verify()
  .then(() => {
    console.log('SMTP connection OK —', SMTP_USER);
    process.exit(0);
  })
  .catch((err) => {
    console.error('SMTP failed:', err.message);
    if (err.message.includes('Invalid login') || err.message.includes('BadCredentials')) {
      console.error('\nGmail blocks normal passwords for SMTP. Create an App Password:');
      console.error('https://myaccount.google.com/apppasswords');
      console.error('Then set SMTP_PASS in .env to the 16-character app password.');
    }
    process.exit(1);
  });
