import React, { useState, useEffect, useContext, Fragment } from "react";
import "../styles/contactcenter.css";
import AxiosInstance from "../api/AxiosInstance";
import AuthContext from "../context/AuthContext";

import HomeIcon from "../assets/icons/home.png";
import nameIcon from "../assets/icons/name.png";
import phoneIcon from "../assets/icons/phone.png";
import mailIcon from "../assets/icons/mail.png";
import TicketStatusIcon from "../assets/icons/ticket-status.png";
import defaultAvatar from "../assets/icons/default-avatar.png";
import ArrowDownIcon from "../assets/icons/arrow-down.png";

import ConfirmationModal from "../components/ConfirmationModal";

const statusOptions = ["resolved", "unresolved"];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export default function ContactCenter() {
  const { user } = useContext(AuthContext);

  const [tickets, setTickets] = useState([]);
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [messages, setMessages] = useState([]);

  const [inputValue, setInputValue] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [openTeammates, setOpenTeammates] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);

  const [accessGranted, setAccessGranted] = useState(true);
  const [isResolved, setIsResolved] = useState(false);
  const [systemMessage, setSystemMessage] = useState("");
  const [missed, setMissed] = useState(false);

  const [showCloseChatModal, setShowCloseChatModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [pendingMember, setPendingMember] = useState(null);
  const [prevAssignee, setPrevAssignee] = useState(null);

  useEffect(() => {
    AxiosInstance.get("/tickets")
      .then((res) => {
        setTickets(res.data);
        if (res.data.length) {
          const first = res.data[0]._id;
          setActiveTicketId(first);
          setMissed(res.data[0].status === "unresolved");
        }
      })
      .catch(console.error);

    AxiosInstance.get("/team")
      .then((res) => setTeamMembers(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!activeTicketId) return;
    AxiosInstance.get(`/chat/${activeTicketId}/messages`)
      .then((res) => setMessages(res.data))
      .catch(console.error);
  }, [activeTicketId]);

  useEffect(() => {
    const active = tickets.find((t) => t._id === activeTicketId);
    if (!active) return;

    const allowed = active.assignedTo?._id === user.id;
    setAccessGranted(allowed);
    setSystemMessage(
      allowed ? "" : "This chat is assigned to someone else; you cannot reply."
    );
  }, [tickets, activeTicketId, user.id]);

  const activeTicket = tickets.find((t) => t._id === activeTicketId) || {};

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;

    AxiosInstance.post(`/chat/${activeTicketId}/messages`, {
      sender: `${user.firstName} ${user.lastName}`,
      text,
    })
      .then((res) => {
        setMessages(res.data);
        setInputValue("");
      })
      .catch(console.error);
  };

  const handleReassignClick = (member) => {
    setPrevAssignee(null);
    setPendingMember(null);

    if (member.user?._id === user.id) {
      alert("You cannot assign the ticket to yourself.");
      return;
    }

    setPrevAssignee(activeTicket.assignedTo || null);
    setPendingMember(member);
    setOpenTeammates(false);
    setShowReassignModal(true);
  };

  const handleConfirmReassign = () => {
    if (!pendingMember) {
      setShowReassignModal(false);
      return;
    }

    const assignedUserId = pendingMember.user?._id || pendingMember._id;
    AxiosInstance.put(`/tickets/${activeTicketId}/assign`, {
      userId: assignedUserId,
    })
      .then(() => AxiosInstance.get(`/tickets/${activeTicketId}`))
      .then((res) => {
        setTickets((prev) =>
          prev.map((t) => (t._id === activeTicketId ? res.data : t))
        );
        setAccessGranted(false);
        setSystemMessage(
          "This chat is assigned to a new team member; you no longer have access."
        );
      })
      .catch(console.error)
      .finally(() => {
        setPendingMember(null);
        setShowReassignModal(false);
      });
  };

  const handleStatusClick = (status) => {
    setOpenStatus(false);
    if (status === "resolved") {
      setShowCloseChatModal(true);
    } else {
      changeStatus(status);
    }
  };

  const handleConfirmCloseChat = () => {
    AxiosInstance.put(`/tickets/${activeTicketId}/status`, {
      status: "resolved",
    })
      .then(() => {
        setTickets((prev) => prev.filter((t) => t._id !== activeTicketId));
        setIsResolved(true);
        setAccessGranted(false);
        setMissed(false);
        setSystemMessage("This chat has been resolved.");

        const remaining = tickets.filter((t) => t._id !== activeTicketId);
        setActiveTicketId(remaining[0]?._id || null);
      })
      .catch(console.error)
      .finally(() => {
        setShowCloseChatModal(false);
      });
  };

  const handleCancelCloseChat = () => {
    if (prevAssignee) {
      setTickets((prev) =>
        prev.map((t) =>
          t._id === activeTicketId ? { ...t, assignedTo: prevAssignee } : t
        )
      );
      setSystemMessage("Reverted assignment because you cancelled closing.");
    }
    setPrevAssignee(null);
    setShowCloseChatModal(false);
  };

  const changeStatus = (status) => {
    AxiosInstance.put(`/tickets/${activeTicketId}/status`, { status })
      .then((res) => {
        setTickets((prev) =>
          prev.map((t) =>
            t._id === activeTicketId ? { ...t, status: res.data.status } : t
          )
        );
        setIsResolved(status === "resolved");
        setAccessGranted(false);
        setSystemMessage(
          status === "resolved"
            ? "This chat has been resolved."
            : "Ticket reopened."
        );
      })
      .catch(console.error);
  };

  return (
    <div className="contact-center-wrapper">
      <div className="contact-list">
        <h3 className="section-title">Contact Center</h3>
        <h4 className="chats-label">Chats</h4>
        {tickets.map((t) => (
          <div
            key={t._id}
            className={`chat-entry ${t._id === activeTicketId ? "active" : ""}`}
            onClick={() => {
              setActiveTicketId(t._id);
              setMissed(t.status === "unresolved");
              setAccessGranted(true);
              setIsResolved(false);
              setSystemMessage("");
            }}
          >
            <div className="chat-info">
              <span className="chat-name">
                {t.title || `#${t._id.slice(-6)}`}
              </span>
              <span className="chat-msg">{t.message}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-window">
        <div className="ticket-header">
          <span>Ticket# {activeTicket._id?.slice(-6)}</span>
          <img src={HomeIcon} className="home-icon" alt="Home" />
        </div>

        <div className="chat-content">
          {messages.map((msg, i) => {
            const msgDate = formatDate(msg.timestamp);
            const prevDate =
              i > 0 ? formatDate(messages[i - 1].timestamp) : null;
            const showDivider = i === 0 || msgDate !== prevDate;
            const isOutgoing =
              msg.sender === `${user.firstName} ${user.lastName}`;

            return (
              <Fragment key={i}>
                {showDivider && (
                  <div className="date-divider">
                    <span>{msgDate}</span>
                  </div>
                )}
                <div
                  className={`chat-bubble ${
                    isOutgoing ? "outgoing" : "incoming"
                  }`}
                >
                  {!isOutgoing && (
                    <img
                      src={msg.avatar}
                      className="chat-avatar"
                      alt={msg.sender}
                    />
                  )}
                  <div className="bubble">
                    <div className="chat-name">{msg.sender}</div>
                    <div className="chat-text">{msg.text}</div>
                  </div>
                  {isOutgoing && (
                    <img
                      src={msg.avatar}
                      className="chat-avatar"
                      alt={msg.sender}
                    />
                  )}
                </div>
              </Fragment>
            );
          })}
          {systemMessage && (
            <div className="system-message">{systemMessage}</div>
          )}
        </div>

        {accessGranted && !isResolved && (
          <>
            {missed && (
              <div className="missed-label">Replying to missed chat</div>
            )}
            <div className="chat-input-container">
              <input
                className="chat-input"
                placeholder="Type here"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button className="send-button" onClick={handleSend}>
                ➤
              </button>
            </div>
          </>
        )}
      </div>

      <div className="ticket-details">
        <div className="details-header">
          <span className="details-name">
            {activeTicket.user
              ? `${activeTicket.user.firstName} ${activeTicket.user.lastName}`
              : ""}
          </span>
        </div>

        <div className="details-subtitle">Ticket Details</div>
        <div className="details-box">
          <div className="details-field flat">
            <img src={nameIcon} className="field-icon" alt="User" />
            <input
              type="text"
              value={
                activeTicket.user
                  ? `${activeTicket.user.firstName} ${activeTicket.user.lastName}`
                  : ""
              }
              readOnly
            />
          </div>
          <div className="details-field flat">
            <img src={phoneIcon} className="field-icon" alt="Phone" />
            <input
              type="text"
              value={activeTicket.user?.phone || ""}
              readOnly
            />
          </div>
          <div className="details-field flat">
            <img src={mailIcon} className="field-icon" alt="Email" />
            <input
              type="text"
              value={activeTicket.user?.email || ""}
              readOnly
            />
          </div>
        </div>

        <div className="details-subtitle">Manage</div>
        {/* Assign Dropdown */}
        <div className="dropdown-wrapper">
          <div
            className="details-field dropdown flat"
            onClick={() => setOpenTeammates((o) => !o)}
          >
            <img
              src={activeTicket.assignedTo?.avatar || defaultAvatar}
              className="field-icon"
              alt="Assigned to"
            />
            <span>
              {activeTicket.assignedTo
                ? `${activeTicket.assignedTo.firstName} ${activeTicket.assignedTo.lastName}`
                : "Assign to..."}
            </span>
            <img src={ArrowDownIcon} className="dropdown-icon" alt="Toggle" />
          </div>
          {openTeammates && (
            <div className="dropdown-options">
              {teamMembers
                .filter((tm) => tm.user?._id !== user.id)
                .map((tm) => (
                  <div
                    key={tm._id}
                    className="option"
                    onClick={() => handleReassignClick(tm)}
                  >
                    <img
                      src={tm.user?.avatar || defaultAvatar}
                      className="avatar"
                      alt=""
                    />
                    <span>
                      {tm.user
                        ? `${tm.user.firstName} ${tm.user.lastName}`
                        : tm.name}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="dropdown-wrapper">
          <div
            className="details-field dropdown flat"
            onClick={() => setOpenStatus((o) => !o)}
          >
            <img src={TicketStatusIcon} className="field-icon" alt="Status" />
            <span>{activeTicket.status}</span>
            <img src={ArrowDownIcon} className="dropdown-icon" alt="Toggle" />
          </div>
          {openStatus && (
            <div className="dropdown-options">
              {statusOptions.map((st) => (
                <div
                  key={st}
                  className="option"
                  onClick={() => handleStatusClick(st)}
                >
                  <span>{st}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showCloseChatModal}
        message="Chat will be closed"
        onCancel={handleCancelCloseChat}
        onConfirm={handleConfirmCloseChat}
      />
      <ConfirmationModal
        isOpen={showReassignModal}
        message="Chat would be assigned to a different member"
        onCancel={() => setShowReassignModal(false)}
        onConfirm={handleConfirmReassign}
      />
    </div>
  );
}
