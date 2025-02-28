const decryptData = require("./decrypt");
const encryptData = require("./encrypt");

const apiHandler = async (pathname, method = 'GET', includeToken = false, body = null, cache = null) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (includeToken) {
            const token = localStorage.getItem("StudyNotion");
            if (!token){
                throw new Error('Token empty');
            }
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const options = {
            method,
            headers,
        };
        
        if (body && (method === 'POST' || method === 'PUT')) {
            const encryptedBodyData = encryptData(body);
            options.body = JSON.stringify(encryptedBodyData);
        }
        
        let response = null;
        if(cache){
            response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1${pathname}`, options, cache);
        } else{
            response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1${pathname}`, options);
        }

        
        const encryptedResponse = await response.json();
        return decryptData(encryptedResponse);
    } catch (error) {
        console.error('API call failed:', error);
        return { success: false, message: error.message };
    }
};
module.exports = apiHandler;