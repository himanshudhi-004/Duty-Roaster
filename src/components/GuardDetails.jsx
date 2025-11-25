import React, { useEffect, useState } from "react";
import { getAllGuard, deleteGuard } from "../api/vipform";
import { useGuardStore } from "../context/GuardContext";
import { toast } from "react-toastify";

export default function GuardDetails() {
  const { handleEdit, refreshTrigger } = useGuardStore();
  const [guardList, setGuardList] = useState([]);
  const [selectedRank, setSelectedRank] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  /* FETCH GUARDS */
  useEffect(() => {
    async function fetchGuards() {
      try {
        const data = await getAllGuard();

        if (Array.isArray(data)) setGuardList(data);
        else if (Array.isArray(data?.data)) setGuardList(data.data);
        else if (Array.isArray(data?.guards)) setGuardList(data.guards);
        else if (Array.isArray(data?.officers)) setGuardList(data.officers);
      } catch (err) {
        toast.error("Failed to load guards!");
      }
    }

    fetchGuards();
  }, [refreshTrigger]);

  /* DELETE GUARD */
  const handleDelete = async (id) => {
    try {
      await deleteGuard(id);
      const updated = await getAllGuard();
      setGuardList(Array.isArray(updated) ? updated : []);
      toast.success("Guard deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete guard!");
    }
  };

  /* FILTER OPTIONS */
  const ranks = [...new Set(guardList.map((g) => g.rank || "Uncategorized"))];

  const filteredGuards = guardList.filter((g) => {
    const rankMatch = selectedRank ? g.rank === selectedRank : true;
    const statusMatch = selectedStatus ? g.status === selectedStatus : true;
    return rankMatch && statusMatch;
  });

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.headerRow}>
        <h2 style={styles.title}>Guard Records</h2>

        <div style={styles.totalBox}>
          <span style={styles.totalNumber}>{guardList.length}</span>
          <span style={styles.totalLabel}>Total Guards</span>
        </div>
      </div>

      {/* FILTERS — TWO BOXES IN ONE ROW */}
      <div style={styles.filterRow}>
        
        {/* RANK FILTER */}
        <div style={styles.filterCard}>
          <label style={styles.filterLabel}>Rank</label>
          <select
            value={selectedRank}
            onChange={(e) => setSelectedRank(e.target.value)}
            style={styles.select}
          >
            <option value="">All</option>
            {ranks.map((r, i) => (
              <option key={i}>{r}</option>
            ))}
          </select>
        </div>

        {/* STATUS FILTER */}
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

      {/* TABLE */}
      <div style={styles.tableCard}>
        {filteredGuards.length === 0 ? (
          <div style={styles.noData}>No Guards Found</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Password</th>
                <th style={styles.th}>Rank</th>
                <th style={styles.th}>Experience</th>
                <th style={styles.th}>Contact</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredGuards.map((g, i) => {
                const statusStyle =
                  g.status === "Active"
                    ? styles.statusActive
                    : g.status === "Inactive"
                    ? styles.statusInactive
                    : styles.statusOther;

                return (
                  <tr
                    key={i}
                    style={styles.row}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(25,103,210,0.06)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td style={styles.td}>{i + 1}</td>
                    <td style={styles.td}>{g.name}</td>
                    <td style={styles.td}>{g.email}</td>
                    <td style={styles.td}>{g.username}</td>
                    <td style={styles.td}>{g.password}</td>

                    <td style={styles.td}>
                      <span style={styles.rankBadge}>{g.rank}</span>
                    </td>

                    <td style={styles.td}>{g.experience}</td>
                    <td style={styles.td}>{g.contactno}</td>

                    <td style={styles.td}>
                      <span style={statusStyle}>{g.status}</span>
                    </td>

                    <td style={styles.actionCol}>
                      <button style={styles.editBtn} onClick={() => handleEdit(g)}>
                        <i className="fa fa-edit"></i>
                      </button>
                      {/* <button style={styles.deleteBtn} onClick={() => handleDelete(g.id)}>
                        <i className="fa fa-trash"></i>
                      </button> */}
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

/* ------------------ STYLES ------------------ */

const styles = {
  /* FULL WIDTH — NO LEFT/RIGHT SPACE AT ALL */
  page: {
    width: "100%",
    padding: "0px 0px",
    background: "#fff",
    margin: 0,
  },

  headerRow: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1967d2",
  },

  totalBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#e8f1ff",
    padding: "12px 18px",
    borderRadius: 12,
  },

  totalNumber: { fontSize: 26, fontWeight: "800", color: "#1967d2" },
  totalLabel: { fontSize: 15, fontWeight: "600", color: "#1967d2" },

  /* FILTERS ROW (SIDE-BY-SIDE) */
  filterRow: {
    display: "flex",
    gap: 20,
    width: "100%",
    padding: "0px 20px",
    marginBottom: 20,
  },

  filterCard: {
    flex: 1,
    background: "#fff",
    padding: 15,
    borderRadius: 12,
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  },

  filterLabel: {
    fontWeight: 600,
    marginBottom: 6,
    fontSize: 15,
  },

  select: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "1.5px solid #1a73e8",
    fontSize: 15,
  },

  tableCard: {
    width: "100%",
    background: "#fff",
    padding: "10px 20px",
    borderRadius: 15,
    boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
  },

  table: { width: "100%", borderCollapse: "collapse" },

  th: {
    background: "#f4f4f6",
    padding: "14px 10px",
    textAlign: "left",
    fontWeight: 700,
  },

  td: {
    padding: "12px 10px",
    borderBottom: "1px solid #eee",
  },

  row: { height: 50, transition: "0.25s" },

  rankBadge: {
    background: "#d7ecff",
    padding: "6px 12px",
    borderRadius: 8,
    color: "#005bb7",
    fontWeight: 600,
  },

  actionCol: { display: "flex", gap: 10 },

  editBtn: {
    background: "#28a745",
    marginTop:"7px",
    padding: "7px 12px",
    borderRadius: 6,
    color: "#fff",
    border: 0,
  },

  deleteBtn: {
    background: "#d32f2f",
     marginTop:"7px",
    padding: "7px 12px",
    borderRadius: 6,
    color: "#fff",
    border: 0,
  },

  statusActive: {
    background: "#e6ffe6",
    padding: "5px 12px",
    borderRadius: 20,
    color: "#2e7d32",
    fontWeight: 600,
  },

  statusInactive: {
    background: "#ffe6e6",
    padding: "5px 12px",
    borderRadius: 20,
    color: "#d32f2f",
    fontWeight: 600,
  },

  statusOther: {
    background: "#fff8e1",
    padding: "5px 12px",
    borderRadius: 20,
    color: "#ff9800",
    fontWeight: 600,
  },

  noData: {
    textAlign: "center",
    padding: 40,
    fontSize: 18,
    color: "#888",
  },
};
