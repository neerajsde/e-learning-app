const encrypt = require('./encrypt');

function sendResponse(res, statusCode, success, message, data = null) {
    const responsePayload = { success, message };

    // Include additional data if provided
    if (data) {
        responsePayload.data = data;
    }

    // Encrypt the response
    const encodedResponse = encrypt(responsePayload);
    // const encodedResponse = responsePayload;

    res.status(statusCode).json(encodedResponse);
}

module.exports = sendResponse;
