import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useGuardStore } from "../context/GuardContext";
import { useVipStore } from "../context/VipContext";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const PER_PAGE = 10;

export default function AdminUserHistory() {
  const { setSelectedGuard } = useGuardStore();
  const { setSelectedVip } = useVipStore();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const role = localStorage.getItem("role");
      const token = localStorage.getItem(`${role}Token`);

      const res = await axios.get(`${BASE_URL}/api/assignments/getall`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(res.data || []);
    } catch (err) {
      console.log("Admin User History Error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* DATE FORMATTER */
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  /* GROUP BY CATEGORY */
  const groupedData = useMemo(() => {
    const map = {};
    data.forEach((item) => {
      const key = item.category?.id;
      if (!map[key]) {
        map[key] = { category: item.category, list: [] };
      }
      map[key].list.push(item);
    });
    return Object.values(map);
  }, [data]);

  /* SEARCH FILTER */
  const filteredData = useMemo(() => {
    return groupedData.filter((group) =>
      group.category?.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [groupedData, search]);

  /* PAGINATION */
  const totalPages = Math.ceil(filteredData.length / PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filteredData.slice(start, start + PER_PAGE);
  }, [filteredData, currentPage]);

  const handleExpand = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleRowClick = (item, e) => {
    setSelectedVip(item.category || null);
    setSelectedGuard(item.officer || null);

    const rect = e.currentTarget.getBoundingClientRect();
    setPopupPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + window.scrollY,
    });

    setSelectedRow(item);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin & User Duty History</h2>

      {/* SEARCH LIKE VIP UI */}
      <div style={styles.filterRow}>
        <div style={styles.filterCard}>
          <label style={styles.filterLabel}>Search</label>
          <input
            type="text"
            placeholder="Search VIP..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.card}>
        {loading ? (
          <div style={styles.noData}>Loading history...</div>
        ) : paginatedData.length === 0 ? (
          <div style={styles.noData}>No history found</div>
        ) : (
          <>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>VIP Name</th>
                  <th style={styles.th}>Designation</th>
                  <th style={styles.th}>Total Guards</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((group) => (
                  <React.Fragment key={group.category.id}>
                    <tr
                      style={styles.row}
                      onClick={() => handleExpand(group.category.id)}
                    >
                      <td style={styles.td}>{group.category.name}</td>
                      <td style={styles.td}>
                        <span style={styles.badge}>
                          {group.category.designation}
                        </span>
                      </td>
                      <td style={styles.td}>{group.list.length}</td>
                      <td style={styles.td}>
                        <button style={styles.infoBtn}>View Guards</button>
                      </td>
                    </tr>

                    <tr>
                      <td colSpan="4" style={{ padding: 0 }}>
                        <div
                          style={{
                            ...styles.expandBox,
                            maxHeight:
                              expandedCategory === group.category.id
                                ? "900px"
                                : "0px",
                          }}
                        >
                          {/* GUARD TABLE (UNCHANGED DATA) */}
                          <table style={styles.innerTable}>
                            <thead>
                              <tr>
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>Rank</th>
                                <th style={styles.th}>Phone</th>
                                <th style={styles.th}>Assigned At</th>
                                {/* <th style={styles.th}>Start At</th> */}
                                <th style={styles.th}>End At</th>
                                <th style={styles.th}>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {group.list.map((item, i) => (
                                <tr
                                  key={i}
                                  style={styles.guardRow}
                                  onClick={(e) => handleRowClick(item, e)}
                                >
                                  <td style={styles.td}>{item.officer?.name}</td>
                                  <td style={styles.td}>{item.officer?.rank}</td>
                                  <td style={styles.td}>{item.officer?.contactno}</td>
                                  <td style={styles.td}>{formatDate(item.assignedAt)}</td>
                                  {/* <td style={styles.td}>{formatDate(item.startAt)}</td> */}
                                  <td style={styles.td}>{formatDate(item.endAt)}</td>
                                  <td style={styles.td}>
                                    <span
                                      style={
                                        item.status === "Active"
                                          ? styles.statusActive
                                          : styles.statusInactive
                                      }
                                    >
                                      {item.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div style={styles.paginationContainer}>
              <button
                disabled={currentPage === 1}
                style={styles.pageBtn}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  style={{
                    ...styles.pageBtn,
                    ...(currentPage === i + 1 ? styles.activePage : {}),
                  }}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                style={styles.pageBtn}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* POPUP – UNCHANGED WORKING */}
      {selectedRow && (
        <div
          style={{
            ...styles.popup,
            top: popupPosition.y - 20,
            left: popupPosition.x - 180,
          }}
        >
          <div style={styles.popupTitle}>Guard Details</div>

          <div><b>Name:</b> {selectedRow.officer?.name}</div>
          <div><b>Rank:</b> {selectedRow.officer?.rank}</div>
          <div><b>Phone:</b> {selectedRow.officer?.contactno}</div>
          <div><b>Experience:</b> {selectedRow.officer?.experience} Years</div>
          <div><b>Assigned At:</b> {formatDate(selectedRow.assignedAt)}</div>
          <div><b>Start At:</b> {formatDate(selectedRow.startAt)}</div>
          <div><b>End At:</b> {formatDate(selectedRow.endAt)}</div>
          <div><b>Status:</b> {selectedRow.status}</div>

          <button
            onClick={() => setSelectedRow(null)}
            style={styles.infoBtn}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- VIP MANAGEMENT UI STYLES ONLY ---------------- */
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

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1.5px solid #1a73e8",
    fontSize: 15,
  },

  card: {
    background: "#fff",
    padding: 10,
    borderRadius: 15,
    boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
  },

  table: { width: "100%", borderCollapse: "collapse" },
  innerTable: { width: "100%", borderCollapse: "collapse", background: "#f9fbff" },

  th: {
    background: "#f4f4f6",
    padding: "12px",
    borderBottom: "2px solid #ddd",
  },

  row: { cursor: "pointer" },
  guardRow: { cursor: "pointer", borderBottom: "1px solid #ddd" },
  td: { padding: "12px", borderBottom: "1px solid #eee" },

  badge: {
    background: "#d7ecff",
    padding: "6px 12px",
    borderRadius: 8,
    color: "#005bb7",
    fontWeight: 600,
  },

  infoBtn: {
    background: "#1976d2",
    padding: "7px 14px",
    border: 0,
    color: "#fff",
    borderRadius: 8,
    cursor: "pointer",
  },

  expandBox: { overflow: "hidden", transition: "all 0.4s ease" },

  statusActive: { background: "#e6ffe6", padding: "4px 10px", borderRadius: 20 },
  statusInactive: { background: "#ffe6e6", padding: "4px 10px", borderRadius: 20 },

  paginationContainer: { display: "flex", justifyContent: "center", gap: 10, padding: 15 },

  pageBtn: {
    padding: "6px 14px",
    borderRadius: 6,
    border: "1px solid #1967d2",
    background: "white",
    cursor: "pointer",
  },

  activePage: { background: "#1967d2", color: "#fff", fontWeight: 700 },

  noData: { textAlign: "center", padding: 40, fontSize: 18, color: "#777" },

  popup: {
    position: "absolute",
    background: "#ffffff",
    padding: 18,
    width: 340,
    borderRadius: 12,
    boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
    zIndex: 5000,
  },

  popupTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 10,
  },
};
