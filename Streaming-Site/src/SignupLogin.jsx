import { useState } from 'react';
import { X } from 'lucide-react';

export default function SignupLogin({ setAuthModalOpen, setUser }) {
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ username: "", password: "", newPassword: "" });
  const [authMessage, setAuthMessage] = useState("");

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    let url = "";
    let bodyData = {};

    if (authMode === "register") {
      url = "https://streamingsite-for-web-ii.onrender.com/api/auth/register";
      bodyData = { username: authForm.username, password: authForm.password };
    } else if (authMode === "login") {
      url = "https://streamingsite-for-web-ii.onrender.com/api/auth/login";
      bodyData = { username: authForm.username, password: authForm.password };
    } else if (authMode === "update") {
      url = "https://streamingsite-for-web-ii.onrender.com/api/auth/password";
      bodyData = { username: authForm.username, oldPassword: authForm.password, newPassword: authForm.newPassword };
    }

    try {
      const response = await fetch(url, {
        method: authMode === "update" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
      });
      const data = await response.json();

      if (response.ok) {
        if (authMode === "login") {
          setUser(data.username);
          setAuthMessage("Logged in successfully!");
          setTimeout(() => {
            setAuthModalOpen(false);
          }, 1000);
        } else {
          setAuthMessage(data.message || "Success!");
          if (authMode === "register") setAuthMode("login");
        }
      } else {
        setAuthMessage(data.error || "An error occurred");
      }
    } catch (err) {
      setAuthMessage("Network error. Please try again.");
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
          <input 
            type="text" 
            placeholder="Username" 
            required
            value={authForm.username}
            onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
          />
          <input 
            type="password" 
            placeholder={authMode === "update" ? "Old Password" : "Password"} 
            required
            value={authForm.password}
            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
          />
          {authMode === "update" && (
            <input 
              type="password" 
              placeholder="New Password" 
              required
              value={authForm.newPassword}
              onChange={(e) => setAuthForm({ ...authForm, newPassword: e.target.value })}
            />
          )}

          <button type="submit" className='btn-primary auth-submit-btn'>
            {authMode === "login" ? "Sign In" : authMode === "register" ? "Sign Up" : "Update"}
          </button>
        </form>

        {authMessage && <p className='auth-message' style={{ color: authMessage.includes("error") || authMessage.includes("Wrong") ? "#e50914" : "#4ade80", marginTop: "15px" }}>{authMessage}</p>}

        <div className='auth-switch'>
          {authMode === "login" && (
            <>
              New to StreamDopamine? <span onClick={() => { setAuthMode("register"); setAuthMessage(""); }}>Sign up now.</span>
              <br/><br/>
              Need to change password? <span onClick={() => { setAuthMode("update"); setAuthMessage(""); }}>Update here.</span>
            </>
          )}
          {authMode === "register" && (
            <>
              Already have an account? <span onClick={() => { setAuthMode("login"); setAuthMessage(""); }}>Sign in.</span>
            </>
          )}
          {authMode === "update" && (
            <>
              Remembered your password? <span onClick={() => { setAuthMode("login"); setAuthMessage(""); }}>Sign in.</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
