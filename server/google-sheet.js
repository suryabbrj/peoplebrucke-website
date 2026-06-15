const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { env } = require('./env');

const PROJECT_ROOT = path.join(__dirname, '..');

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
];

const HEADER_ROW = [
  'Submitted At',
  'Application ID',
  'First Name',
  'Last Name',
  'Email',
  'Phone',
  'City',
  'Country',
  'Nationality',
  'Designation',
  'Area of Interest',
  'LinkedIn',
  'Experience',
  'Message',
  'Routed To',
];

function extractSheetId(value) {
  if (!value) return '';
  const match = value.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : value.trim();
}

function getSheetId() {
  return extractSheetId(env('GOOGLE_SHEET_ID'));
}

function getSheetTab() {
  return env('GOOGLE_SHEET_TAB') || 'Applications';
}

function getServiceAccountCredentials() {
  const json = env('GOOGLE_SERVICE_ACCOUNT_JSON');
  if (json) {
    try {
      return JSON.parse(json);
    } catch {
      try {
        return JSON.parse(Buffer.from(json, 'base64').toString('utf8'));
      } catch {
        return null;
      }
    }
  }

  const keyPath = env('GOOGLE_SERVICE_ACCOUNT_PATH');
  if (keyPath) {
    const resolved = path.isAbsolute(keyPath)
      ? keyPath
      : path.join(PROJECT_ROOT, keyPath.replace(/^\.\//, ''));
    if (fs.existsSync(resolved)) {
      return JSON.parse(fs.readFileSync(resolved, 'utf8'));
    }
  }

  return null;
}

function isConfigured() {
  return Boolean(getSheetId() && getServiceAccountCredentials());
}

async function getClients() {
  const credentials = getServiceAccountCredentials();
  if (!credentials) {
    throw new Error('Google service account credentials are not configured');
  }

  const auth = new google.auth.GoogleAuth({ credentials, scopes: SCOPES });
  const authClient = await auth.getClient();

  return {
    sheets: google.sheets({ version: 'v4', auth: authClient }),
  };
}

async function ensureHeaderRow(sheets) {
  const sheetId = getSheetId();
  const tab = getSheetTab();
  const range = `${tab}!A1:O1`;

  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });

  if (existing.data.values?.[0]?.length) {
    return;
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [HEADER_ROW] },
  });
}

async function appendApplicationRow(sheets, { fields, recipient }) {
  const sheetId = getSheetId();
  const tab = getSheetTab();

  await ensureHeaderRow(sheets);

  let phone = fields.Phone || '';
  if (phone.startsWith('+')) {
    phone = `'${phone}`;
  }

  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timestamp = `${day}/${month}/${year} ${hours}:${minutes}`;

  const row = [
    timestamp,
    fields['Application ID'],
    fields['First name'],
    fields['Last name'],
    fields.Email,
    phone,
    fields.City,
    fields.Country,
    fields.Nationality,
    fields.Designation,
    fields['Area of interest'],
    fields.LinkedIn || '',
    fields.Experience,
    fields.Message,
    recipient,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${tab}!A:O`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [row] },
  });
}

async function logApplicationToSheet({ fields, recipient }) {
  if (!isConfigured()) {
    return;
  }

  const { sheets } = await getClients();
  await appendApplicationRow(sheets, { fields, recipient });
}

const COUNTER_FILE = path.join(__dirname, 'application-id-counter.txt');
const START_ID = 100005;
let counterPromise = null;

async function getNextApplicationId() {
  if (counterPromise) {
    counterPromise = counterPromise.then(() => performGetNextId());
  } else {
    counterPromise = performGetNextId();
  }
  return counterPromise;
}

async function performGetNextId() {
  let nextId = START_ID;

  // 1. Try reading local counter file
  if (fs.existsSync(COUNTER_FILE)) {
    try {
      const val = parseInt(fs.readFileSync(COUNTER_FILE, 'utf8').trim(), 10);
      if (!isNaN(val) && val >= START_ID) {
        nextId = val;
      }
    } catch (err) {
      console.error('Error reading ID counter file:', err.message);
    }
  } else {
    // 2. Initialize from Google Sheets if no local counter file exists
    try {
      if (isConfigured()) {
        const credentials = getServiceAccountCredentials();
        if (credentials) {
          const auth = new google.auth.GoogleAuth({ credentials, scopes: SCOPES });
          const authClient = await auth.getClient();
          const sheets = google.sheets({ version: 'v4', auth: authClient });
          const sheetId = getSheetId();
          const tab = getSheetTab();

          const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: `${tab}!B2:B`,
          });

          const rows = response.data.values;
          let maxId = START_ID - 1;

          if (rows && rows.length > 0) {
            rows.forEach((row) => {
              const val = parseInt(row[0], 10);
              if (!isNaN(val) && val > maxId) {
                maxId = val;
              }
            });
          }
          nextId = maxId + 1;
        }
      }
    } catch (err) {
      console.error('Error querying Google Sheets for max ID:', err.message);
    }
  }

  // Write the next consecutive ID to the file
  try {
    fs.writeFileSync(COUNTER_FILE, (nextId + 1).toString(), 'utf8');
  } catch (err) {
    console.error('Error writing next ID counter to file:', err.message);
  }

  return nextId.toString();
}

module.exports = {
  logApplicationToSheet,
  isConfigured,
  getNextApplicationId,
  HEADER_ROW,
};
