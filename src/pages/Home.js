// src/pages/Home.js
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../styles/Home.css";

import HublyLogo from "../assets/hubly-logo.png";
import HeroImage from "../assets/hero-people.png";
import NotificationCard from "../assets/notification-card.png";
import CalendarCard from "../assets/calendar-widget.png";
import ChartCard from "../assets/sales-chart.png";
import PlayIcon from "../assets/play-icon.png";
import ArrowIcon from "../assets/arrow-icon.png";

import Adobe from "../assets/adobe-logo.png";
import Elastic from "../assets/elastic-logo.png";
import Opendoor from "../assets/opendoor-logo.png";
import Airtable from "../assets/airtable-logo.png";
import Framer from "../assets/framer-logo.png";

import FunnelIllustration from "../assets/funnel-illustration.png";
import FunnelIllustrationIcons from "../assets/funnel-illustration-icons.png";

import CheckIcon from "../assets/check-icon.png";

import MailIcon from "../assets/mail-icon.png";
import LinkedInIcon from "../assets/linkedin-icon.png";
import TwitterIcon from "../assets/twitter-icon.png";
import YouTubeIcon from "../assets/youtube-icon.png";
import DiscordIcon from "../assets/discord-icon.png";
import FigmaIcon from "../assets/figma-icon.png";
import InstagramIcon from "../assets/instagram-icon.png";

// Assets for inline preview:
import BotAvatar from "../assets/icons/bot.png";
import SendIcon from "../assets/icons/send.png";

