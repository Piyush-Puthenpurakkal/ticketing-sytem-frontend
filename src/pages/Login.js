import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import AxiosInstance from "../api/AxiosInstance";
import "../styles/auth.css";

import logo from "../assets/hubly-logo.png";
import illustrationImage from "../assets/illustration-image.png";
import eyeOpenIcon from "../assets/icons/eyeOpen.png";
import eyeClosedIcon from "../assets/icons/eyeClosed.png";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!credentials.email.trim() || !credentials.password.trim()) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await AxiosInstance.post("/auth/login", credentials);
      const { token, user } = data;
      localStorage.setItem("token", token);
      login(user);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err?.response?.data?.msg || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <img src={logo} alt="CNNCT Logo" className="auth-logo" />
        <div className="auth-box">
          <h1>Sign in</h1>
          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={credentials.email}
              onChange={handleChange}
              disabled={loading}
            />
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                disabled={loading}
              />
              <img
                src={showPassword ? eyeOpenIcon : eyeClosedIcon}
                alt="Toggle password visibility"
                className="eye-icon"
                onClick={togglePasswordVisibility}
              />
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
          <div className="auth-links" style={{ textAlign: "center" }}>
            <p>
              Don’t have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
        <p className="auth-terms">
          This site is protected by reCAPTCHA and the{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Privacy Policy
          </a>{" "}
          and{" "}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>{" "}
          apply.
        </p>
      </div>
      <div className="auth-right">
        <img
          src={illustrationImage}
          alt="SignIn Illustration"
          className="auth-illustration"
        />
      </div>
    </div>
  );
};

export default Login;
