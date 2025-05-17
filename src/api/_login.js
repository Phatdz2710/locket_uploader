import axios from 'axios';

const x_goog_api_key = "AIzaSyB5dTd-xiLD5dEfWq5OpptnQtnMpE0W0u8";
const url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${x_goog_api_key}`;

export async function login(email, password) {
    try {

        console.log(password);

        const data = {
            "email": email,
            "password": password,
            "returnSecureToken": true,
            "clientType": "CLIENT_TYPE_ANDROID"
        };

        const response = await axios.post(`${url}`, data, {
            headers: {
                "X-Android-Cert": "187A27D3D7364A044307F56E66230F973DCCD5B7",
                "X-Android-Package" : "com.locket.Locket",
            }
        })
        console.log("Login response:", {
            refreshToken: response.data.refreshToken,
            idToken: response.data.idToken,
            expiresIn: response.data.expiresIn,
            localId: response.data.localId,
            email: response.data.email,
        });

        return {
            success: true,
            refreshToken: response.data.refreshToken,
            idToken: response.data.idToken,
            expiresIn: response.data.expiresIn,
            localId: response.data.localId,
            email: response.data.email,
        };
    }
    catch (error) {
        console.error("Error logging in:", error);
        return {
            success: false,
            error: error.response ? error.response.data.error.message : "Unknown error",
        };
    }
}