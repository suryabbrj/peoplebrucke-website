const { getNextRecipient } = require('./round-robin');
const { sendApplicationEmail } = require('./mailer');
const { env } = require('./env');

const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const ALLOWED_EXT = ['.pdf', '.doc', '.docx'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function getTeamEmails() {
  const raw = env('TEAM_EMAILS');
  return raw.split(',').map((e) => e.trim()).filter(Boolean);
}

function getExtension(filename) {
  const i = filename.lastIndexOf('.');
  return i >= 0 ? filename.slice(i).toLowerCase() : '';
}

function isValidResume(file) {
  if (!file) return false;
  const size = file.size ?? file.buffer?.length ?? 0;
  if (size > MAX_FILE_SIZE) return false;
  const ext = getExtension(file.originalname || file.name || '');
  const mime = file.mimetype || file.type || '';
  return ALLOWED_EXT.includes(ext) || ALLOWED_MIME.has(mime);
}

function requiredField(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function mapErrorMessage(err) {
  if (err.statusCode === 400) {
    return err.message;
  }
  let message = 'Unable to submit your application. Please try again later or email careers@peoplebrucke.com directly.';
  if (err.message.includes('TEAM_EMAILS')) {
    message = 'Application service is not configured. Please contact careers@peoplebrucke.com directly.';
  } else if (err.message.includes('SMTP credentials')) {
    message = 'Email service is not configured on the server. Please contact careers@peoplebrucke.com directly.';
  } else if (
    err.message.includes('Invalid login')
    || err.message.includes('BadCredentials')
    || err.message.includes('Username and Password not accepted')
    || err.message.includes('EAUTH')
  ) {
    message = 'Unable to send your application right now. Please email careers@peoplebrucke.com directly with your resume.';
  }
  return message;
}

async function handleCareersSubmission({ fields, file }) {
  const {
    firstName,
    lastName,
    email,
    phone,
    location,
    linkedin,
    area,
    experience,
    message,
    consent,
    website,
  } = fields;

  if (website) {
    const error = new Error('Invalid submission.');
    error.statusCode = 400;
    throw error;
  }

  if (!requiredField(firstName) || !requiredField(lastName) || !requiredField(email)
    || !requiredField(phone) || !requiredField(location) || !requiredField(area)
    || !requiredField(experience) || !requiredField(message) || consent !== 'yes') {
    const error = new Error('Please complete all required fields.');
    error.statusCode = 400;
    throw error;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    const error = new Error('Please provide a valid email address.');
    error.statusCode = 400;
    throw error;
  }

  if (!file || !isValidResume(file)) {
    const error = new Error('Please upload a valid resume (PDF, DOC, or DOCX, max 5 MB).');
    error.statusCode = 400;
    throw error;
  }

  const teamEmails = getTeamEmails();
  const recipient = await getNextRecipient(teamEmails);

  const emailFields = {
    'First name': firstName.trim(),
    'Last name': lastName.trim(),
    Email: email.trim(),
    Phone: phone.trim(),
    Location: location.trim(),
    LinkedIn: linkedin?.trim() || '',
    'Area of interest': area.trim(),
    Experience: experience.trim(),
    Message: message.trim(),
  };

  const resume = {
    originalname: file.originalname || file.name || 'resume',
    mimetype: file.mimetype || file.type || 'application/octet-stream',
    buffer: file.buffer,
  };

  await sendApplicationEmail({
    recipient,
    fields: emailFields,
    resume,
  });

  return { ok: true };
}

module.exports = {
  handleCareersSubmission,
  mapErrorMessage,
  MAX_FILE_SIZE,
};
