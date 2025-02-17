const decrypt = require("../utlis/decrypt");

exports.decryptData = async (req, res, next) => {
    try {
        if (req.body && typeof req.body === "object" && Object.keys(req.body).length > 0) {
            try {
                const decryptedData = decrypt(req.body);
                req.body = decryptedData; // Replace the original body with the decrypted data  
            } catch (decryptError) {
                console.error("Decryption failed:", decryptError.message);
                return res.status(400).json({ sucess: false, error: "Invalid encrypted data" });
            }
        }
        next();
    } catch (err) {
        console.error("Error in decryptData middleware:", err.message);
        res.status(500).json({ sucess: false, error: "Internal Server Error" });
    }
};