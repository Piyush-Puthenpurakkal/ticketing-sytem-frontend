import React from "react";
import "../styles/confirmationModal.css";

export default function ConfirmationModal({
  isOpen,
  onCancel,
  onConfirm,
  message,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <p className="modal-message">{message}</p>
        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
