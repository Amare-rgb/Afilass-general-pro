// lib/jwt.js
const crypto = require('crypto');

let cachedSecret = null;

function getJwtSecret() {
  if (cachedSecret) {
    return cachedSecret;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret || typeof secret !== 'string' || !secret.trim()) {
    throw new Error('JWT_SECRET is not configured. Add JWT_SECRET=your-secret-key to your .env file.');
  }

  cachedSecret = secret.trim();

  const fingerprint = crypto.createHash('sha256').update(cachedSecret).digest('hex').substring(0, 8);
  console.log(`🔑 JWT secret fingerprint: ${fingerprint} | length: ${cachedSecret.length}`);

  return cachedSecret;
}

module.exports = { getJwtSecret };