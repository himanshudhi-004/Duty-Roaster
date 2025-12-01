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

  /*  GROUP BY CATEGORY */
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

  /*  SEARCH FILTER */
  const filteredData = useMemo(() => {
    return groupedData.filter((group) =>
      group.category?.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [groupedData, search]);

  /*  PAGINATION */
  const totalPages = Math.ceil(filteredData.length / PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filteredData.slice(start, start + PER_PAGE);
  }, [filteredData, currentPage]);

  const handleExpand = (categoryId) => {
    setExpandedCategory(
      expandedCategory === categoryId ? null : categoryId
    );
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
      <div style={styles.header}>
        <div style={styles.title}>Admin User Duty History</div>

        {/*  SEARCH BOX */}
        <input
          type="text"
          placeholder="Search VIP..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          style={styles.search}
        />
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
                      <td style={styles.td}>
                        <span style={styles.badge}>
                          {group.category.name}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {group.category.designation}
                      </td>
                      <td style={styles.td}>{group.list.length}</td>
                      <td style={styles.td}>👁 View Guards</td>
                    </tr>

                    <tr>
                      <td colSpan="4" style={{ padding: 0 }}>
                        <div
                          style={{
                            ...styles.expandBox,
                            maxHeight:
                              expandedCategory === group.category.id
                                ? "600px"
                                : "0px",
                          }}
                        >
                          {group.list.map((item, i) => (
                            <div
                              key={i}
                              style={styles.guardRow}
                              onClick={(e) =>
                                handleRowClick(item, e)
                              }
                            >
                              <div>
                                <b>{item.officer?.name}</b> (
                                {item.officer?.rank})
                              </div>
                              <div>{item.officer?.contactno}</div>
                              <span
                                style={
                                  item.status === "Active"
                                    ? styles.statusActive
                                    : styles.statusInactive
                                }
                              >
                                {item.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {/*  PAGINATION CONTROLS */}
            <div style={styles.pagination}>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.max(1, p - 1))
                }
                disabled={currentPage === 1}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  style={
                    currentPage === i + 1
                      ? styles.activePage
                      : {}
                  }
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(totalPages, p + 1)
                  )
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/*  GUARD POPUP */}
      {selectedRow && (
        <div
          style={{
            ...styles.popup,
            top: popupPosition.y - 20,
            left: popupPosition.x - 130,
          }}
        >
          <div style={styles.popupTitle}>Guard Details</div>

          <div style={styles.popText}>
            <b>Name:</b> {selectedRow.officer?.name}
          </div>
          <div style={styles.popText}>
            <b>Rank:</b> {selectedRow.officer?.rank}
          </div>
          <div style={styles.popText}>
            <b>Phone:</b> {selectedRow.officer?.contactno}
          </div>
          <div style={styles.popText}>
            <b>Experience:</b>{" "}
            {selectedRow.officer?.experience || 0} Years
          </div>
          <div style={styles.popText}>
            <b>Status:</b> {selectedRow.status}
          </div>

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

/* ---------------- STYLES ---------------- */
const styles = {
  container: { padding: 30, background: "#fff" },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  title: { fontSize: 30, fontWeight: 800 },

  search: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    width: 240,
  },

  card: { background: "#fff", padding: 10, borderRadius: 15 },

  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: 16, background: "#f4f4f6" },
  td: { padding: 14, borderBottom: "1px solid #eee" },
  row: { cursor: "pointer" },

  badge: {
    background: "#d7ecff",
    padding: "6px 12px",
    borderRadius: 8,
  },

  expandBox: {
    overflow: "hidden",
    transition: "all 0.4s ease",
    background: "#f9fbff",
  },

  guardRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    borderBottom: "1px solid #ddd",
    cursor: "pointer",
  },

  statusActive: {
    background: "#e6ffe6",
    padding: "4px 10px",
    borderRadius: 20,
  },
  statusInactive: {
    background: "#ffe6e6",
    padding: "4px 10px",
    borderRadius: 20,
  },

  pagination: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
  },

  activePage: {
    background: "#1976d2",
    color: "#fff",
  },

  noData: { textAlign: "center", padding: 40 },

  popup: {
    position: "absolute",
    background: "#fff",
    padding: 18,
    width: 260,
    borderRadius: 12,
    boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
    zIndex: 5000,
  },
};
