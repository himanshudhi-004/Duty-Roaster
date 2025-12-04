import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

import { toast } from "react-toastify";
import { getAllGuard } from "../api/vipform";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function ManagerSettings() {
  const [selectedManager, setSelectedManager] = useState(null);
  const [managerName, setManagerName] = useState("");

  const [guardList, setGuardList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ RESPONSIVE BREAKPOINT
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // ✅ AUTO SECURITY GROUP NAME
  const [groupName] = useState(
    `SEC-GRP-${Math.floor(1000 + Math.random() * 9000)}`
  );

  /* ================= RESPONSIVE LISTENER ================= */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ================= TOKEN BASED MANAGER SYNC ================= */
  useEffect(() => {
    const syncManagerProfile = async () => {
      try {
        if (selectedManager?.name) return;

        const stored = localStorage.getItem("selectedManager");
        if (stored) {
          const parsed = JSON.parse(stored);
          setSelectedManager(parsed);
          setManagerName(parsed.name);
          return;
        }

        const token = localStorage.getItem("userToken");
        if (!token) return;

        const decoded = jwtDecode(token);
        

        const res = await axios.get(`${BASE_URL}/user/profile`, {
          params: { username },
          headers: { Authorization: `Bearer ${token}` },
        });

        const profile = Array.isArray(res.data)
          ? res.data[0]
          : res.data;

        setSelectedManager(profile);
        setManagerName(profile.name);

        localStorage.setItem(
          "selectedManager",
          JSON.stringify(profile)
        );
      } catch (err) {
        console.log("Manager Sync Error:", err);
      }
    };

    syncManagerProfile();
  }, [selectedManager]);

  /* ================= FETCH ALL GUARDS ================= */
  useEffect(() => {
    async function fetchGuards() {
      try {
        const data = await getAllGuard();

        let finalData = [];
        if (Array.isArray(data)) finalData = data;
        else if (Array.isArray(data?.data)) finalData = data.data;
        else if (Array.isArray(data?.guards)) finalData = data.guards;
        else if (Array.isArray(data?.officers)) finalData = data.officers;

        setGuardList(finalData);
      } catch (err) {
        toast.error("Failed to load guard ranks!");
      }
    }

    fetchGuards();
  }, []);

  /* ================= ✅ UNIQUE RANKS ================= */
  const availableRanks = useMemo(() => {
    return [...new Set(guardList.map((g) => g.rank).filter(Boolean))];
  }, [guardList]);

  /* ================= ADD RANK ================= */
  const handleAddGrade = () => {
    if (!selectedGrade) {
      toast.error("Please select a rank first");
      return;
    }

    const alreadyExists = gradeList.find(
      (g) => g.rank === selectedGrade
    );

    if (alreadyExists) {
      toast.error(`Rank ${selectedGrade} already added`);
      return;
    }

    setGradeList([
      ...gradeList,
      { rank: selectedGrade, total: "" },
    ]);

    setSelectedGrade("");
  };

  /* ================= INPUT CHANGE ================= */
  const handleChange = (index, value) => {
    const updated = [...gradeList];
    updated[index].total = value;
    setGradeList(updated);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (gradeList.length === 0) {
      toast.error("Please add at least one rank");
      return;
    }

    for (let item of gradeList) {
      if (!item.total) {
        toast.error(`Enter guard count for Rank ${item.rank}`);
        return;
      }
    }

    const payload = {
      manager: managerName,
      securityGroup: groupName,
      grades: gradeList.map((g) => ({
        rank: g.rank,
        totalGuards: g.total,
      })),
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("managerToken");

      await axios.post(
        `${BASE_URL}/api/manager/settings`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Security Group Saved Successfully ✅");
      setGradeList([]);
    } catch (err) {
      console.error("Save Error:", err);
      toast.error("Failed to save settings ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* ---------- HEADER ---------- */}
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>Manager Settings</h2>
        <p style={styles.headerSubtitle}>
          Logged in as: <b>{managerName || "Manager"}</b>
        </p>
      </div>

      {/* ---------- CARD ---------- */}
      <div style={styles.card}>
        <div
          style={{
            ...styles.profileRow,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          {/* -------- LEFT -------- */}
          <div style={{ ...styles.leftBox, width: isMobile ? "100%" : "32%" }}>
            <h4 style={styles.pointsTitle}>Security Group Rules</h4>
            <ul style={styles.pointList}>
              <li>Ranks fetched from live Guard data</li>
              <li>No duplicate ranks allowed</li>
              <li>All selected ranks saved under one group</li>
            </ul>

            <div style={styles.noteBox}>
              🔒 Group Code: <b>{groupName}</b>
            </div>
          </div>

          {/* -------- RIGHT -------- */}
          <div style={{ ...styles.rightBox, width: isMobile ? "100%" : "68%" }}>
            {/* ADD BAR */}
            <div
              style={{
                ...styles.addBar,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                style={{
                  ...styles.select,
                  width: isMobile ? "100%" : "70%",
                }}
              >
                <option value="">-- Select Rank --</option>
                {availableRanks.map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAddGrade}
                style={{
                  ...styles.addBtn,
                  width: isMobile ? "100%" : "30%",
                }}
              >
                ➕ Add
              </button>
            </div>

            {/* ✅ GROUP BOX */}
            {gradeList.length > 0 && (
              <div style={styles.groupBox}>
                <div style={styles.groupTitle}>
                  🔐 Security Group: {groupName}
                </div>

                {gradeList.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.gradeRow,
                      flexDirection: isMobile ? "column" : "row",
                    }}
                  >
                    <div style={styles.gradeBadge}>{item.rank}</div>

                    <input
                      type="number"
                      placeholder="Guard Count"
                      value={item.total}
                      onChange={(e) =>
                        handleChange(index, e.target.value)
                      }
                      style={{
                        ...styles.input,
                        width: isMobile ? "100%" : "auto",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* SUBMIT */}
            {gradeList.length > 0 && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  ...styles.submitBtn,
                  opacity: loading ? 0.6 : 1,
                  width: "100%",
                }}
              >
                {loading ? "Saving..." : "Submit Security Group"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= RESPONSIVE STYLES ================= */
const styles = {
  pageContainer: {
    padding: 20,
    minHeight: "100vh",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(6px)",
  },

  header: {
    marginBottom: 20,
    padding: 16,
    background: "linear-gradient(135deg, #56ccf2, #2f80ed)",
    borderRadius: 14,
    color: "white",
  },

  headerTitle: { margin: 0, fontSize: 24, fontWeight: 700 },
  headerSubtitle: { marginTop: 4, opacity: 0.9 },

  card: {
    background: "rgba(255,255,255,0.55)",
    borderRadius: 18,
    padding: 20,
    backdropFilter: "blur(8px)",
  },

  profileRow: { display: "flex", gap: 20 },

  leftBox: {
    padding: 16,
    borderRadius: 12,
    background: "rgba(255,255,255,0.7)",
  },

  pointsTitle: { fontSize: 18, fontWeight: 700 },
  pointList: { paddingLeft: 18 },

  noteBox: {
    marginTop: 10,
    padding: 10,
    background: "#fff3cd",
    borderRadius: 8,
    fontWeight: 600,
  },

  rightBox: {},

  addBar: { display: "flex", gap: 10, marginBottom: 15 },

  select: {
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ccc",
  },

  addBtn: {
    background: "#00c853",
    color: "white",
    padding: 10,
    borderRadius: 10,
    border: "none",
    fontWeight: 600,
  },

  groupBox: {
    background: "rgba(255,255,255,0.8)",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },

  groupTitle: { fontWeight: 700, color: "#2f80ed", marginBottom: 10 },

  gradeRow: { display: "flex", gap: 10, marginBottom: 10 },

  gradeBadge: {
    background: "#2f80ed",
    color: "white",
    padding: 8,
    borderRadius: 8,
    minWidth: 80,
    textAlign: "center",
  },

  input: {
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ccc",
  },

  submitBtn: {
    background: "#ff5e62",
    color: "white",
    padding: 12,
    borderRadius: 12,
    border: "none",
    fontWeight: 700,
  },
};