export default function Home() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // control tooltip vs preview
  const [hoverToast, setHoverToast] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // preview data
  const headerColor = "#33475B";
  const bgColor = "#EEEEEE";
  const messages = ["How can I help you?", "Ask me anything!"];
  const welcomeMsg =
    "👋 Want to chat about Hubly? I'm a chatbot here to help you find your way.";
  const intro = {
    name: "Your name",
    phone: "+1 (000) 000-0000",
    email: "example@gmail.com",
  };

  return (
    <div className="home-container">
      {/* -- 1. Header / Navigation -- */}
      <header className="home-header">
        <div className="header-logo">
          <Link to="/">
            <img src={HublyLogo} alt="Hubly Logo" />
          </Link>
        </div>
        <nav className="header-nav">
          <ul>
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#plans">Pricing</a>
            </li>
            <li>
              <a href="#footer">Contact</a>
            </li>
          </ul>
        </nav>
        <div className="header-actions">
          {user ? (
            <>
              <Link to="/dashboard" className="login-btn">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="signup-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-btn">
                Login
              </Link>
              <Link to="/signup" className="signup-btn">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* -- 2. Hero Section -- */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Grow Your Business Faster with Hubly CRM</h1>
          <p>
            Manage leads, automate workflows, and close deals effortlessly—all
            in one powerful platform.
          </p>
          <div className="hero-buttons">
            <button className="get-started-btn">
              Get Started <img src={ArrowIcon} alt="arrow icon" />
            </button>
            <button className="watch-video-btn">
              <img src={PlayIcon} alt="play icon" /> Watch Video
            </button>
          </div>
        </div>
        <div className="hero-image-container">
          <img
            src={HeroImage}
            alt="Team collaborating"
            className="main-hero-img"
          />
          <div className="notification-card">
            <img src={NotificationCard} alt="Notification" />
          </div>
          <div className="calendar-card">
            <img src={CalendarCard} alt="Calendar widget" />
          </div>
          <div className="chart-card">
            <img src={ChartCard} alt="Sales chart" />
          </div>
        </div>
      </section>

      {/* -- 3. Trusted By -- */}
      <section className="trusted-by-section">
        <div className="trusted-icons">
          <img src={Adobe} alt="Adobe" />
          <img src={Elastic} alt="Elastic" />
          <img src={Opendoor} alt="Opendoor" />
          <img src={Airtable} alt="Airtable" />
          <img src={Elastic} alt="Elastic" />
          <img src={Framer} alt="Framer" />
        </div>
      </section>

      {/* -- 4. CRM Explanation / Funnel Section -- */}
      <section className="crm-explanation" id="features">
        <h2>At its core, Hubly is a robust CRM solution</h2>
        <p>
          Hubly helps businesses streamline customer interactions, track leads,
          and automate tasks—saving you time and maximizing revenue.
        </p>
        <div className="funnel-section">
          <div className="funnel-info">
            <h3>Multiple Platforms Together!</h3>
            <p>
              Email communication is a breeze with our fully integrated, drag &
              drop email builder.
            </p>
            <h4>CLOSE</h4>
            <p>
              Capture leads using our landing pages, surveys, forms, calendars &
              more!
            </p>
            <h4>NURTURE</h4>
            <p>
              Keep leads engaged through automated follow-ups and personalized
              campaigns.
            </p>
          </div>
          <div className="funnel-image">
            <img
              src={FunnelIllustrationIcons}
              className="funnel-icons"
              alt="Funnel icons"
            />
            <img
              src={FunnelIllustration}
              className="funnel-main"
              alt="Funnel illustration"
            />
          </div>
        </div>
      </section>

      {/* -- 5. Pricing Plans -- */}
      <section className="pricing-section" id="plans">
        <h2>We have plans for everyone!</h2>
        <p className="pricing-subheading">
          We started with a strong foundation, then simply built all of the
          sales and marketing tools ALL businesses need under one platform.
        </p>
        <div className="plans-container">
          <div className="plan-card starter">
            <h3>STARTER</h3>
            <p className="plan-description">
              Best for local businesses needing to improve their online
              reputation.
            </p>
            <div className="plan-pricing">
              <span className="price">$199</span>
              <span className="per-month">/monthly</span>
            </div>
            <h4 className="plan-includes-title">What’s included</h4>
            <ul className="plan-features">
              <li>
                <img src={CheckIcon} alt="" /> Unlimited Users
              </li>
              <li>
                <img src={CheckIcon} alt="" /> GMB Messaging
              </li>
              <li>
                <img src={CheckIcon} alt="" /> Reputation Management
              </li>
              <li>
                <img src={CheckIcon} alt="" /> GMB Call Tracking
              </li>
              <li>
                <img src={CheckIcon} alt="" /> 24/7 Award Winning Support
              </li>
            </ul>
            <button className="plan-btn">Sign Up for Starter</button>
          </div>
          <div className="plan-card pro">
            <h3>GROW</h3>
            <p className="plan-description">
              Best for businesses that want full control of marketing automation
              and lead tracking.
            </p>
            <div className="plan-pricing">
              <span className="price">$399</span>
              <span className="per-month">/monthly</span>
            </div>
            <h4 className="plan-includes-title">What’s included</h4>
            <ul className="plan-features">
              <li>
                <img src={CheckIcon} alt="" /> Pipeline Management
              </li>
              <li>
                <img src={CheckIcon} alt="" /> Automation Campaigns
              </li>
              <li>
                <img src={CheckIcon} alt="" /> Live Call Transfer
              </li>
              <li>
                <img src={CheckIcon} alt="" /> Embed-able Form Builder
              </li>
              <li>
                <img src={CheckIcon} alt="" /> Reputation Management
              </li>
              <li>
                <img src={CheckIcon} alt="" /> 24/7 Award Winning Support
              </li>
            </ul>
            <button className="plan-btn">Sign Up for Grow</button>
          </div>
        </div>
      </section>

      {/* -- 6. Footer -- */}
      <footer className="home-footer" id="footer">
        <div className="footer-grid">
          <div className="footer-logo">
            <img src={HublyLogo} alt="Hubly Logo" />
          </div>
          <div className="footer-col product">
            <h4>Product</h4>
            <ul>
              <li>
                <a href="#">Universal checkout</a>
              </li>
              <li>
                <a href="#">Payment workflows</a>
              </li>
              <li>
                <a href="#">Observability</a>
              </li>
              <li>
                <a href="#">UpliftAI</a>
              </li>
              <li>
                <a href="#">Apps & integrations</a>
              </li>
            </ul>
          </div>
          <div className="footer-col why-hubly">
            <h4>Why Hubly?</h4>
            <ul>
              <li>
                <a href="#">Expand to new markets</a>
              </li>
              <li>
                <a href="#">Boost payment success</a>
              </li>
              <li>
                <a href="#">Improve conversion rates</a>
              </li>
              <li>
                <a href="#">Reduce payments fraud</a>
              </li>
              <li>
                <a href="#">Recover revenue</a>
              </li>
            </ul>
          </div>
          <div className="footer-col developers">
            <h4>Developers</h4>
            <ul>
              <li>
                <a href="#">Primer Docs</a>
              </li>
              <li>
                <a href="#">API Reference</a>
              </li>
              <li>
                <a href="#">Service status</a>
              </li>
              <li>
                <a href="#">Community</a>
              </li>
            </ul>
          </div>
          <div className="footer-col resources">
            <h4>Resources</h4>
            <ul>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Success stories</a>
              </li>
              <li>
                <a href="#">News room</a>
              </li>
              <li>
                <a href="#">Terms</a>
              </li>
              <li>
                <a href="#">Privacy</a>
              </li>
            </ul>
          </div>
          <div className="footer-col company">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="#">Careers</a>
              </li>
            </ul>
          </div>
          <div className="footer-social">
            <a href="#">
              <img src={MailIcon} alt="Email" />
            </a>
            <a href="#">
              <img src={LinkedInIcon} alt="LinkedIn" />
            </a>
            <a href="#">
              <img src={TwitterIcon} alt="Twitter" />
            </a>
            <a href="#">
              <img src={YouTubeIcon} alt="YouTube" />
            </a>
            <a href="#">
              <img src={DiscordIcon} alt="Discord" />
            </a>
            <a href="#">
              <img src={FigmaIcon} alt="Figma" />
            </a>
            <a href="#">
              <img src={InstagramIcon} alt="Instagram" />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Hubly. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating Chat Toggle */}
      <button
        className="chat-toggle"
        onClick={() => {
          setShowChat((v) => !v);
          setHoverToast(false);
        }}
        onMouseEnter={() => !showChat && setHoverToast(true)}
        onMouseLeave={() => setHoverToast(false)}
        aria-label="Chat with Hubly"
      >
        💬
      </button>

      {/* Bot Toast (hover only) */}
      {hoverToast && !showChat && (
        <div className="chat-popup">
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
      )}

      {/* Preview Card (click only) */}
      {showChat && (
        <div className="chat-popup">
          <div className="preview-wrapper">
            <div className="preview-card">
              <div
                className="bot-header"
                style={{ backgroundColor: headerColor }}
              >
                <img src={BotAvatar} className="bot-avatar" alt="Hubly" />
                <span className="bot-name">Hubly</span>
              </div>
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
              <div className="bot-input">
                <input className="chat-input" placeholder="Write a message" />
                <button className="send-button">
                  <img src={SendIcon} alt="Send" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
