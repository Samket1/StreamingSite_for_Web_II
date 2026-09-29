import { useState } from "react";
import { X } from "lucide-react";

export default function SignupLogin({ setAuthModalOpen, setUser }) {
    const [authMode, setAuthMode] = useState("login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [authMessage, setAuthMessage] = useState("");

    const handleAuthSubmit = async (e) => {
        e.preventDefault();

        const url = authMode === "login" 
            ? "http://localhost:5000/api/auth/login" 
            : "http://localhost:5000/api/auth/register";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            if (response.ok) {
                if (authMode === "login") {
                    setUser(data.username);
                    localStorage.setItem("savedUser", data.username);
                    setAuthModalOpen(false);
                } else {
                    setAuthMessage("Success! Now please sign in.");
                    setAuthMode("login");
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

                <h2 className='auth-title'>{authMode === "login" ? "Sign In" : "Sign Up"}</h2>
                
                <form className='auth-form' onSubmit={handleAuthSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className='btn-primary auth-submit-btn'>
                        {authMode === "login" ? "Sign In" : "Sign Up"}
                    </button>
                </form>
                
                {authMessage && (
                    <p className='auth-message' style={{ color: authMessage.includes("offline") || authMessage.includes("error") || authMessage.includes("already") || authMessage.includes("Wrong") ? "#e50914" : "#4ade80" }}>
                        {authMessage}
                    </p>
                )}
                
                <div className='auth-switch'>
                    {authMode === "login" ? (
                        <p>New to StreamDopamine? <span onClick={() => { setAuthMode("register"); setAuthMessage(""); }}>Sign up now.</span></p>
                    ) : (
                        <p>Already have an account? <span onClick={() => { setAuthMode("login"); setAuthMessage(""); }}>Sign in.</span></p>
                    )}
                </div>
            </div>
        </div>
    );
}

