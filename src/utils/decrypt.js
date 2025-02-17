const crypto = require('crypto');

const IV_LENGTH = 16;
const ENCRYPTION_KEY = Buffer.from(
    (process.env.NEXT_PUBLIC_ENCRYPTION_KEY || '').padEnd(32, '0').slice(0, 32),
    'utf8'
);

// Function to decrypt data
function decryptData({ encryptedData, iv }) {
    const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        ENCRYPTION_KEY,
        Buffer.from(iv, 'base64')
    );

    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
}

module.exports = decryptData;