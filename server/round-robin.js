const fs = require('fs');
const path = require('path');

const COUNTER_PATH = path.join(__dirname, 'data', 'submission-counter.json');
const BLOB_STORE = 'careers-round-robin';
const BLOB_KEY = 'count';

function isNetlifyRuntime() {
  return Boolean(
    process.env.NETLIFY
    || process.env.AWS_LAMBDA_FUNCTION_NAME
    || process.env.NETLIFY_DEV
  );
}

function ensureDataDir() {
  const dir = path.dirname(COUNTER_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readCounterFile() {
  ensureDataDir();
  if (!fs.existsSync(COUNTER_PATH)) {
    return 0;
  }
  try {
    const data = JSON.parse(fs.readFileSync(COUNTER_PATH, 'utf8'));
    return Number.isInteger(data.count) ? data.count : 0;
  } catch {
    return 0;
  }
}

function writeCounterFile(count) {
  try {
    ensureDataDir();
    fs.writeFileSync(COUNTER_PATH, JSON.stringify({ count }, null, 2));
  } catch (err) {
    console.warn('Unable to write local round-robin counter file (read-only filesystem):', err.message);
  }
}

async function readCounterBlobs() {
  const { getStore } = require('@netlify/blobs');
  const store = getStore(BLOB_STORE);
  const value = await store.get(BLOB_KEY, { type: 'text' });
  const count = parseInt(value || '0', 10);
  return Number.isNaN(count) ? 0 : count;
}

async function writeCounterBlobs(count) {
  const { getStore } = require('@netlify/blobs');
  const store = getStore(BLOB_STORE);
  await store.set(BLOB_KEY, String(count));
}

async function getNextRecipient(teamEmails) {
  if (!teamEmails.length) {
    throw new Error('TEAM_EMAILS is not configured');
  }

  // If running on Vercel or other non-Netlify serverless runtimes, use the time-based fallback directly.
  // There is no persistent local file storage on Vercel functions.
  if (process.env.VERCEL || (process.env.AWS_LAMBDA_FUNCTION_NAME && !process.env.NETLIFY)) {
    const index = Math.floor(Date.now() / (60 * 60 * 1000)) % teamEmails.length;
    return teamEmails[index];
  }

  let count;
  if (isNetlifyRuntime()) {
    try {
      count = await readCounterBlobs();
      const index = count % teamEmails.length;
      const recipient = teamEmails[index];
      await writeCounterBlobs(count + 1);
      return recipient;
    } catch (err) {
      console.error('Round-robin blob storage failed, using time-based fallback:', err.message);
      const index = Math.floor(Date.now() / (60 * 60 * 1000)) % teamEmails.length;
      return teamEmails[index];
    }
  }

  count = readCounterFile();
  const index = count % teamEmails.length;
  const recipient = teamEmails[index];
  writeCounterFile(count + 1);
  return recipient;
}

module.exports = { getNextRecipient, readCounter: readCounterFile };
