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

        // 🛠️ Only set Content-Type if body is NOT FormData
        if (!(body instanceof FormData)) {
            headers["Content-Type"] = "application/json";
        }

        // Debugging FormData before sending
        // if (body instanceof FormData) {
        //     console.log("✅ FormData is being sent:");
        //     for (let pair of body.entries()) {
        //         console.log(`${pair[0]}:`, pair[1]);
        //     }
        // }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1${pathname}`, {
            method,
            headers,
            body,
        });

        const encryptedResponse = await response.json();
        return decryptData(encryptedResponse);
    } catch (error) {
        console.error("API call failed:", error.message);
        return { success: false, message: error.message };
    }
};

module.exports = apiImgSender;
