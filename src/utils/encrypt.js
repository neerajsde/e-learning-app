const crypto = require('crypto');

const IV_LENGTH = 16;
const ENCRYPTION_KEY = Buffer.from(
    (process.env.NEXT_PUBLIC_ENCRYPTION_KEY || '').padEnd(32, '0').slice(0, 32),
    'utf8'
);

// Function to encrypt data
function encryptData(data) {
    const iv = crypto.randomBytes(IV_LENGTH); // Generate a random IV
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);

    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
    encrypted += cipher.final('base64');

    return {
        encryptedData: encrypted,
        iv: iv.toString('base64'),
    };
}

module.exports = encryptData;