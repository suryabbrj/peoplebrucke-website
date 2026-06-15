const Busboy = require('busboy');
const { handleCareersSubmission, mapErrorMessage } = require('../server/careers-handler');

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

    const busboy = Busboy({ headers: { 'content-type': contentType } });

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

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fields, file } = await parseMultipart(req);
    await handleCareersSubmission({ fields, file });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Careers submission error:', err.message, err.stack);
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({ error: mapErrorMessage(err) });
  }
};

// Disable Vercel's default body parser to handle raw multipart file streaming
module.exports.config = {
  api: {
    bodyParser: false,
  },
};
