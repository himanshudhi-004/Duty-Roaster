//------------------------------------------3------------------------------------------------

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function AdminRequestAccept() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // SEARCH & FILTER
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // ROLE & TOKEN
  const role = localStorage.getItem("role");
  const token = localStorage.getItem(`${role}Token`);

  /* ---------------- FETCH ---------------- */
  const fetchRequests = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/api/duty/decision/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data)) setRequests(res.data);
      else if (Array.isArray(res.data?.data)) setRequests(res.data.data);
    } catch (error) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  /* ---------------- ACCEPT / REJECT ---------------- */
  const handleDecision = async (item, action) => {
    try {
      const finalStatus =
        role === "admin"
          ? action === "accept"
            ? "admin_accepted"
            : "admin_rejected"
          : action === "accept"
            ? "manager_accepted"
            : "manager_rejected";

      const payload = {
        id: item.id,
        status: finalStatus,
      };

      await axios.post(`${BASE_URL}/api/duty/decision/management`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(finalStatus);
      fetchRequests();
    } catch (error) {
      toast.error("Action Failed");
    }
  };

  /* ---------------- SEARCH + STATUS FILTER ---------------- */
  const filteredData = requests.filter((item) => {
    const text = searchText.trim().toLowerCase();

    const searchMatch = text
      ? [
        item.officer?.name,
        item.officer?.rank,
        item.status,
        item.message,
      ].some((field) =>
        String(field || "").toLowerCase().includes(text)
      )
      : true;

    const statusMatch = selectedStatus
      ? String(item.status || "").toLowerCase().includes(
        selectedStatus.toLowerCase()
      )
      : true;

    return searchMatch && statusMatch;
  });

  /*  OPTIONAL SORT */
  const sortedData = [...filteredData];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin / Manager Request Approval</h2>

      {/* FILTERS */}
      <div style={styles.filterRow}>
        <div style={styles.filterCard}>
          <label style={styles.filterLabel}>Search</label>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by name, rank, message..."
            style={styles.input}
          />
        </div>

        <div style={styles.filterCard}>
          <label style={styles.filterLabel}>Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={styles.select}
          >
            <option value="">All</option>
            <option value="admin accepted">Admin Accepted</option>
            <option value="admin rejected">Admin Rejected</option>
            <option value="manager accepted">Manager Accepted</option>
            <option value="manager rejected">Manager Rejected</option>
            <option value="guard rejected">Guard Rejected</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div style={styles.card}>
        {loading ? (
          <div style={styles.noData}>Loading...</div>
        ) : sortedData.length === 0 ? (
          <div style={styles.noData}>No Requests Found</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Guard</th>
                <th style={styles.th}>Rank</th>
                <th style={styles.th}>Message</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Request Time</th>
                <th style={styles.th}>Response Time</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {sortedData.map((item, index) => {
                const statusText = item.status || "Completed";

                //  ONLY show buttons if status === "Guard Rejected"
                const isGuardRejected =
                  String(statusText).toLowerCase().trim() ===
                  "guard rejected";

                const statusStyle =
                  statusText.toLowerCase().includes("accepted")
                    ? styles.statusActive
                    : statusText.toLowerCase().includes("rejected")
                      ? styles.statusInactive
                      : styles.statusOther;

                return (
                  <tr key={item.id} style={styles.row}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>{item.officer?.name}</td>
                    <td style={styles.td}>{item.officer?.rank}</td>
                    <td style={styles.td}>{item.message || "N/A"}</td>

                    <td style={styles.td}>
                      <span style={statusStyle}>{statusText}</span>
                    </td>
                    <td style={styles.td}>
                      {item.requestTime
                        ? new Date(item.requestTime.split(".")[0]).toLocaleString("en-IN")
                        : "N/A"}
                    </td>

                    <td style={styles.td}>
                      {item.responseTime
                        ? new Date(item.responseTime.split(".")[0]).toLocaleString("en-IN")
                        : "N/A"}
                    </td>


                    <td style={styles.td}>
                      {isGuardRejected ? (
                        <div style={{ display: "flex", gap: 10 }}>
                          <button
                            style={styles.acceptBtn}
                            onClick={() =>
                              handleDecision(item, "accept")
                            }
                          >
                            Accept
                          </button>

                          <button
                            style={styles.rejectBtn}
                            onClick={() =>
                              handleDecision(item, "reject")
                            }
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: "#777", fontWeight: 600 }}>
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  container: { padding: 30, background: "#fff" },
  title: { fontSize: 30, fontWeight: 800, marginBottom: 25, color: "#1967d2" },

  filterRow: { display: "flex", gap: 20, marginBottom: 25 },
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

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1.5px solid #1a73e8",
    fontSize: 15,
    outline: "none",
  },

  card: {
    background: "#fff",
    padding: 10,
    borderRadius: 15,
    boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
  },

  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    background: "#f4f4f6",
    padding: "16px 10px",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
    fontWeight: 700,
  },
  row: { height: 62, transition: "0.25s" },
  td: { padding: "14px 10px", borderBottom: "1px solid #eee" },

  statusActive: {
    background: "#e6ffe6",
    padding: "6px 12px",
    borderRadius: 20,
    color: "#2e7d32",
    fontWeight: 600,
  },
  statusInactive: {
    background: "#ffe6e6",
    padding: "6px 12px",
    borderRadius: 20,
    color: "#d32f2f",
    fontWeight: 600,
  },
  statusOther: {
    background: "#fff8e1",
    padding: "6px 12px",
    borderRadius: 20,
    color: "#ff9800",
    fontWeight: 600,
  },

  acceptBtn: {
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    padding: "7px 14px",
    borderRadius: 8,
    cursor: "pointer",
  },
  rejectBtn: {
    background: "#d32f2f",
    color: "#fff",
    border: "none",
    padding: "7px 14px",
    borderRadius: 8,
    cursor: "pointer",
  },

  noData: { textAlign: "center", padding: 40, fontSize: 18, color: "#777" },
};
