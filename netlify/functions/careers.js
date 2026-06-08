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
    const busboy = Busboy({ headers: { 'content-type': contentType } });

    busboy.on('file', (fieldname, stream, info) => {
      if (fieldname !== 'resume') {
        stream.resume();
        return;
      }
      const chunks = [];
      let size = 0;
      stream.on('data', (chunk) => {
        size += chunk.length;
        chunks.push(chunk);
      });
      stream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        file = {
          buffer,
          originalname: info.filename,
          mimetype: info.mimeType,
          size: buffer.length,
        };
      });
    });

    busboy.on('field', (name, value) => {
      fields[name] = value;
    });

    busboy.on('error', reject);
    busboy.on('finish', () => resolve({ fields, file }));

    const body = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64')
      : Buffer.from(event.body || '', event.isBase64Encoded ? 'binary' : 'utf8');
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
    console.error('Careers submission error:', err.message);
    const statusCode = err.statusCode || 500;
    return jsonResponse(statusCode, { error: mapErrorMessage(err) });
  }
};
