import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/auth/login/",
        { username, password }
      );

      // ✅ Store token only on successful login
      localStorage.setItem("auth_token", res.data.token);
      navigate("/");
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-wrapper">
      <form className="card glass login-card" onSubmit={handleSubmit}>
        <h2>Login (Optional)</h2>

        <p style={{ fontSize: "13px", color: "#6b7280" }}>
          You may login for a personal session or continue
          using the demo mode.
        </p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn primary" type="submit">
          Login
        </button>

        <button
          type="button"
          className="btn"
          onClick={() => navigate("/")}
          style={{ marginTop: "10px" }}
        >
          Continue as Guest
        </button>

        {error && <p className="error-text">{error}</p>}
      </form>
    </div>
  );
}
