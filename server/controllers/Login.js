const { getPool } = require('../config/database');
const otpGenerator = require('otp-generator');
const mailSender = require('../utlis/mailSender');
const { sendUserOTPMail } = require('../mails/sendOtp');
const { sendPasswordChangeMail } = require('../mails/updatedPassword');
const {validateEmail} = require('../utlis/validateEmail');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendResponse = require("../utlis/responseSender");
require('dotenv').config();

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!email) {
            return sendResponse(res, 400, false, 'Email is required');
        }

        // Validate email format
        if (!validateEmail(email)) {
            return sendResponse(res, 400, false, 'Invalid email');
        }

        const Pool = getPool();

        // Check if user already exists
        const [result] = await Pool.query(`SELECT id FROM users WHERE email = ?`, [email.trim()]);
        if (result.length > 0) {
            return sendResponse(res, 409, false, 'User already exists');
        }

        // Generate OTP
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        // Send OTP email
        const isSent = await mailSender(email.trim(), 'Your OTP Code', sendUserOTPMail(otp));
        if (!isSent) {
            return sendResponse(res, 500, false, 'Failed to send OTP email');
        }

        // Store OTP in the database with expiration time
        await Pool.query(
            `INSERT INTO otp (email, otp) VALUES (?, ?)`,
            [email.trim(), otp]
        );

        return sendResponse(res, 200, true, 'OTP sent successfully');
    } catch (err) {
        console.error('Error while sending OTP:', err.message);
        return sendResponse(res, 500, false, 'Internal Server Error');
    }
};

exports.loginHandler = async (req, res) => {
    try {
        const { email, password, userType } = req.body;

        // Validate input
        if (!email || !password) {
            return sendResponse(res, 400, false, 'Email and password are required');
        }

        const trimmedEmail = email.trim();
        const Pool = getPool();

        // Fetch user from the database
        const [user] = await Pool.query(
            `SELECT id, email, password, active, accountType FROM users WHERE email = ? AND accountType = ?`, 
            [trimmedEmail, userType]
        );

        if (!user.length) {
            return sendResponse(res, 404, false, 'Your data not found, Please Sign up');
        }

        const userData = user[0];

        // Check if user is blocked
        if (!userData.active) {
            return sendResponse(res, 403, false, 'Your account is blocked for 24 hours');
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, userData.password);
        if (!isPasswordValid) {
            return sendResponse(res, 401, false, 'wrong password' );
        }

        // update user loggedin status
        await Pool.query(
            `UPDATE users SET isLoggedIn = TRUE WHERE id = ?`, 
            [userData.id]
        );

        // Generate JWT token
        const payload = { id: userData.id, role: userData.accountType };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' });

        return sendResponse(res, 200, true, 'Login successful', {user_id: userData.id, token});
    } catch (err) {
        console.error('Login Error:', err.message);
        return sendResponse(res, 500, false, 'An error occurred during login');
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return sendResponse(res, 400, false, 'All fields are required');
        }

        const Pool = getPool();
        const [user] = await Pool.query(
            `SELECT id, name, email, password, accountType FROM users WHERE id = ?`, 
            [req.user.id]
        );

        if (!user || user.length === 0) {
            return sendResponse(res, 404, false, 'User not found');
        }

        const userData = user[0];

        // Validate old password
        const isPasswordValid = await bcrypt.compare(oldPassword, userData.password);
        if (!isPasswordValid) {
            return sendResponse(res, 401, false, 'Incorrect old password');
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await Pool.query(
            'UPDATE users SET password = ? WHERE id = ?', 
            [hashedPassword, userData.id]
        );

        // Send email notification
        await mailSender(
            userData.email, 
            'Your OTP Code', 
            sendPasswordChangeMail(userData.name, userData.accountType)
        );

        return sendResponse(res, 200, true, 'Password updated successfully');
    } catch (err) {
        console.error('Change Password Error:', err.message);
        return sendResponse(res, 500, false, 'An error occurred during password change');
    }
};

exports.logOut = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return sendResponse(res, 400, false, "Invalid request, user not found");
        }

        const { id } = req.user;
        const token = req.headers["authorization"]?.split(' ')[1];
        if (!token) {
            return sendResponse(res, 401, false, "token is missing");
        }
        
        const Pool = getPool();
        // add blacklisttoken
        const [blacklistedTokens] = await Pool.query(
            `INSERT INTO blacklistedTokens (userId, token) VALUES (?, ?)`, 
            [id, token]
        );

        if (blacklistedTokens.affectedRows === 0) {
            return sendResponse(res, 404, false, "Logout failed, user not found");
        }

        // Update user login status
        const [result] = await Pool.query(
            `UPDATE users SET isLoggedIn = FALSE WHERE id = ?`, 
            [id]
        );

        if (result.affectedRows === 0) {
            return sendResponse(res, 404, false, "Logout failed, user not found");
        }

        return sendResponse(res, 200, true, "Logout successful");
    } catch (err) {
        console.error("Logout Error:", err.message);
        return sendResponse(res, 500, false, "An error occurred during logout");
    }
};
