require('dotenv').config();

const path = require('path');
const express = require('express');
const Busboy = require('busboy');
const { handleCareersSubmission, mapErrorMessage } = require('./careers-handler');
const { env } = require('./env');

const app = express();
const PORT = Number(env('PORT')) || 3456;
const ROOT = path.join(__dirname, '..');
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers['content-type'] || req.headers['Content-Type'];
    if (!contentType) {
      reject(new Error('Missing content type'));
      return;
    }

    const fields = {};
    let file = null;
    const fileWrites = [];

    const busboy = Busboy({
      headers: { 'content-type': contentType },
      limits: { fileSize: MAX_FILE_SIZE }
    });

    busboy.on('file', (fieldname, stream, info) => {
      if (fieldname !== 'resume') {
        stream.resume();
        return;
      }

      const chunks = [];
      const filePromise = new Promise((resolveFile, rejectFile) => {
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', rejectFile);
        stream.on('end', () => {
          const buffer = Buffer.concat(chunks);
          file = {
            buffer,
            originalname: info.filename,
            mimetype: info.mimeType,
            size: buffer.length,
          };
          resolveFile();
        });
      });
      fileWrites.push(filePromise);
    });

    busboy.on('field', (name, value) => {
      fields[name] = value;
    });

    busboy.on('error', reject);
    busboy.on('finish', () => {
      Promise.all(fileWrites)
        .then(() => resolve({ fields, file }))
        .catch(reject);
    });

    req.pipe(busboy);
  });
}

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

app.post('/api/careers', async (req, res) => {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return res.status(429).json({ error: 'Too many submissions. Please try again later.' });
    }

    const { fields, file } = await parseMultipart(req);

    await handleCareersSubmission({
      fields,
      file,
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
