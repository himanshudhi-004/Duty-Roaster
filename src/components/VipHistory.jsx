import React, { useEffect, useState } from "react";
import axios from "axios";
import { useVipStore } from "../context/VipContext";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function VipDutyHistory() {
  const { selectedVip } = useVipStore();

  const [allData, setAllData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;
  const [loading, setLoading] = useState(true);

  //  ALWAYS CALL API ON PAGE LOAD
  useEffect(() => {
    if (selectedVip?.id) {
      fetchDutyHistory(selectedVip.id);
      return;
    }

    const storedVip = localStorage.getItem("selectedVip");
    if (storedVip) {
      const vipObj = JSON.parse(storedVip);
      if (vipObj?.id) {
        fetchDutyHistory(vipObj.id);
      }
    }
  }, []);

  //  API CALL WITH TOKEN
  const fetchDutyHistory = async (vipId) => {
    try {
      setLoading(true);

      // 🔑 Adjust token key if needed (e.g. "token")
      const token =
        localStorage.getItem("vipToken") || localStorage.getItem("token");

      const res = await axios.get(
        `${BASE_URL}/api/assignments/vip/${vipId}/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllData(res.data || []);
    } catch (err) {
      console.log("VIP Duty History Error:", err);
    } finally {
      setLoading(false);
    }
  };

  //  SEARCH FILTER (HANDLES NESTED FIELDS)
  const filteredData = allData.filter((item) =>
    `
    ${item.id}
 ${item.category?.name}
    ${item.category?.designation}
    ${item.officer?.name}
    ${item.officer?.rank}
    ${item.status}
    `
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  //  PAGINATION
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + rowsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  //  DATE FORMATTER
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>Vip Duty History</div>

      {/* 🔍 SEARCH */}
      <div style={styles.filterRow}>
        <div style={styles.filterCard}>
          <div style={styles.filterLabel}>Search Duty</div>
          <input
            style={styles.select}
            placeholder="Search by name, rank, status..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* 📋 TABLE */}
      <div style={styles.card}>
        {loading ? (
          <div style={styles.noData}>Loading duty history...</div>
        ) : paginatedData.length === 0 ? (
          <div style={styles.noData}>No duty history found</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Duty ID</th>
                <th style={styles.th}>Assigned At</th>
                {/* <th style={styles.th}>Category</th>
                <th style={styles.th}>Designation</th> */}
                <th style={styles.th}>Guard Name</th>
                <th style={styles.th}>Rank</th>
                {/* <th style={styles.th}>Times Assigned</th> */}
                <th style={styles.th}>Start At</th>
                <th style={styles.th}>End At</th>
                <th style={styles.th}>At End</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((item, i) => (
                <tr key={i} style={styles.row}>
                  <td style={styles.td}>{item.id}</td>
                  {/* <td style={styles.td}>{item.category?.name || "N/A"}</td> */}
                  {/* <td style={styles.td}> */}
                    {/* {item.category?.designation || "N/A"} */}
                  {/* </td> */}
                  <td style={styles.td}>{formatDate(item.assignedAt)}</td>
                  <td style={styles.td}>{item.officer?.name || "N/A"}</td>
                  <td style={styles.td}>{item.officer?.rank || "N/A"}</td>
                  {/* <td style={styles.td}>{item.timesAssigned}</td> */}
                  <td style={styles.td}>{formatDate(item.startAt)}</td>
                  <td style={styles.td}>{formatDate(item.endAt)}</td>
                  <td style={styles.td}>{formatDate(item.atEnd)}</td>
                  <td style={styles.td}>
                    <span
                      style={
                        item.status === "Active"
                          ? styles.statusActive
                          : item.status === "Inactive"
                          ? styles.statusInactive
                          : styles.statusOther
                      }
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/*  PAGINATION */}
        {totalPages > 1 && (
          <div style={styles.paginationContainer}>
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
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------ UI STYLES ------------------ */

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
  row: { height: 62, transition: "0.25s", cursor: "pointer" },
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

  noData: {
    textAlign: "center",
    padding: 40,
    fontSize: 18,
    color: "#777",
  },

  paginationContainer: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    padding: 15,
  },
  pageBtn: {
    padding: "6px 14px",
    borderRadius: 6,
    border: "1px solid #1967d2",
    background: "white",
    cursor: "pointer",
  },
  activePage: {
    background: "#1967d2",
    color: "#fff",
    fontWeight: 700,
  },
};
