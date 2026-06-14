const fs = require('fs');
const { Readable } = require('stream');
const { google } = require('googleapis');
const { env } = require('./env');

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

const HEADER_ROW = [
  'Submitted At',
  'First Name',
  'Last Name',
  'Email',
  'Phone',
  'Location',
  'LinkedIn',
  'Area of Interest',
  'Experience',
  'Message',
  'Resume Link',
  'Routed To',
];

function getSheetId() {
  return env('GOOGLE_SHEET_ID');
}

function getDriveFolderId() {
  return env('GOOGLE_DRIVE_FOLDER_ID');
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
  if (keyPath && fs.existsSync(keyPath)) {
    return JSON.parse(fs.readFileSync(keyPath, 'utf8'));
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
    drive: google.drive({ version: 'v3', auth: authClient }),
  };
}

async function ensureHeaderRow(sheets) {
  const sheetId = getSheetId();
  const tab = getSheetTab();
  const range = `${tab}!A1:L1`;

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

async function uploadResumeToDrive(drive, resume) {
  const folderId = getDriveFolderId();
  const safeName = (resume.originalname || 'resume').replace(/[^\w.\-()+\s]/g, '_');
  const fileMetadata = {
    name: `${Date.now()}-${safeName}`,
    ...(folderId ? { parents: [folderId] } : {}),
  };

  const created = await drive.files.create({
    requestBody: fileMetadata,
    media: {
      mimeType: resume.mimetype || 'application/octet-stream',
      body: Readable.from(resume.buffer),
    },
    fields: 'id, webViewLink',
  });

  await drive.permissions.create({
    fileId: created.data.id,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  return created.data.webViewLink || `https://drive.google.com/file/d/${created.data.id}/view`;
}

async function appendApplicationRow(sheets, { fields, resumeLink, recipient }) {
  const sheetId = getSheetId();
  const tab = getSheetTab();

  await ensureHeaderRow(sheets);

  const row = [
    new Date().toISOString(),
    fields['First name'],
    fields['Last name'],
    fields.Email,
    fields.Phone,
    fields.Location,
    fields.LinkedIn || '',
    fields['Area of interest'],
    fields.Experience,
    fields.Message,
    resumeLink,
    recipient,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${tab}!A:L`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [row] },
  });
}

async function logApplicationToSheet({ fields, resume, recipient }) {
  if (!isConfigured()) {
    return;
  }

  const { sheets, drive } = await getClients();
  const resumeLink = await uploadResumeToDrive(drive, resume);
  await appendApplicationRow(sheets, { fields, resumeLink, recipient });
}

module.exports = {
  logApplicationToSheet,
  isConfigured,
  HEADER_ROW,
};
