import React, { useEffect, useState } from "react";
import { getAllVip, deleteVip } from "../api/vipform";
import { useVipStore } from "../context/VipContext";
import { toast } from "react-toastify";

export default function VipDetails() {
  const { handleEdit, refreshTrigger } = useVipStore();
  const [vipList, setVipList] = useState([]);

  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  /* FETCH VIP LIST */
  useEffect(() => {
    async function fetchVips() {
      try {
        const data = await getAllVip();
        if (Array.isArray(data)) setVipList(data);
        else if (Array.isArray(data?.data)) setVipList(data.data);
      } catch (err) {
        toast.error("Failed to load VIPs!");
      }
    }
    fetchVips();
  }, [refreshTrigger]);

  /* DELETE VIP */
  const handleDelete = async (id) => {
    try {
      await deleteVip(id);
      const updated = await getAllVip();
      setVipList(Array.isArray(updated) ? updated : []);
      toast.success("VIP Deleted Successfully!");
    } catch (err) {
      toast.error("Failed to delete VIP!");
    }
  };

  /* UNIQUE DESIGNATIONS */
  const designations = [...new Set(vipList.map((v) => v.designation))];

  /* FILTERING LOGIC */
  const filteredVips = vipList.filter((v) => {
    const desMatch = selectedDesignation ? v.designation === selectedDesignation : true;
    const statusMatch = selectedStatus ? v.status === selectedStatus : true;
    return desMatch && statusMatch;
  });

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.headerRow}>
        <h2 style={styles.title}>VIP Records</h2>

        <div style={styles.totalBox}>
          <span style={styles.totalNumber}>{vipList.length}</span>
          <span style={styles.totalLabel}>Total VIPs</span>
        </div>
      </div>

      {/* FILTER ROW (TWO BOXES SIDE BY SIDE) */}
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
        {filteredVips.length === 0 ? (
          <div style={styles.noData}>No VIP Records Found</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Password</th>
                <th style={styles.th}>Designation</th>
                <th style={styles.th}>Contact</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredVips.map((vip, index) => {
                const statusStyle =
                  vip.status === "Active"
                    ? styles.statusActive
                    : vip.status === "Inactive"
                    ? styles.statusInactive
                    : styles.statusOther;

                return (
                  <tr
                    key={vip.id}
                    style={styles.row}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(25,103,210,0.06)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>{vip.name}</td>
                    <td style={styles.td}>{vip.email}</td>
                    <td style={styles.td}>{vip.username}</td>
                    <td style={styles.td}>{vip.password}</td>

                    <td style={styles.td}>
                      <span style={styles.badge}>{vip.designation}</span>
                    </td>

                    <td style={styles.td}>{vip.contactno}</td>

                    <td style={styles.td}>
                      <span style={statusStyle}>{vip.status}</span>
                    </td>

                    <td style={styles.actionCol}>
                      <button style={styles.editBtn} onClick={() => handleEdit(vip)}>
                        <i className="fa fa-edit"></i>
                      </button>
                      {/* <button style={styles.deleteBtn} onClick={() => handleDelete(vip.id)}>
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
  /* FULL WIDTH, NO LEFT/RIGHT SPACING */
  page: {
    width: "100%",
    padding: "0px",
    margin: 0,
    background: "#fff",
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

  /* FILTERS SIDE BY SIDE */
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
    borderRadius: 12,
    boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
  },

  table: { width: "100%", borderCollapse: "collapse" },

  th: {
    background: "#f4f4f6",
    padding: "14px 10px",
    textAlign: "left",
    fontWeight: 700,
  },

  td: { padding: "12px 10px", borderBottom: "1px solid #eee" },

  row: { height: 50, transition: "0.25s" },

  badge: {
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
    color: "#777",
  }
};
