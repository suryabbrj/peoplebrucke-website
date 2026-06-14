const Busboy = require('busboy');
const { handleCareersSubmission, mapErrorMessage } = require('../../server/careers-handler');

function parseMultipart(event) {
  return new Promise((resolve, reject) => {
    const contentType = event.headers['content-type'] || event.headers['Content-Type'];
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

    const body = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64')
      : Buffer.from(event.body || '', 'binary');
    busboy.end(body);
  });
}

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  try {
    const { fields, file } = await parseMultipart(event);
    await handleCareersSubmission({ fields, file });
    return jsonResponse(200, { ok: true });
  } catch (err) {
    console.error('Careers submission error:', err.message, err.stack);
    const statusCode = err.statusCode || 500;
    return jsonResponse(statusCode, { error: mapErrorMessage(err) });
  }
};
