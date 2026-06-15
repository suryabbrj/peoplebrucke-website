require('dotenv').config();

const { isConfigured, logApplicationToSheet, getNextApplicationId } = require('./google-sheet');

async function main() {
  if (!isConfigured()) {
    console.error('Google Sheets is not configured.');
    console.error('Set GOOGLE_SHEET_ID and GOOGLE_SERVICE_ACCOUNT_PATH (or GOOGLE_SERVICE_ACCOUNT_JSON) in .env');
    process.exit(1);
  }

  const applicationCode = await getNextApplicationId();
  const fields = {
    'Application ID': applicationCode,
    'First name': 'Test',
    'Last name': 'Applicant',
    Email: 'test@example.com',
    Phone: '+971 50 000 0000',
    City: 'Dubai',
    Country: 'UAE',
    Nationality: 'Emirati',
    Designation: 'AI/ML Engineer',
    LinkedIn: 'https://linkedin.com/in/example',
    'Area of interest': 'Artificial Intelligence and Technology',
    Experience: '5 years',
    Message: 'Google Sheet integration test row — safe to delete.',
  };

  await logApplicationToSheet({
    fields,
    recipient: 'test@example.com',
  });

  console.log(`Google Sheet test row added successfully with Application ID: ${applicationCode}`);
}

main().catch((err) => {
  console.error('Google Sheet test failed:', err.message);
  if (err.message.includes('storage quota') || err.message.includes('403')) {
    console.error('\nShare your Google Drive folder AND spreadsheet with this service account as Editor:');
    const fs = require('fs');
    const path = require('path');
    const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_PATH || './google-service-account.json';
    const resolved = path.isAbsolute(keyPath)
      ? keyPath
      : path.join(__dirname, '..', keyPath.replace(/^\.\//, ''));
    if (fs.existsSync(resolved)) {
      const email = JSON.parse(fs.readFileSync(resolved, 'utf8')).client_email;
      console.error(`  ${email}`);
    }
  }
  process.exit(1);
});
