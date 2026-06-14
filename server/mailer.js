const nodemailer = require('nodemailer');
const { env } = require('./env');

function createTransport() {
  const SMTP_HOST = env('SMTP_HOST');
  const SMTP_PORT = env('SMTP_PORT');
  const SMTP_USER = env('SMTP_USER');
  const SMTP_PASS = env('SMTP_PASS');
  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP credentials are not configured');
  }

  const isGmail = SMTP_USER.endsWith('@gmail.com')
    || SMTP_HOST === 'smtp.gmail.com';

  if (isGmail) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  if (!SMTP_HOST) {
    throw new Error('SMTP credentials are not configured');
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildEmailHtml(fields) {
  const rows = Object.entries(fields)
    .map(([key, value]) => `<tr><td style="padding:6px 12px 6px 0;font-weight:500;vertical-align:top">${escapeHtml(key)}</td><td style="padding:6px 0">${escapeHtml(value || '—')}</td></tr>`)
    .join('');

  return `
    <h2 style="font-family:sans-serif;color:#0a2547">New Careers Application</h2>
    <table style="font-family:sans-serif;font-size:15px;color:#0a2547;border-collapse:collapse">${rows}</table>
  `;
}

async function sendApplicationEmail({ recipient, fields, resume }) {
  const transport = createTransport();
  const from = env('MAIL_FROM') || env('SMTP_USER') || 'careers@peoplebrucke.com';
  const name = `${fields['First name'] || ''} ${fields['Last name'] || ''}`.trim() || 'Applicant';

  await transport.sendMail({
    from,
    to: recipient,
    subject: `New Careers Application — ${name}`,
    text: Object.entries(fields).map(([k, v]) => `${k}: ${v || '—'}`).join('\n'),
    html: buildEmailHtml(fields),
    attachments: resume
      ? [{
          filename: resume.originalname,
          content: resume.buffer,
          contentType: resume.mimetype,
        }]
      : [],
  });
}

module.exports = { sendApplicationEmail };
