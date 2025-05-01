import React, { useState, useContext } from "react";
import "../styles/CreateTicketModal.css";
import AxiosInstance from "../api/AxiosInstance";
import AuthContext from "../context/AuthContext";

export default function CreateTicketModal({ isOpen, onClose, onCreated }) {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await AxiosInstance.post("/tickets", { title, message });
      onCreated(res.data);
      onClose();
      setTitle("");
      setMessage("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to create ticket.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>New Ticket</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          <label>
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter ticket title"
            />
          </label>
          <label>
            Message
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What’s the issue?"
            />
          </label>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creating…" : "Create Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
