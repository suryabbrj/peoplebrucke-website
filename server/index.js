require('dotenv').config();

const path = require('path');
const express = require('express');
const multer = require('multer');
const { handleCareersSubmission, mapErrorMessage } = require('./careers-handler');

const app = express();
const PORT = Number(process.env.PORT) || 3456;
const ROOT = path.join(__dirname, '..');
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
});

const rateLimitMap = new Map();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, resetAt: now + RATE_WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_WINDOW_MS;
  }
  entry.count += 1;
  rateLimitMap.set(ip, entry);
  return entry.count > RATE_LIMIT;
}

app.use(express.json());

app.post('/api/careers', upload.single('resume'), async (req, res) => {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return res.status(429).json({ error: 'Too many submissions. Please try again later.' });
    }

    await handleCareersSubmission({
      fields: req.body,
      file: req.file,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error('Careers submission error:', err.message);
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({ error: mapErrorMessage(err) });
  }
});

app.use(express.static(ROOT));

app.listen(PORT, () => {
  console.log(`PeopleBrücke server running at http://localhost:${PORT}`);
});
