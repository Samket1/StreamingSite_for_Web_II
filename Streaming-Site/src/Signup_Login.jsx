import { useState } from "react";
import { X } from "lucide-react";

export default function SignupLogin({ setAuthModalOpen, setUser, user, initialMode = "login" }) {
    const [authMode, setAuthMode] = useState(initialMode);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState(""); // Used for oldPassword in update mode
    const [newPassword, setNewPassword] = useState("");
    const [authMessage, setAuthMessage] = useState("");

    const handleAuthSubmit = async (e) => {
        e.preventDefault();

        let url = "http://localhost:5000/api/auth/register";
        let method = "POST";
        let payload = { username, password };

        if (authMode === "login") {
            url = "http://localhost:5000/api/auth/login";
        } else if (authMode === "update") {
            url = "http://localhost:5000/api/auth/update-password";
            method = "PUT";
            payload = { username: user, oldPassword: password, newPassword: newPassword };
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await response.json();

            if (response.ok) {
                if (authMode === "login") {
                    setUser(data.username);
                    localStorage.setItem("savedUser", data.username);
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
            }
        } catch (err) {
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

                    <button type="submit" className='btn-primary auth-submit-btn'>
                        {authMode === "login" ? "Sign In" : authMode === "register" ? "Sign Up" : "Update Password"}
                    </button>
                </form>
                
                {authMessage && (
                    <p className='auth-message' style={{ color: authMessage.includes("offline") || authMessage.includes("error") || authMessage.includes("already") || authMessage.includes("Wrong") ? "#e50914" : "#4ade80" }}>
                        {authMessage}
                    </p>
                )}
                
                {authMode !== "update" && (
                    <div className='auth-switch'>
                        {authMode === "login" ? (
                            <p>New to StreamDopamine? <span onClick={() => { setAuthMode("register"); setAuthMessage(""); }}>Sign up now.</span></p>
                        ) : (
                            <p>Already have an account? <span onClick={() => { setAuthMode("login"); setAuthMessage(""); }}>Sign in.</span></p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
