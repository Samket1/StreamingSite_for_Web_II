import { useState } from "react";
import { X, Loader } from "lucide-react";

export default function SignupLogin({ setAuthModalOpen, setUser, user, initialMode = "login" }) {
    const [authMode, setAuthMode] = useState(initialMode);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState(""); // Used for oldPassword in update mode
    const [newPassword, setNewPassword] = useState("");
    const [authMessage, setAuthMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleAuthSubmit = async (e) => {
        e.preventDefault();

        let url = "https://streamingsite-for-web-ii.onrender.com/api/auth/register";
        let method = "POST";
        let payload = { username, password };

        if (authMode === "login") {
            url = "https://streamingsite-for-web-ii.onrender.com/api/auth/login";
        } else if (authMode === "update") {
            url = "https://streamingsite-for-web-ii.onrender.com/api/auth/update-password";
            method = "PUT";
            payload = { username: user, oldPassword: password, newPassword: newPassword };
        }

        setIsLoading(true);
        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await response.json();

            setIsLoading(false);
            if (response.ok) {
                if (authMode === "login") {
                    if (data.token) {
                        localStorage.setItem("token", data.token);
                    }
                    localStorage.removeItem("savedUser");
                    setUser(data.username);
                    setAuthModalOpen(false);
                } else if (authMode === "register") {
                    setAuthMessage("Success! Now please sign in.");
                    setAuthMode("login");
                } else if (authMode === "update") {
                    setAuthMessage("Password updated successfully!");
                    setTimeout(() => setAuthModalOpen(false), 2000);
                }
            } else {
                setAuthMessage(data.error);
                setPassword("");
                setNewPassword("");
            }
        } catch (err) {
            setIsLoading(false);
            setAuthMessage("Server is offline!");
        }
    };

    return (
        <div className='auth-overlay'>
            <div className='auth-modal'>
                <button className='auth-close back-btn' onClick={() => setAuthModalOpen(false)}>
                    <X size={24} />
                </button>

                <h2 className='auth-title'>
                    {authMode === "login" ? "Sign In" : authMode === "register" ? "Sign Up" : "Update Password"}
                </h2>

                <form className='auth-form' onSubmit={handleAuthSubmit}>
                    {authMode !== "update" && (
                        <input
                            type="text"
                            placeholder="Username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    )}

                    <input
                        type="password"
                        placeholder={authMode === "update" ? "Old Password" : "Password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {authMode === "update" && (
                        <input
                            type="password"
                            placeholder="New Password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    )}

                    <button type="submit" className='btn-primary auth-submit-btn' disabled={isLoading} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                        {isLoading && <Loader size={20} className="spinner" />}
                        {isLoading ? "Loading..." : (authMode === "login" ? "Sign In" : authMode === "register" ? "Sign Up" : "Update Password")}
                    </button>
                </form>

                {authMessage && (
                    <p className='auth-message' style={{ 
                        color: authMessage.includes("Success") || authMessage.includes("updated") ? "#4ade80" : "#e50914",
                        textShadow: authMessage.includes("Success") || authMessage.includes("updated") ? "0 0 10px #4ade80" : "0 0 10px #e50914",
                        fontWeight: "bold",
                        textAlign: "center"
                    }}>
                        {authMessage}
                    </p>
                )}

                {authMode !== "update" && (
                    <div className='auth-switch'>
                        {authMode === "login" ? (
                            <p>New to StreamDopamine? <span onClick={() => { setAuthMode("register"); setAuthMessage(""); setPassword(""); setNewPassword(""); }}>Sign up now.</span></p>
                        ) : (
                            <p>Already have an account? <span onClick={() => { setAuthMode("login"); setAuthMessage(""); setPassword(""); setNewPassword(""); }}>Sign in.</span></p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}




