import decryptData from "./decrypt";

// Example function to get session data
export const getSessionData = async (endpoint, token) => {
    try {
        // Get the session token from cookies (or token from the search params)
        const sessionToken = token;

        if (!sessionToken) {
            throw new Error('No session token available');
        }

        // Make a request to your backend API to fetch user data (using the token for authentication)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1${endpoint}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionToken}`,  // Include token in the Authorization header
                'Content-Type': 'application/json',
            },
        });

        const encryptedResponse = await response.json();
        return decryptData(encryptedResponse);
    } catch (error) {
        console.error(error);
        return { success: false, error: error.message };
    }
};
