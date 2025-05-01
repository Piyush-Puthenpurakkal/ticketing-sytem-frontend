import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AxiosInstance from "../api/AxiosInstance";
import "../styles/auth.css";

import logo from "../assets/hubly-logo.png";
import illustrationImage from "../assets/illustration-image.png";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { firstName, lastName, email, password, confirmPassword } = formData;
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await AxiosInstance.post("/auth/register", {
        firstName,
        lastName,
        email,
        password,
      });
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err?.response?.data?.msg || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    !formData.firstName.trim() ||
    !formData.lastName.trim() ||
    !formData.email.trim() ||
    !formData.password.trim() ||
    !formData.confirmPassword.trim();

  return (
    <div className="auth-container">
      <div className="auth-left">
        <img src={logo} alt="CNNCT Logo" className="auth-logo" />
        <div className="auth-box">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "1.4rem", marginBottom: "20px" }}>
              Create an account
            </h2>
            <Link
              to="/login"
              style={{ fontSize: "0.95rem", marginBottom: "20px" }}
            >
              Sign in instead
            </Link>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>First name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={loading}
            />
            <label>Last name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={loading}
            />
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem",
              }}
            >
              <input
                type="checkbox"
                required
                id="terms"
                style={{ marginTop: "0.2rem" }}
                disabled={loading}
              />
              <label htmlFor="terms" style={{ lineHeight: "1.4" }}>
                By creating an account, I agree to the{" "}
                <a
                  href="https://example.com/terms-of-use"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Use
                </a>{" "}
                and{" "}
                <a
                  href="https://example.com/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
                .
              </label>
            </div>
            <button type="submit" disabled={isDisabled || loading}>
              {loading ? "Creating account..." : "Create an account"}
            </button>
          </form>
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
          alt="Signup Illustration"
          className="auth-illustration"
        />
      </div>
    </div>
  );
};

export default Signup;
