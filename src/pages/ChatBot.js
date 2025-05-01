import React, { useState } from "react";
import "../styles/chatbot.css";

import BotAvatar from "../assets/icons/bot.png";
import SendIcon from "../assets/icons/send.png";

export default function ChatBot() {
  // ─── PREVIEW STATE ───────────────────────────────────────────
  const [headerColor, setHeaderColor] = useState("#33475B");
  const [bgColor, setBgColor] = useState("#EEEEEE");
  const [messages, setMessages] = useState([
    "How can I help you?",
    "Ask me anything!",
  ]);
  const [intro, setIntro] = useState({
    name: "Your name",
    phone: "+1 (000) 000-0000",
    email: "example@gmail.com",
  });
  const [welcomeMsg, setWelcomeMsg] = useState(
    "👋 Want to chat about Hubly? I'm a chatbot here to help you find your way."
  );
  const [timer, setTimer] = useState({ h: "00", m: "10", s: "00" });

  return (
    <div className="chatbot-page">
      <h2 className="chatbot-title">Chat Bot</h2>

      <div className="chatbot-grid">
        {/* ─── PREVIEW ───────────────────────────────────────────── */}
        <div className="preview-wrapper">
          <div className="preview-card">
            {/* Header */}
            <div
              className="bot-header"
              style={{ backgroundColor: headerColor }}
            >
              <img src={BotAvatar} className="bot-avatar" alt="Hubly" />
              <span className="bot-name">Hubly</span>
            </div>

            {/* Chat Body */}
            <div className="bot-body" style={{ backgroundColor: bgColor }}>
              {messages.map((msg, i) => (
                <div key={i} className="bot-msg">
                  <img src={BotAvatar} className="msg-avatar" alt="bot" />
                  <div className="msg-text">{msg}</div>
                </div>
              ))}

              {/* Introduction Form */}
              <div className="bot-form">
                <h4 className="form-title">Introduction Yourself</h4>
                <label>Your name</label>
                <input type="text" placeholder={intro.name} readOnly />
                <label>Your Phone</label>
                <input type="text" placeholder={intro.phone} readOnly />
                <label>Your Email</label>
                <input type="text" placeholder={intro.email} readOnly />
                <button className="btn-primary">Thank You!</button>
              </div>
            </div>

            {/* Input Footer */}
            <div className="bot-input">
              <input className="chat-input" placeholder="Write a message" />
              <button className="send-button">
                <img src={SendIcon} alt="Send" />
              </button>
            </div>
          </div>

          {/* Toast */}
          <div className="bot-toast">
            <div className="toast-avatar-container">
              <img src={BotAvatar} className="toast-avatar" alt="Hubly" />
            </div>
            <div className="toast-content">
              <div className="toast-text">{welcomeMsg}</div>
              <button className="toast-close">×</button>
            </div>
          </div>
        </div>

        {/* ─── SETTINGS ─────────────────────────────────────────────── */}
        <div className="settings-wrapper">
          {/* Header Color */}
          <div className="card">
            <div className="card-header">
              <h3>Header Color</h3>
            </div>
            <div className="color-options">
              {["#FFFFFF", "#000000", "#33475B"].map((col) => (
                <span
                  key={col}
                  className={
                    "color-circle" + (headerColor === col ? " selected" : "")
                  }
                  style={{ backgroundColor: col }}
                  onClick={() => setHeaderColor(col)}
                />
              ))}
            </div>
            <div className="color-preview">
              <div
                className="color-swatch"
                style={{ backgroundColor: headerColor }}
              />
              <div className="color-code">{headerColor}</div>
            </div>
          </div>

          {/* Custom Background Color */}
          <div className="card">
            <div className="card-header">
              <h3>Custom Background Color</h3>
            </div>
            <div className="color-options">
              {["#FFFFFF", "#000000", "#EEEEEE"].map((col) => (
                <span
                  key={col}
                  className={
                    "color-circle" + (bgColor === col ? " selected" : "")
                  }
                  style={{ backgroundColor: col }}
                  onClick={() => setBgColor(col)}
                />
              ))}
            </div>
            <div className="color-preview">
              <div
                className="color-swatch"
                style={{ backgroundColor: bgColor }}
              />
              <div className="color-code">{bgColor}</div>
            </div>
          </div>

          {/* Customize Message */}
          <div className="card">
            <div className="card-header">
              <h3>Customize Message</h3>
            </div>
            {messages.map((m, i) => (
              <div key={i} className="editable">
                <div className="msg-preview">{m}</div>
                <button className="edit-btn">✏️</button>
              </div>
            ))}
          </div>

          {/* Introduction Form Preview */}
          <div className="card">
            <div className="card-header">
              <h3>Introduction Form</h3>
            </div>
            <div className="intro-preview">
              <label>Your name</label>
              <input type="text" placeholder={intro.name} readOnly />
              <label>Your Phone</label>
              <input type="text" placeholder={intro.phone} readOnly />
              <label>Your Email</label>
              <input type="text" placeholder={intro.email} readOnly />
              <button className="btn-primary full">Thank You!</button>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="card">
            <div className="card-header">
              <h3>Welcome Message</h3>
            </div>
            <div className="welcome-preview">
              <span className="char-count">{welcomeMsg.length}/50</span>
              <div className="toast-preview">
                <div className="toast-text">{welcomeMsg}</div>
                <button className="toast-close edit">✏️</button>
              </div>
            </div>
          </div>

          {/* Missed chat timer */}
          <div className="card">
            <div className="card-header">
              <h3>Missed chat timer</h3>
            </div>
            <div className="timer-group">
              <select
                value={timer.h}
                onChange={(e) => setTimer({ ...timer, h: e.target.value })}
              >
                {Array.from({ length: 24 }).map((_, i) => (
                  <option key={i}>{String(i).padStart(2, "0")}</option>
                ))}
              </select>
              <span>:</span>
              <select
                value={timer.m}
                onChange={(e) => setTimer({ ...timer, m: e.target.value })}
              >
                {Array.from({ length: 60 }).map((_, i) => (
                  <option key={i}>{String(i).padStart(2, "0")}</option>
                ))}
              </select>
              <span>:</span>
              <select
                value={timer.s}
                onChange={(e) => setTimer({ ...timer, s: e.target.value })}
              >
                {Array.from({ length: 60 }).map((_, i) => (
                  <option key={i}>{String(i).padStart(2, "0")}</option>
                ))}
              </select>
            </div>
            <div className="timer-save-wrapper">
              <button className="btn-save">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
