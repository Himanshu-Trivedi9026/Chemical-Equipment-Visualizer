import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./auth/Login";
import Dashboard from "./pages/Dashboard";

import "./styles/app.css";

export default function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        {/* OPTIONAL LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* DEFAULT DASHBOARD */}
        <Route
          path="/"
          element={
            <>
              {/* HEADER */}
              <header className="app-header glass">
                <h1>Chemical Equipment Parameter Visualizer</h1>

                <div className="header-actions">
                  <button
                    className="btn"
                    onClick={() =>
                      setTheme((t) =>
                        t === "light" ? "dark" : "light"
                      )
                    }
                  >
                    Toggle Theme
                  </button>

                  <button
                    className="btn"
                    onClick={() => {
                      localStorage.removeItem("auth_token");
                      window.location.href = "/";
                    }}
                  >
                    Logout
                  </button>
                </div>
              </header>

              {/* MAIN */}
              <main className="app-container">
                <Dashboard />
              </main>

              {/* FOOTER */}
              <footer className="app-footer glass">
                © 2026 Chemical Equipment Visualizer
              </footer>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
