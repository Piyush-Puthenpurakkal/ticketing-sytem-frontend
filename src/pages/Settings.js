import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../api/AxiosInstance";
import "../styles/Settings.css";
import infoIcon from "../assets/icons/info.png";

export default function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const initialEmail = useRef("");
  const initialPassword = useRef("");

  const [tooltipField, setTooltipField] = useState(null);
  const toggleTooltip = (field) =>
    setTooltipField((prev) => (prev === field ? null : field));

  useEffect(() => {
    AxiosInstance.get("/auth/me")
      .then((res) => {
        const u = res.data;
        setFirstName(u.firstName || "");
        setLastName(u.lastName || "");
        setEmail(u.email || "");
        initialEmail.current = u.email || "";
        // We never receive plaintext password, so leave initialPassword empty
      })
      .catch((err) => console.error("Failed to load profile:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailChanged = email !== initialEmail.current;
    const passwordChanged = password !== "";

    const payload = { firstName, lastName };
    if (emailChanged) payload.email = email;
    if (passwordChanged) payload.password = password;

    AxiosInstance.put("/auth/update-profile", payload)
      .then(() => {
        if (emailChanged || passwordChanged) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          alert("Profile updated successfully.");
        }
      })
      .catch((err) =>
        alert(err.response?.data?.msg || "Failed to update profile.")
      );
  };

  if (loading) {
    return (
      <div className="settings-page">
        <h2 className="settings-title">Settings</h2>
        <div className="settings-container">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <h2 className="settings-title">Settings</h2>

      <div className="settings-container">
        <div className="tab-nav">
          <div className="tab-item active">Edit Profile</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First name</label>
            <div className="input-with-icon">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Last name</label>
            <div className="input-with-icon">
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="input-with-icon">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="icon-wrapper">
                <img
                  src={infoIcon}
                  alt="Info"
                  className="info-icon"
                  onClick={() => toggleTooltip("email")}
                />
                {tooltipField === "email" && (
                  <div className="tooltip">
                    Changing your email will log you out immediately.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="icon-wrapper">
                <img
                  src={infoIcon}
                  alt="Info"
                  className="info-icon"
                  onClick={() => toggleTooltip("password")}
                />
                {tooltipField === "password" && (
                  <div className="tooltip">
                    Changing your password will log you out immediately.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-with-icon">
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="icon-wrapper">
                <img
                  src={infoIcon}
                  alt="Info"
                  className="info-icon"
                  onClick={() => toggleTooltip("confirm")}
                />
                {tooltipField === "confirm" && (
                  <div className="tooltip">
                    Must match the new password above.
                  </div>
                )}
              </div>
            </div>
          </div>

          <button type="submit" className="save-btn">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
