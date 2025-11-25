import React, { useEffect, useState, useRef } from "react";
import { getAllVip, deleteVip } from "../api/vipform";
import { useVipStore } from "../context/VipContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/* ------------------ STATIC GUARD REQUIREMENT ------------------ */
const guardDistribution = {
  "Bollywood Actor": ["Grade A - 1", "Grade B - 1", "Grade C - 2", "Grade E - 10"],
  Cricketers: ["Grade B - 1", "Grade C - 1", "Grade D - 5", "Grade E - 10"],
  Chessmaster: ["Grade B - 1", "Grade C - 2", "Grade E - 10"],
  User: ["Grade D - 2", "Grade E - 15"],
};

export default function VipGuardManagement() {
  const { handleEdit, refreshTrigger } = useVipStore();
  const [vipList, setVipList] = useState([]);

  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(""); // ADDED STATUS FILTER ✔

  const [popupData, setPopupData] = useState(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });

  const navigate = useNavigate();
  const rowRefs = useRef({});

  /* ---------------- FETCH VIP LIST ---------------- */
  useEffect(() => {
    async function load() {
      try {
        const data = await getAllVip();
        if (Array.isArray(data)) setVipList(data);
        else if (Array.isArray(data?.data)) setVipList(data.data);
      } catch (err) {
        console.error("Fetch VIP Error:", err);
      }
    }
    load();
  }, [refreshTrigger]);

  /* ---------------- DELETE VIP ---------------- */
  const handleDelete = async (id) => {
    if (toast.success("Delete this VIP?")) {
      try {
        await deleteVip(id);
        const updated = await getAllVip();
        setVipList(Array.isArray(updated) ? updated : []);
        toast.success("VIP Deleted Successfully!");
      } catch (err) {
        console.error("Delete Error:", err);
      }
    }
  };

  /* ---------------- FILTER ---------------- */
  const designations = [...new Set(vipList.map((v) => v.designation))];

  const filtered =
    vipList.filter((v) => {
      const desMatch = selectedDesignation ? v.designation === selectedDesignation : true;
      const statusMatch = selectedStatus ? v.status === selectedStatus : true;
      return desMatch && statusMatch;
    });

  /* ---------------- POPUP ---------------- */
  const openPopup = (e, vip, id) => {
    e.stopPropagation();

    if (popupData?.id === id) {
      setPopupData(null);
      return;
    }

    const row = rowRefs.current[id];
    const rect = row.getBoundingClientRect();

    setPopupPos({
      top: rect.top - 150,
      left: rect.left + rect.width / 2 - 130,
    });

    setPopupData({ ...vip, id });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>VIP Guard Assignment</h2>

      {/* ---------------- FILTERS IN ONE ROW ---------------- */}
      <div style={styles.filterRow}>
        {/* DESIGNATION FILTER */}
        <div style={styles.filterCard}>
          <label style={styles.filterLabel}>Designation</label>
          <select
            value={selectedDesignation}
            onChange={(e) => setSelectedDesignation(e.target.value)}
            style={styles.select}
          >
            <option value="">All</option>
            {designations.map((d, i) => (
              <option key={i}>{d}</option>
            ))}
          </select>
        </div>

        {/* STATUS FILTER — NEW ✔*/}
        <div style={styles.filterCard}>
          <label style={styles.filterLabel}>Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={styles.select}
          >
            <option value="">All</option>
            <option>Active</option>
            <option>Inactive</option>
            {/* <option>Other</option> */}
          </select>
        </div>
      </div>

      {/* VIP TABLE */}
      <div style={styles.card}>
        {filtered.length === 0 ? (
          <div style={styles.noData}>No VIP Records Found</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Designation</th>
                <th style={styles.th}>Contact</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((vip, index) => {
                /* ----------- STATUS BADGE COLORS ----------- */
                const statusStyle =
                  vip.status === "Active"
                    ? {
                        background: "#e6ffe6",
                        padding: "6px 12px",
                        borderRadius: 20,
                        color: "#2e7d32",
                        fontWeight: 600,
                        fontSize: 13,
                      }
                    : vip.status === "Inactive"
                    ? {
                        background: "#ffe6e6",
                        padding: "6px 12px",
                        borderRadius: 20,
                        color: "#d32f2f",
                        fontWeight: 600,
                        fontSize: 13,
                      }
                    : {
                        background: "#fff8e1",
                        padding: "6px 12px",
                        borderRadius: 20,
                        color: "#ff9800",
                        fontWeight: 600,
                        fontSize: 13,
                      };

                return (
                  <tr
                    key={vip.id}
                    ref={(el) => (rowRefs.current[vip.id] = el)}
                    style={styles.row}
                    onClick={() =>
                      navigate(`/vip-auto-assign`, { state: { vip } })
                    }
                  >
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>{vip.name}</td>
                    <td style={styles.td}>{vip.email}</td>

                    <td style={styles.td}>
                      <span style={styles.badge}>{vip.designation}</span>
                    </td>

                    <td style={styles.td}>{vip.contactno}</td>

                    <td style={styles.td}>
                      <span style={statusStyle}>{vip.status}</span>
                    </td>

                    <td style={styles.actionCol}>
                      <button
                        style={styles.infoBtn}
                        onClick={(e) => openPopup(e, vip, vip.id)}
                      >
                        <i className="fa fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ---------------- POPUP ---------------- */}
      {popupData && (
        <div
          style={{ ...styles.popup, top: popupPos.top, left: popupPos.left }}
          onMouseLeave={() => setPopupData(null)}
        >
          <div style={styles.arrow}></div>

          <h3 style={styles.popupTitle}>{popupData.name}</h3>
          <p style={styles.popText}>📧 {popupData.email}</p>
          <p style={styles.popText}>🎖 {popupData.designation}</p>
          <p style={styles.popText}>📞 {popupData.contactno}</p>

          {popupData.status?.toLowerCase() === "active" ? (
            <p style={styles.popText}>
              <span className="badge bg-success" style={{ padding: "7px 10px" }}>
                ✔ Active
              </span>
            </p>
          ) : (
            <p style={styles.popText}>
              <span className="badge bg-danger" style={{ padding: "7px 10px" }}>
                ✘ Inactive
              </span>
            </p>
          )}

          <h4 style={{ fontWeight: 700, marginTop: 10 }}>Required Guards:</h4>

          {(guardDistribution[popupData.designation] || []).map((item, i) => (
            <p key={i} style={styles.popText}>
              {item}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------ STYLES ----------------------------- */

const styles = {
  container: { padding: 30, background: "#fff" },

  title: {
    fontSize: 30,
    fontWeight: 800,
    marginBottom: 25,
    color: "#1967d2",
  },

  /* NEW: FILTERS SIDE BY SIDE */
  filterRow: {
    display: "flex",
    gap: 20,
    marginBottom: 25,
  },

  filterCard: {
    flex: 1,
    padding: 18,
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
  },

  filterLabel: { fontSize: 15, fontWeight: 600, marginBottom: 6 },

  select: {
    width: "100%",
    padding: "12px",
    borderRadius: 8,
    border: "1.5px solid #1a73e8",
    fontSize: 15,
  },

  card: {
    background: "#fff",
    padding: 10,
    borderRadius: 15,
    boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
    marginBottom: 150,
  },

  table: { width: "100%", borderCollapse: "collapse" },

  th: {
    background: "#f4f4f6",
    padding: "16px 10px",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
    fontSize: 15,
    fontWeight: 700,
  },

  row: {
    height: "62px",
    transition: "0.25s",
    cursor: "pointer",
  },

  td: {
    padding: "14px 10px",
    borderBottom: "1px solid #eee",
    fontSize: 15,
  },

  badge: {
    background: "#d7ecff",
    padding: "6px 12px",
    borderRadius: 8,
    color: "#005bb7",
    fontWeight: "600",
    fontSize: 13,
  },

  actionCol: {
    display: "flex",
    gap: 12,
    paddingTop: "12px",
  },

  infoBtn: {
    background: "#1976d2",
    padding: "7px 12px",
    border: "none",
    color: "#fff",
    borderRadius: 8,
  },

  noData: {
    textAlign: "center",
    padding: 40,
    fontSize: 18,
    color: "#777",
  },

  popup: {
    position: "absolute",
    background: "#ffffff",
    padding: 18,
    width: "260px",
    borderRadius: "12px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
    zIndex: 5000,
  },

  arrow: {
    position: "absolute",
    bottom: "-10px",
    left: "50%",
    transform: "translateX(-50%)",
    width: 0,
    height: 0,
    borderLeft: "10px solid transparent",
    borderRight: "10px solid transparent",
    borderTop: "10px solid white",
  },

  popupTitle: { fontSize: 18, fontWeight: 700, marginBottom: 10 },

  popText: { margin: "6px 0", fontSize: 14, color: "#333" },
};

/* Hover row */
const styleEl = document.createElement("style");
styleEl.innerHTML = `
  table tbody tr:hover { background-color: #e9f3ff !important; }
`;
document.head.appendChild(styleEl);
