// ===================== AdminDetails.jsx =====================

import React, { useEffect, useState } from "react";
import { getAllAdmin, deleteAdmin } from "../api/vipform";
import { toast } from "react-toastify";

export default function AdminDetails({ onEdit, refreshTrigger }) {
  const [adminList, setAdminList] = useState([]);

  // Load Admins
  useEffect(() => {
    async function fetchAdmins() {
      try {
        const data = await getAllAdmin();
        setAdminList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching admins:", error);
        setAdminList([]);
      }
    }
    fetchAdmins();
  }, [refreshTrigger]);

  // Delete Admin
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Admin?")) return;

    try {
      await deleteAdmin(id);

      const updated = await getAllAdmin();
      setAdminList(Array.isArray(updated) ? updated : []);

      toast.success("Admin deleted successfully!");
    } catch (error) {
      console.error("Error deleting Admin:", error);
    }
  };

  return (
    <div style={styles.container}>

      {/* LEFT INFO PANEL */}
      <div style={styles.leftBox}>
        <h2 style={styles.leftTitle}>ADMIN DETAILS</h2>

        <p style={styles.desc}>
          Manage all registered admins, update their profiles, or remove access.
        </p>

        <p style={styles.desc}>
          All admins listed here were registered manually via the Admin form.
        </p>

        <p style={styles.note}>
          Total Registered Admins: <b>{adminList.length}</b>
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div style={styles.rightBox}>
        <h2 style={styles.pageTitle}>Admin Records</h2>

        {/* TABLE */}
        <div style={styles.tableWrap}>
          {adminList.length === 0 ? (
            <div style={styles.noData}>
              <i className="fa fa-exclamation-circle" style={{ fontSize: 32, color: "#d9534f" }}></i>
              <h4>No Admin Records Found</h4>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {adminList.map((admin, index) => (
                  <tr key={admin.id || index}>
                    <td>{admin.id}</td>
                    <td style={styles.bold}>{admin.Name}</td>
                    <td>{admin.Username}</td>
                    <td>{admin.Email}</td>
                    <td>{admin.Password}</td>
                    <td>{admin.contactNo}</td>
                    <td>
                      <span style={styles.badge}>
                        {admin.role}
                      </span>
                    </td>

                    <td style={{ textAlign: "center" }}>
                      <button
                        style={styles.editBtn}
                        onClick={() => onEdit(admin)}
                      >
                        <i className="fa fa-edit"></i>
                      </button>

                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDelete(admin.id)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}

/* ---------------- STYLES (Same as VIP UI) ---------------- */

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    background: "#ffffff",
    flexWrap: "wrap",
  },

  leftBox: {
    width: "35%",
    minWidth: "300px",
    background: "#f4f7f9",
    padding: "40px",
  },

  leftTitle: {
    fontSize: 28,
    fontWeight: "700",
  },

  desc: {
    fontSize: 15,
    marginTop: 15,
    lineHeight: 1.6,
  },

  note: {
    background: "#e2f0ff",
    padding: 10,
    borderRadius: 6,
    marginTop: 25,
    color: "#1a73e8",
  },

  rightBox: {
    width: "65%",
    padding: "40px",
  },

  pageTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a73e8",
    marginBottom: 20,
  },

  tableWrap: {
    background: "#fff",
    padding: 15,
    borderRadius: 10,
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  bold: {
    fontWeight: "600",
  },

  badge: {
    background: "#d1ecf1",
    padding: "5px 10px",
    borderRadius: 5,
    fontSize: 13,
    color: "#0c5460",
  },

  editBtn: {
    background: "#28a745",
    border: "none",
    padding: "6px 10px",
    color: "white",
    borderRadius: 5,
    marginRight: 6,
    cursor: "pointer",
  },

  deleteBtn: {
    background: "#dc3545",
    border: "none",
    padding: "6px 10px",
    color: "white",
    borderRadius: 5,
    cursor: "pointer",
  },

  noData: {
    textAlign: "center",
    padding: "50px 0",
  },
};
