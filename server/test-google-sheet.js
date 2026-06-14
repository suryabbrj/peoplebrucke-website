require('dotenv').config();

const { isConfigured, logApplicationToSheet } = require('./google-sheet');

async function main() {
  if (!isConfigured()) {
    console.error('Google Sheets is not configured.');
    console.error('Set GOOGLE_SHEET_ID and GOOGLE_SERVICE_ACCOUNT_PATH (or GOOGLE_SERVICE_ACCOUNT_JSON) in .env');
    process.exit(1);
  }

  const fields = {
    'First name': 'Test',
    'Last name': 'Applicant',
    Email: 'test@example.com',
    Phone: '+971 50 000 0000',
    Location: 'Dubai',
    LinkedIn: 'https://linkedin.com/in/example',
    'Area of interest': 'Consulting',
    Experience: '5 years',
    Message: 'Google Sheet integration test row — safe to delete.',
  };

  const resume = {
    originalname: 'test-resume.pdf',
    mimetype: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4 test'),
  };

  await logApplicationToSheet({
    fields,
    resume,
    recipient: 'test@example.com',
  });

  console.log('Google Sheet test row added successfully.');
}

main().catch((err) => {
  console.error('Google Sheet test failed:', err.message);
  process.exit(1);
});
