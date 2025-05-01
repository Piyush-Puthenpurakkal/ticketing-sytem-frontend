import React, { useState, useEffect, useContext } from "react";
import AxiosInstance from "../api/AxiosInstance";
import AuthContext from "../context/AuthContext";
import defaultAvatar from "../assets/icons/default-avatar.png";
import editIcon from "../assets/icons/edit.png";
import deleteIcon from "../assets/icons/delete.png";
import sortIcon from "../assets/icons/sort.png";
import { FaPlus } from "react-icons/fa";
import "../styles/Team.css";

export default function Team() {
  const { user } = useContext(AuthContext);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "Member",
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    AxiosInstance.get("/team")
      .then((res) => setTeam(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const email = newMember.email.trim().toLowerCase();
    if (!email) {
      setNewMember((prev) => ({ ...prev, name: "" }));
      return;
    }
    AxiosInstance.get(`/users/${encodeURIComponent(email)}`)
      .then((res) => {
        const u = res.data;
        setNewMember((prev) => ({
          ...prev,
          name: `${u.firstName} ${u.lastName}`,
        }));
      })
      .catch(() => {
        const prefix = email.split("@")[0];
        setNewMember((prev) => ({ ...prev, name: prefix }));
      });
  }, [newMember.email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const email = newMember.email.trim().toLowerCase();
    if (!email) {
      alert("Please enter an email.");
      return;
    }

    AxiosInstance.get(`/users/${encodeURIComponent(email)}`)
      .then((res) => {
        const userId = res.data._id;
        const payload = { userId, role: newMember.role };
        const req = editingId
          ? AxiosInstance.put(`/team/${editingId}`, payload)
          : AxiosInstance.post("/team", payload);

        req
          .then((res2) => {
            const updated = res2.data;
            setTeam((prev) =>
              editingId
                ? prev.map((m) => (m._id === editingId ? updated : m))
                : [...prev, updated]
            );
            closeModal();
          })
          .catch(console.error);
      })
      .catch(() => {
        alert("That email is not a registered user.");
      });
  };

  const handleConfirmDelete = () =>
    AxiosInstance.delete(`/team/${confirmDeleteId}`)
      .then(() => {
        setTeam((prev) => prev.filter((m) => m._id !== confirmDeleteId));
        setConfirmDeleteId(null);
      })
      .catch(console.error);

  const openModalFor = (member = null) => {
    if (member) {
      setEditingId(member._id);
      setNewMember({
        name: member.user
          ? `${member.user.firstName} ${member.user.lastName}`
          : member.name,
        email: member.user ? member.user.email : member.email,
        role: member.role,
      });
    } else {
      setEditingId(null);
      setNewMember({ name: "", email: "", role: "Member" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNewMember({ name: "", email: "", role: "Member" });
  };

  if (loading) return <div>Loading…</div>;

  return (
    <div className="team-page">
      <div className="team-header">
        <h2>Team</h2>
        <hr />
      </div>

      <div className="team-content">
        <table className="team-table">
          <thead>
            <tr>
              <th>
                Full Name{" "}
                <img src={sortIcon} className="sort-icon" alt="Sort" />
              </th>
              <th>Phone</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {team.map((member) => {
              const avatar =
                (member.user && member.user.avatar) || defaultAvatar;
              const name = member.user
                ? `${member.user.firstName} ${member.user.lastName}`
                : member.name;
              return (
                <tr key={member._id}>
                  <td className="avatar-cell">
                    <img src={avatar} className="avatar" alt="" />
                    <span>{name}</span>
                  </td>
                  <td>{member.user?.phone || "—"}</td>
                  <td>{member.email}</td>
                  <td>{member.role}</td>
                  <td className="actions">
                    <img
                      src={editIcon}
                      className="action-icon"
                      alt="Edit"
                      onClick={() => {
                        if (
                          user.role === "admin" ||
                          member.user?._id === user.id
                        ) {
                          openModalFor(member);
                        } else {
                          alert(
                            "You can only edit your own profile or must be an admin."
                          );
                        }
                      }}
                    />
                    <img
                      src={deleteIcon}
                      className="action-icon"
                      alt="Delete"
                      onClick={() => {
                        if (
                          user.role === "admin" ||
                          member.user?._id === user.id
                        ) {
                          setConfirmDeleteId(member._id);
                        } else {
                          alert(
                            "You can only delete yourself or must be an admin."
                          );
                        }
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="add-btn-container">
          <button className="add-btn" onClick={() => openModalFor()}>
            <FaPlus /> Add Team Member
          </button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingId ? "Edit Team Member" : "Add Team Member"}</h3>
            <div className="modal-form">
              <input
                type="text"
                name="name"
                placeholder="User name"
                value={newMember.name}
                onChange={handleInputChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email ID"
                value={newMember.email}
                onChange={handleInputChange}
              />
              <select
                name="role"
                value={newMember.role}
                onChange={handleInputChange}
              >
                <option>Member</option>
                <option>Admin</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDeleteId && (
        <div className="confirm-popup">
          <p>This teammate will be deleted.</p>
          <div className="confirm-popup-actions">
            <button
              className="confirm-cancel-btn"
              onClick={() => setConfirmDeleteId(null)}
            >
              Cancel
            </button>
            <button className="confirm-btn" onClick={handleConfirmDelete}>
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
