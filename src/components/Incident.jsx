import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Incident() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);

  //  SEARCH & FILTER
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  //  ROLE & TOKEN
  const role = localStorage.getItem("role");
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("userToken");

  const token = role === "admin" ? adminToken : userToken;

  //  FETCH INCIDENTS
  const fetchIncidents = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/api/duty/accidentall`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIncidents(res.data || []);
    } catch (error) {
      console.error("Fetch Incident Error:", error);
      toast.error("Failed to load incident requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  //  ACCEPT / REJECT (NO LOGIC CHANGE)
  const handleStatusUpdate = async (item, action) => {
    try {
      const finalStatus =
        role === "admin"
          ? action === "accept"
            ? "admin_accepted"
            : "admin_rejected"
          : action === "accept"
          ? "manager_accepted"
          : "manager_rejected";

      const Accidentreq = {
        id: item.id,
        req: finalStatus,
      
      };

      // await axios.post(`${BASE_URL}/api/duty/accidentupdate`, payload, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
         
      //   },
      // });
      
       const res = await axios.post(`${BASE_URL}/api/duty/accidentupdate`, Accidentreq, {
        
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(`Request ${action.toUpperCase()}ED Successfully `);
      fetchIncidents();
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Failed to update request ");
    }
  };


  /* ---------------- SEARCH + STATUS FILTER ---------------- */
  const filteredData = incidents.filter((item) => {
    const text = searchText.trim().toLowerCase();

    const searchMatch = text
      ? [
          item.guardData?.id,
          item.guardData?.name,
          item.req,
          item.message,
          item.status,
        ].some((field) =>
          String(field || "").toLowerCase().includes(text)
        )
      : true;

    const statusMatch = selectedStatus
      ? item.status?.includes(selectedStatus)
      : true;

    return searchMatch && statusMatch;
  });

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Incident Request Management</h2>

      {/*  FILTERS ROW */}
      <div style={styles.filterRow}>
        <div style={styles.filterCard}>
          <label style={styles.filterLabel}>Search</label>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by guard, message, type..."
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
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/*  TABLE CARD */}
      <div style={styles.card}>
        {loading ? (
          <div style={styles.noData}>Loading...</div>
        ) : filteredData.length === 0 ? (
          <div style={styles.noData}>No Incident Requests Found</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Guard ID</th>
                <th style={styles.th}>Guard Name</th>
                <th style={styles.th}>Arise Type</th>
                <th style={styles.th}>Message</th>
                <th style={styles.th}>Status</th>
                {(role === "admin" || role === "user") && (
                  <th style={styles.th}>&emsp;&nbsp;Action</th>
                )}
              </tr>
            </thead>

            <tbody>
              {filteredData.map((item, index) => {
                const statusStyle =
                  item.status?.includes("accepted")
                    ? styles.statusActive
                    : item.status?.includes("rejected")
                    ? styles.statusInactive
                    : styles.statusOther;

                return (
                  <tr key={item.id} style={styles.row}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>{item.guardData?.id}</td>
                    <td style={styles.td}>
                      {item.guardData?.name || "N/A"}
                    </td>
                    <td style={styles.td}>{item.req}</td>
                    <td style={styles.td}>{item.message}</td>

                    <td style={styles.td}>
                      <span style={statusStyle}>
                        {item.status || "Pending"}
                      </span>
                    </td>

                    {(role === "admin" || role === "user") && (
                      <td style={styles.td}>
                        {item.status?.includes("accepted") ||
                        item.status?.includes("rejected") ? (
                          <span style={{ color: "#888" }}>Completed</span>
                        ) : (
                          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                            <button
                              style={styles.acceptBtn}
                              onClick={() =>
                                handleStatusUpdate(item, "accept")
                              }
                            >
                              Accept
                            </button>

                            <button
                              style={styles.rejectBtn}
                              onClick={() =>
                                handleStatusUpdate(item, "reject")
                              }
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    )}
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

/* ------------------------------ VIP STYLE ----------------------------- */

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
