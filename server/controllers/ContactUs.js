const { getPool } = require('../config/database');
const sendResponse = require('../utlis/responseSender');
const {validateEmail} = require('../utlis/validateEmail');
const mailSender = require('../utlis/mailSender');
const { contactUsClientEmail } = require('../mails/contactUsMail');
const { contactUsAdminEmail } = require('../mails/sendMailToAdmin');
require('dotenv').config();

exports.contactUs = async (req, res) => {
    try {
        const { userId, firstName, lastName, email, phone, message } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !message) {
            return sendResponse(res, 400, false, 'Fill all required fields');
        }

        // Trim inputs
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        const trimmedEmail = email.trim();
        const trimmedPhone = phone.trim();
        const trimmedMessage = message.trim();

        // Validate email format
        if (!validateEmail(trimmedEmail)) {
            return sendResponse(res, 400, false, 'Invaild email');
        }

        const Pool = getPool();

        // Insert into the database
        const query = userId
            ? 'INSERT INTO ContactUs (userId, firstName, lastName, email, phone, message) VALUES (?,?,?,?,?,?)'
            : 'INSERT INTO ContactUs (firstName, lastName, email, phone, message) VALUES (?,?,?,?,?)';
        const params = userId
            ? [userId, trimmedFirstName, trimmedLastName, trimmedEmail, trimmedPhone, trimmedMessage]
            : [trimmedFirstName, trimmedLastName, trimmedEmail, trimmedPhone, trimmedMessage];

        await Pool.query(query, params);

        // Send emails
        await mailSender(
            trimmedEmail,
            'Contact Form Submission Received',
            contactUsClientEmail(`${trimmedFirstName} ${trimmedLastName}`)
        );

        if (!process.env.CUSTOMER_SUPPORT_EMAIL) {
            console.error("CUSTOMER_SUPPORT_EMAIL is not defined in the environment variables.");
        } else {
            await mailSender(
                process.env.CUSTOMER_SUPPORT_EMAIL,
                'New Contact Form Submission',
                contactUsAdminEmail(
                    `${trimmedFirstName} ${trimmedLastName}`,
                    trimmedEmail,
                    trimmedPhone,
                    trimmedMessage
                )
            );
        }

        return sendResponse(res, 200, true, 'Contact us submitted successfully');
    } catch (err) {
        console.error('Error occurred while submitting contact us:', err.stack);
        return sendResponse(res, 500, false, 'Internal Server Error');
    }
};