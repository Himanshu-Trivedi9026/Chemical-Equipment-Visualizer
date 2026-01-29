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
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // ✅ ONLY PLACE TOKEN IS STORED
      localStorage.setItem("auth_token", res.data.token);

      // Redirect after login
      navigate("/");
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-wrapper">
      <form className="card glass login-card" onSubmit={handleSubmit}>
        <h2>Sign In</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn primary" type="submit">
          Login
        </button>

        {error && <p className="error-text">{error}</p>}
      </form>
    </div>
  );
}
