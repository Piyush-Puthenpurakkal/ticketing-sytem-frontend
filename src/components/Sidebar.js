import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../styles/Sidebar.css";

import Logo from "../assets/Sidebar/logo.png";
import DashboardIcon from "../assets/Sidebar/dashboard.png";
import ContactIcon from "../assets/Sidebar/contact.png";
import AnalyticsIcon from "../assets/Sidebar/analytics.png";
import ChatBotIcon from "../assets/Sidebar/chat-bot.png";
import TeamIcon from "../assets/Sidebar/team.png";
import SettingsIcon from "../assets/Sidebar/settings.png";
import Avatar from "../assets/Sidebar/avatar.png";

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { icon: DashboardIcon, label: "Dashboard", path: "/dashboard" },
    { icon: ContactIcon, label: "Contact Center", path: "/contact-center" },
    { icon: AnalyticsIcon, label: "Analytics", path: "/analytics" },
    { icon: ChatBotIcon, label: "Chat Bot", path: "/chat-bot" },
    { icon: TeamIcon, label: "Team", path: "/team" },
    { icon: SettingsIcon, label: "Settings", path: "/settings" },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <img src={Logo} alt="Logo" />
      </div>

      <nav>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              title={item.label}
              className={isActive ? "active" : ""}
            >
              <img src={item.icon} alt={item.label} />
              {isActive && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="profile">
        <img
          src={Avatar}
          alt="Profile"
          onClick={() => setShowLogout((s) => !s)}
        />
        {showLogout && (
          <div className="logout-popup">
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </aside>
  );
}
