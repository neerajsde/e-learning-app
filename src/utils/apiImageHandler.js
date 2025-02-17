const decryptData = require("./decrypt");

const apiImgSender = async (pathname, method = "POST", includeToken = false, body = null) => {
    try {
        const headers = {};

        if (includeToken) {
            const token = localStorage.getItem("StudyNotion");
            if (!token) {
                throw new Error("Token is empty");
            }
            headers["Authorization"] = `Bearer ${token}`;
        }

        const options = {
            method,
            headers,
            body,  // No need to stringify FormData, it should be passed as is.
        };
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1${pathname}`, options);

        const encryptedResponse = await response.json();
        return decryptData(encryptedResponse);
    } catch (error) {
        console.error("API call failed:", error.message);
        return { success: false, message: error.message };
    }
};

module.exports = apiImgSender;
