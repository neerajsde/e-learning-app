const { getPool } = require('../config/database');
const jwt = require('jsonwebtoken');
const sendResponse = require('../utlis/responseSender');
require('dotenv').config();

exports.auth = async (req, res, next) => {
    try {
        // Retrieve the token from cookies, body, or headers
        const token = req.cookies.StudyNotion || req.body.token || req.headers["authorization"]?.split(' ')[1];

        if (!token) {
            return sendResponse(res, 401, false, "Authorization token is missing");
        }

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
            if(err){
                if (err.name === "TokenExpiredError") {
                    return sendResponse(res, 401, false, "Token has expired!");
                }
                else{
                    return sendResponse(res, 401, false, "Invalid token");
                }
            }

            const Pool = getPool();
            // check Black Listed Tokens
            const [blacklistedTokens] = await Pool.query(`SELECT * FROM blacklistedTokens WHERE token = ?`, [token]);
            if (blacklistedTokens.length > 0) {
                return sendResponse(res, 409, false, 'invaild or expired token');
            }

            // Check if the user exists in the database
            const [result] = await Pool.query(`SELECT id, active, isLoggedIn FROM Users WHERE id = ?`, [payload.id]);
            if (result.length < 0) {
                return sendResponse(res, 409, false, 'Invaild user not found');
            }
            const userData = result[0];

            if (!userData.active) {
                return sendResponse(res, 403, false, "You are blocked");
            }

            if(!userData.isLoggedIn){
                await Pool.query(
                    `INSERT INTO blacklistedTokens (userId, token) VALUES (?, ?)`, 
                    [payload.id, token]
                );
                return sendResponse(res, 403, false, "Invaild Token. Please login");
            }

            req.user = payload;
            next();
        });
    } catch (err) {
        console.log("Internal server error while authentication: ", err.message);
        return  sendResponse(res, 500, false, "Internal Server Error", { message: err.message });
    }
};

exports.isStudent = async (req, res, next) => {
    try{
        if(req.user.role !== "Student"){
            return sendResponse(res, 403, false, "You can't access student route.");
        }
        next();
    } catch(err){
        console.log("Internal server error while authentication student: ", err.message);
        return  sendResponse(res, 500, false, "Internal Server Error", { message: err.message });
    }
}

exports.isInstructor = async (req, res, next) => {
    try{
        if(req.user.role !== "Instructor"){
            return sendResponse(res, 403, false, "You can't access instructor route.");
        }
        next();
    } catch(err){
        console.log("Internal server error while authentication Instructor: ", err.message);
        return  sendResponse(res, 500, false, "Internal Server Error", { message: err.message });
    }
}

exports.isAdmin = async (req, res, next) => {
    try{
        if(req.user.role !== "Admin"){
            return sendResponse(res, 403, false, "You can't access admin route.");
        }
        next();
    } catch(err){
        console.log("Internal server error while authentication admin: ", err.message);
        return  sendResponse(res, 500, false, "Internal Server Error", { message: err.message });
    }
}