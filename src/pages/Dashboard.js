import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../api/AxiosInstance";
import Avatar from "../assets/Sidebar/avatar.png";

import CreateTicketModal from "../components/CreateTicketModal";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const navigate = useNavigate();

  const fetchTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (activeTab !== "all") params.status = activeTab;
      if (searchTerm.trim()) params.search = searchTerm.trim();
      const { data } = await AxiosInstance.get("/tickets", { params });
      setTickets(data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [activeTab, searchTerm]);

  const handleTicketCreated = (newTicket) => {
    setShowCreateModal(false);
    fetchTickets();
  };

  return (
    <div className="dashboard-main">
      {/* Header with "New Ticket" button */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button
          className="btn-primary create-ticket-btn"
          onClick={() => setShowCreateModal(true)}
        >
          + New Ticket
        </button>
      </div>

      {/* Search box */}
      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search for ticket"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="tabs">
        {["all", "resolved", "unresolved"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "all"
              ? "All Tickets"
              : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading">Loading tickets...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : tickets.length === 0 ? (
        <div className="no-results">No tickets found.</div>
      ) : (
        tickets.map((ticket) => (
          <div key={ticket._id} className="ticket-card">
            <header className="ticket-header">
              <span className="ticket-id">
                <span className="dot" />
                Ticket# {ticket._id.slice(-6)}
              </span>
              <span className="posted-at">
                {new Date(ticket.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </header>

            <div className="ticket-message">{ticket.message}</div>

            <footer className="ticket-footer">
              <div className="ticket-user">
                <img src={Avatar} alt="User" />
                <div className="ticket-user-details">
                  <div className="name">
                    {ticket.user.firstName} {ticket.user.lastName}
                  </div>
                  <div className="email">{ticket.user.email}</div>
                </div>
              </div>
              <div className="ticket-actions">
                <button
                  className="open-ticket-btn"
                  onClick={() =>
                    navigate(`/contact-center?ticket=${ticket._id}`)
                  }
                >
                  Open Ticket
                </button>
              </div>
            </footer>
          </div>
        ))
      )}

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handleTicketCreated}
      />
    </div>
  );
}
