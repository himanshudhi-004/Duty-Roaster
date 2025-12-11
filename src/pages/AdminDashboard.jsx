import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllVip, getAllGuard } from "../api/vipform";
import { useAdminStore } from "../context/AdminContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as ChartJS from "chart.js/auto"; // Option B — module version only

// Remove global Chart.js to prevent conflicts
if (window.Chart) {
  delete window.Chart;
}

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function AdminDashboard() {
  const navigate = useNavigate();

  const { selectedAdmin, setSelectedAdmin, setGuardRanks } = useAdminStore();

  const [adminName, setAdminName] = useState("Admin");
  const [vipList, setVipList] = useState([]);
  const [guardList, setGuardList] = useState([]);
  const [loading, setLoading] = useState(true);

  /* -----------------------------------
          ADMIN DETAILS LOAD
  ------------------------------------ */
  useEffect(() => {
    if (selectedAdmin?.adminName) {
      setAdminName(selectedAdmin.adminName);
    }
  }, [selectedAdmin]);

  useEffect(() => {
    const syncAdmin = async () => {
      try {
        if (selectedAdmin?.adminName) return;

        const stored = localStorage.getItem("selectedAdmin");
        if (stored) {
          const parsed = JSON.parse(stored);
          setSelectedAdmin(parsed);
          setAdminName(parsed.adminName);
          return;
        }

        const token = localStorage.getItem("adminToken");
        if (!token) return;

        const decoded = jwtDecode(token);
        const userName = decoded.sub;

        const res = await axios.get(`${BASE_URL}/auth/profile`, {
          params: { userName },
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("asdf",res)

        const profile = Array.isArray(res.data) ? res.data[0] : res.data;

        setSelectedAdmin(profile);
        setAdminName(profile.adminName);

        localStorage.setItem("selectedAdmin", JSON.stringify(profile));
      } catch (err) {
        console.log("Admin Load Error:", err);
      }
    };

    syncAdmin();
  }, []);

  /* -----------------------------------
        VIP & GUARD LOAD
  ------------------------------------ */
  const loadVip = async () => {
    const data = await getAllVip();
    setVipList(Array.isArray(data) ? data : data?.data || []);
  };

  const loadGuards = async () => {
    try {
      let all = [];
      let page = 0;
      let totalPages = 1;

      while (page < totalPages) {
        const res = await getAllGuard(page, 100);
        all = [...all, ...(res.content || [])];
        totalPages = res.totalPages;
        page++;
      }

      setGuardList(all);

      const ranks = [
        ...new Set(
          all.map((g) => g.rank || g.designation || g.grade).filter(Boolean)
        ),
      ];

      setGuardRanks(ranks);
    } catch (err) {
      console.log("Guard Load Error:", err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await loadVip();
      await loadGuards();
      setLoading(false);
    };

    loadAll();
  }, []);

  /* -----------------------------------
                LOGOUT
  ------------------------------------ */
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const vipCount = vipList.length;
  const guardCount = guardList.length;
  const totalUsers = vipCount + guardCount;

  /* -----------------------------------
          CHART.JS — FULL FIXED
  ------------------------------------ */
  useEffect(() => {
    if (loading) return;

    // const vipTrend = [10, 25, 40, 60, 75, vipCount];
    // const guardTrend = [15, 35, 55, 80, 100, guardCount];

    if (window._lineChart) window._lineChart.destroy();
    if (window._pieChart) window._pieChart.destroy();

//    const growthCanvas = document.getElementById("growthChart");
    const pieCanvas = document.getElementById("pieChart");

    // // LINE CHART
    // if (growthCanvas) {
    //   window._lineChart = new ChartJS.Chart(growthCanvas, {
    //     type: "line",
    //     data: {
    //       labels: [
    //         "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    //         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    //       ],
    //       datasets: [
    //         {
    //           label: "VIPs",
    //           data: vipTrend,
    //           borderColor: "#1e40af",
    //           backgroundColor: "rgba(30, 64, 175, 0.10)",
    //           fill: true,
    //           tension: 0.4,
    //         },
    //         {
    //           label: "Officers",
    //           data: guardTrend,
    //           borderColor: "#16a34a",
    //           backgroundColor: "rgba(22, 163, 74, 0.10)",
    //           fill: true,
    //           tension: 0.4,
    //         },
    //       ],
    //     },
    //     options: { responsive: true },
    //   });
    // }

    // PIE CHART
    if (pieCanvas) {
      window._pieChart = new ChartJS.Chart(pieCanvas, {
        type: "doughnut",
        data: {
          labels: ["VIPs", "Officers"],
          datasets: [
            {
              data: [vipCount, guardCount],
              backgroundColor: ["#1e40af", "#16a34a"],
              borderWidth: 2,
              borderColor: "#fff",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "bottom" },
          },
        },
      });
    }
  }, [loading, vipCount, guardCount]);

  /* -----------------------------------
            UI TEMPLATE
  ------------------------------------ */
  return (
    <div>
      {/* HEADER */}
      <header className="bg-white shadow-sm border-bottom">
        <div className="container-fluid px-4 py-3 d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h3 mb-0 fw-bold text-primary">Admin Dashboard</h1>
            <p className="text-muted small mb-0">
              Manage VIPs, Officers & System Overview
            </p>
          </div>

          <button
            className="btn btn-danger d-flex align-items-center gap-2"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </header>

      {/* BODY */}
      <div className="container-fluid px-4 py-5">
        {/* WELCOME */}
        <div className="bg-white rounded-3 shadow-sm p-4 p-md-5 mb-5">
          <h2 className="display-6 fw-bold text-dark">
            Welcome back, {adminName} 👋
          </h2>
          <p className="text-muted">Here is today's overview.</p>

          <div className="mt-4 d-flex gap-3 flex-wrap">
            <Link to="/vipform" className="btn btn-primary btn-lg px-4">
              <i className="fas fa-user-plus me-2"></i>Add VIP
            </Link>

            <Link to="/guardform" className="btn btn-success btn-lg px-4">
              <i className="fas fa-shield-alt me-2"></i>Add Officer
            </Link>
          </div>
        </div>

        {/* LOADING SPINNER */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
            <p className="text-muted mt-3">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* STATS CARDS */}
            <div className="row g-4 mb-5">
              <StatCard
                label="Total VIPs"
                value={vipCount}
                color="bg-primary"
                icon="fa-user"
              />

              <StatCard
                label="Total Officers"
                value={guardCount}
                color="bg-success"
                icon="fa-user-shield"
              />

              <StatCard
                label="Total Users"
                value={totalUsers}
                color="bg-warning"
                icon="fa-users"
              />
            </div>

           
            <div className="row justify-content-center g-4 mb-3 d-flex">
              {/* PIE CHART */}
              <div className="col-12 col-md-6 col-lg-5 flex-fill">
                <div className="card shadow-sm w-90">
                  <div className="card-body">
                    <h5 className="fw-semibold mb-2 text-center">
                      User Role Distribution
                    </h5>
                    <div style={{ height: "300px", paddingLeft: "120px" }}>
                      <canvas id="pieChart"></canvas>
                    </div>
                  </div>
                </div>
              </div>
             
              <div className="col-12 col-md-6 col-lg-5 flex-fill">
                <div className="card shadow-sm w-90">
                  <div className="card-body">
                    <div style={{ height: "300px" }}>
                      <div style={styles.activityBox}>
                        <h3 style={styles.activityTitle}>Recent Activity</h3>
                        <ul style={styles.activityList}>
                          <li>✔ VIP & Guards list updated</li>
                          <li>✔ Dashboard loaded successfully</li>
                          <li>✔ System running smoothly</li>
                        </ul>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* -----------------------------------
        STAT CARD COMPONENT
------------------------------------ */
function StatCard({ label, value, color, icon }) {
  return (
    <div className="col-md-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body d-flex align-items-center">
          <div className={`stat-icon ${color} me-4`}>
            <i
              className={`fas ${icon}`}
              style={{ color: "#fff", fontSize: 22 }}
            ></i>
          </div>

          <div>
            <h6 className="text-muted">{label}</h6>
            <h3 className="fw-bold">{value}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= YOUR STYLES UNCHANGED ================= */
const styles = {
  activityBox: {
    marginTop: "2%",
    padding: 20,
    borderRadius: 12,
    background: "#f8fbff",
    border: "1px solid #e5e9f0",
  },
  activityTitle: {
    fontSize: 20,
    color: "#1e73be",
    marginBottom: 10,
  },
  activityList: { lineHeight: 2, paddingLeft: 10 },
};
