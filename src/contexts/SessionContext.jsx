import { login } from "../api/_login";
import { upload } from "../api/_upload";

const { useContext, createContext } = require("react");

const sessionContext = createContext({
    login: () => Promise,
    upload: () => Promise,
})

const SessionProvider = ({ children }) => {

    const doLogin = async (email, password) => {
        const response = await login(email, password);

        if (response.success) {
            localStorage.setItem("refreshToken", response.refreshToken);
            localStorage.setItem("idToken", response.idToken);
            localStorage.setItem("expiresIn", response.expiresIn);
            localStorage.setItem("localId", response.localId);
            localStorage.setItem("email", response.email);
        } else {
            console.error("Login failed:", response.error);
        }

        return response.success;
    }
    
    const doUpload = async (image, caption, textColor, backgroundColor) => {
        const result =  await upload(image, caption, textColor, backgroundColor);
        if (result) {
            console.log("Upload successful");
        } else {
            console.error("Upload failed");
        }
    }
    
    return (
        <sessionContext.Provider value={{
            login: doLogin,
            upload: doUpload,
        }}>
            {children}
        </sessionContext.Provider>
    )
}

export default SessionProvider;

export const useSession = () => {
    const context = useContext(sessionContext);
    if (!context) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
}
