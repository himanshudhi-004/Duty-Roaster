//------------------------------3---------------------------------------------------------
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllVip, getAllGuard } from "../api/vipform";
import { useUserStore } from "../context/UserContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function UserDashboard() {
  const navigate = useNavigate();
  const { selectedUser, setSelectedUser } = useUserStore();

  const [UserName, setUserName] = useState("User");
  const [vipList, setVipList] = useState([]);
  const [guardList, setGuardList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedUser?.name) {
      setUserName(selectedUser.name);
    }
  }, [selectedUser]);

  useEffect(() => {
    const syncUserProfile = async () => {
      try {
        if (selectedUser?.name) return;

        const stored = localStorage.getItem("selectedUser");
        if (stored) {
          const parsed = JSON.parse(stored);
          setSelectedUser(parsed);
          setUserName(parsed.name);
          return;
        }

        const token = localStorage.getItem("userToken");
        if (!token) return;

        const decoded = jwtDecode(token);
        const username = decoded.username || decoded.sub || decoded.email;

        const res = await axios.get(`${BASE_URL}/usr/profile`, {
          params: { username },
          headers: { Authorization: `Bearer ${token}` },
        });

        const profile = Array.isArray(res.data) ? res.data[0] : res.data;

        setSelectedUser(profile);
        setUserName(profile.name);
        localStorage.setItem("selectedUser", JSON.stringify(profile));
      } catch (err) {
        console.log("User Sync Error:", err);
      }
    };

    syncUserProfile();
  }, []);

  const loadVip = async () => {
    const data = await getAllVip();
    setVipList(Array.isArray(data) ? data : data?.data || []);
  };

  const loadGuards = async () => {
    try {
      let allGuards = [];
      let page = 0;
      let totalPages = 1;

      while (page < totalPages) {
        const res = await getAllGuard(page, 100);
        allGuards = [...allGuards, ...(res.content || [])];
        totalPages = res.totalPages;
        page++;
      }

      setGuardList(allGuards);
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

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const totalUsers = vipList.length + guardList.length;

  const stats = [
    { title: "Total VIPs", value: vipList.length, icon: "fas fa-user", color: "#1e73be" },
    { title: "Total Officers", value: guardList.length, icon: "fas fa-user-shield", color: "#3cb371" },
    { title: "Total Users", value: totalUsers, icon: "fas fa-users", color: "#ffa500" },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.headerSection}>
        <div>
          <h2 style={styles.pageTitle}>Manager Dashboard</h2>
          <p style={styles.desc}>Manage VIPs, Guards & Combined User Count.</p>
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          <i className="fas fa-sign-out-alt" style={{ marginRight: 8 }}></i>
          Logout
        </button>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.welcomeBox}>
          <h2 style={styles.welcomeText}>Welcome {UserName} 👋</h2>
        </div>

        {loading ? (
          <h3 style={{ textAlign: "center", marginTop: 40 }}>
            Loading Dashboard...
          </h3>
        ) : (
          <>
            <div style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <div
                  key={index}
                  style={styles.statCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 5px 20px rgba(0,0,0,0.08)";
                  }}
                >
                  <div
                    style={{
                      ...styles.iconCircle,
                      background: stat.color,
                    }}
                  >
                    <i className={stat.icon} style={styles.icon}></i>
                  </div>
                  <h3 style={styles.statValue}>{stat.value}</h3>
                  <p style={styles.statTitle}>{stat.title}</p>
                </div>
              ))}
            </div>

            <div style={styles.activityBox}>
              <h3 style={styles.activityTitle}>Recent Activity</h3>
              <ul style={styles.activityList}>
                <li>✔ VIP & Guards list updated</li>
                <li>✔ Dashboard loaded successfully</li>
                <li>✔ System running smoothly</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: 15 },
  headerSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  pageTitle: { fontSize: 30, fontWeight: 700, color: "#1e73be" },
  desc: { fontSize: 15, opacity: 0.6 },
  logoutBtn: {
    background: "#888",
    padding: "10px 20px",
    borderRadius: 8,
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
  },
  mainContent: {
    background: "#fff",
    padding: 25,
    borderRadius: 12,
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
  },
  welcomeBox: { marginBottom: 25 },
  welcomeText: {
    fontSize: 26,
    fontWeight: 700,
    color: "#1e73be",
    marginBottom: 20,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: 25,
    marginTop: 20,
  },
  statCard: {
    background: "white",
    borderRadius: 12,
    padding: 25,
    textAlign: "center",
    boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease", //  hover animation smooth
    cursor: "pointer",
  },
  iconCircle: {
    width: 55,
    height: 55,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
  },
  icon: { fontSize: 22, color: "white" },
  statValue: { fontSize: 28, fontWeight: 700, color: "#333" },
  statTitle: { opacity: 0.6 },
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
    marginBottom: 5,
  },
  activityList: { lineHeight: 2, paddingLeft: 10 },
};



//---------------------------------------------------1-----------------------------------------


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAllVip, getAllGuard } from "../api/vipform";
// import { useUserStore } from "../context/UserContext";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// export default function UserDashboard() {
//   const navigate = useNavigate();
//   const { selectedUser, setSelectedUser } = useUserStore();

//   const [UserName, setUserName] = useState("User");
//   const [vipList, setVipList] = useState([]);
//   const [guardList, setGuardList] = useState([]);

//   /*  INSTANT SYNC FROM CONTEXT */
//   useEffect(() => {
//     if (selectedUser?.name) {
//       setUserName(selectedUser.name);
//     }
//   }, [selectedUser]);

//   /*  FALLBACK FOR REFRESH / DIRECT URL */
//   useEffect(() => {
//     const syncUserProfile = async () => {
//       try {
//         if (selectedUser?.name) return;

//         const stored = localStorage.getItem("selectedUser");
//         if (stored) {
//           const parsed = JSON.parse(stored);
//           setSelectedUser(parsed);
//           setUserName(parsed.name);
//           return;
//         }

//         const token = localStorage.getItem("userToken");
//         if (!token) return;

//         const decoded = jwtDecode(token);
//         const username = decoded.username || decoded.sub || decoded.email;

//         const res = await axios.get(`${BASE_URL}/usr/profile`, {
//           params: { username },
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const profile = Array.isArray(res.data) ? res.data[0] : res.data;

//         setSelectedUser(profile);
//         setUserName(profile.name);
//         localStorage.setItem("selectedUser", JSON.stringify(profile));
//       } catch (err) {
//         console.log("User Sync Error:", err);
//       }
//     };

//     syncUserProfile();
//   }, []);

//   const loadVip = async () => {
//     const data = await getAllVip();
//     setVipList(Array.isArray(data) ? data : data?.data || []);
//   };

//   const loadGuards = async () => {
//     const data = await getAllGuard();
//     setGuardList(Array.isArray(data) ? data : data?.data || []);
//   };

//   useEffect(() => {
//     loadVip();
//     loadGuards();
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     sessionStorage.clear();
//     navigate("/login");
//   };

//   const totalUsers = vipList.length + guardList.length;

//   const stats = [
//     { title: "Total VIPs", value: vipList.length, icon: "fas fa-user", color: "#1e73be" },
//     { title: "Total Officers", value: guardList.length, icon: "fas fa-user-shield", color: "#3cb371" },
//     { title: "Total Users", value: totalUsers, icon: "fas fa-users", color: "#ffa500" },
//   ];

//   return (
//     <div style={styles.page}>
//       <div style={styles.headerSection}>
//         <div>
//           <h2 style={styles.pageTitle}>Manager Dashboard</h2>
//           <p style={styles.desc}>Manage VIPs, Guards & Combined User Count.</p>
//         </div>

//         <button style={styles.logoutBtn} onClick={handleLogout}>
//           <i className="fas fa-sign-out-alt" style={{ marginRight: 8 }}></i> Logout
//         </button>
//       </div>

//       <div style={styles.mainContent}>
//         <div style={styles.welcomeBox}>
//           <h2 style={styles.welcomeText}>Welcome {UserName} 👋</h2>
//         </div>

//         <div style={styles.statsGrid}>
//           {stats.map((stat, index) => (
//             <div key={index} style={styles.statCard}>
//               <div style={{ ...styles.iconCircle, background: stat.color }}>
//                 <i className={stat.icon} style={styles.icon}></i>
//               </div>
//               <h3 style={styles.statValue}>{stat.value}</h3>
//               <p style={styles.statTitle}>{stat.title}</p>
//             </div>
//           ))}
//         </div>

//         <div style={styles.activityBox}>
//           <h3 style={styles.activityTitle}>Recent Activity</h3>
//           <ul style={styles.activityList}>
//             <li>✔ VIP & Guards list updated</li>
//             <li>✔ Dashboard loaded successfully</li>
//             <li>✔ System running smoothly</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ------------------ STYLES (UNCHANGED) ------------------ */
// const styles = {
//   page: { padding: 25 },
//   headerSection: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   pageTitle: { fontSize: 30, fontWeight: 700, color: "#1e73be" },
//   desc: { fontSize: 15, opacity: 0.6 },
//   logoutBtn: {
//     background: "#888",
//     padding: "10px 20px",
//     borderRadius: 8,
//     color: "#fff",
//     border: "none",
//     cursor: "pointer",
//     fontWeight: 600,
//     display: "flex",
//     alignItems: "center",
//   },
//   mainContent: {
//     background: "#fff",
//     padding: 25,
//     borderRadius: 12,
//     boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
//   },
//   welcomeBox: { marginBottom: 25 },
//   welcomeText: { fontSize: 26, fontWeight: 700, color: "#1e73be", marginBottom: 20 },
//   statsGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
//     gap: 25,
//     marginTop: 20,
//   },
//   statCard: {
//     background: "white",
//     borderRadius: 12,
//     padding: 25,
//     textAlign: "center",
//     boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
//   },
//   iconCircle: {
//     width: 55,
//     height: 55,
//     borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     margin: "0 auto 15px",
//   },
//   icon: { fontSize: 22, color: "white" },
//   statValue: { fontSize: 28, fontWeight: 700, color: "#333" },
//   statTitle: { opacity: 0.6 },
//   activityBox: {
//     marginTop: "17%",
//     padding: 20,
//     borderRadius: 12,
//     background: "#f8fbff",
//     border: "1px solid #e5e9f0",
//   },
//   activityTitle: { fontSize: 20, color: "#1e73be", marginBottom: 10 },
//   activityList: { lineHeight: 2, paddingLeft: 10 },
// };



//---------------------------------------2--------------------------

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAllVip, getAllGuard } from "../api/vipform";
// import { useUserStore } from "../context/UserContext";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// export default function UserDashboard() {
//   const navigate = useNavigate();
//   const { selectedUser, setSelectedUser } = useUserStore();

//   const [UserName, setUserName] = useState("User");
//   const [vipList, setVipList] = useState([]);
//   const [guardList, setGuardList] = useState([]);
//   const [loading, setLoading] = useState(true);

//   /*  INSTANT SYNC FROM CONTEXT */
//   useEffect(() => {
//     if (selectedUser?.name) {
//       setUserName(selectedUser.name);
//     }
//   }, [selectedUser]);

//   /*  FALLBACK SYNC */
//   useEffect(() => {
//     const syncUserProfile = async () => {
//       try {
//         if (selectedUser?.name) return;

//         const stored = localStorage.getItem("selectedUser");
//         if (stored) {
//           const parsed = JSON.parse(stored);
//           setSelectedUser(parsed);
//           setUserName(parsed.name);
//           return;
//         }

//         const token = localStorage.getItem("userToken");
//         if (!token) return;

//         const decoded = jwtDecode(token);
//         const username = decoded.username || decoded.sub || decoded.email;

//         const res = await axios.get(`${BASE_URL}/usr/profile`, {
//           params: { username },
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const profile = Array.isArray(res.data) ? res.data[0] : res.data;

//         setSelectedUser(profile);
//         setUserName(profile.name);
//         localStorage.setItem("selectedUser", JSON.stringify(profile));
//       } catch (err) {
//         console.log("User Sync Error:", err);
//       }
//     };

//     syncUserProfile();
//   }, []);

//   /*  LOAD ALL VIPs */
//   const loadVip = async () => {
//     const data = await getAllVip();
//     setVipList(Array.isArray(data) ? data : data?.data || []);
//   };

//   /*  LOAD ALL GUARDS WITH PAGINATION (FIXED)  */
//   const loadGuards = async () => {
//     try {
//       let allGuards = [];
//       let page = 0;
//       let totalPages = 1;

//       while (page < totalPages) {
//         const res = await getAllGuard(page, 100); // large size for speed
//         allGuards = [...allGuards, ...(res.content || [])];
//         totalPages = res.totalPages;
//         page++;
//       }

//       setGuardList(allGuards);
//     } catch (err) {
//       console.log("Guard Load Error:", err);
//     }
//   };

//   useEffect(() => {
//     const loadAll = async () => {
//       setLoading(true);
//       await loadVip();
//       await loadGuards();
//       setLoading(false);
//     };

//     loadAll();
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     sessionStorage.clear();
//     navigate("/login");
//   };

//   const totalUsers = vipList.length + guardList.length;

//   const stats = [
//     {
//       title: "Total VIPs",
//       value: vipList.length,
//       icon: "fas fa-user",
//       color: "#1e73be",
//     },
//     {
//       title: "Total Officers",
//       value: guardList.length, //  NOW PERFECT
//       icon: "fas fa-user-shield",
//       color: "#3cb371",
//     },
//     {
//       title: "Total Users",
//       value: totalUsers,
//       icon: "fas fa-users",
//       color: "#ffa500",
//     },
//   ];

//   return (
//     <div style={styles.page}>
//       <div style={styles.headerSection}>
//         <div>
//           <h2 style={styles.pageTitle}>Manager Dashboard</h2>
//           <p style={styles.desc}>
//             Manage VIPs, Guards & Combined User Count.
//           </p>
//         </div>

//         <button style={styles.logoutBtn} onClick={handleLogout}>
//           <i
//             className="fas fa-sign-out-alt"
//             style={{ marginRight: 8 }}
//           ></i>
//           Logout
//         </button>
//       </div>

//       <div style={styles.mainContent}>
//         <div style={styles.welcomeBox}>
//           <h2 style={styles.welcomeText}>Welcome {UserName} 👋</h2>
//         </div>

//         {loading ? (
//           <h3 style={{ textAlign: "center", marginTop: 40 }}>
//             Loading Dashboard...
//           </h3>
//         ) : (
//           <>
//             <div style={styles.statsGrid}>
//               {stats.map((stat, index) => (
//                 <div key={index} style={styles.statCard}>
//                   <div
//                     style={{
//                       ...styles.iconCircle,
//                       background: stat.color,
//                     }}
//                   >
//                     <i className={stat.icon} style={styles.icon}></i>
//                   </div>
//                   <h3 style={styles.statValue}>{stat.value}</h3>
//                   <p style={styles.statTitle}>{stat.title}</p>
//                 </div>
//               ))}
//             </div>

//             <div style={styles.activityBox}>
//               <h3 style={styles.activityTitle}>Recent Activity</h3>
//               <ul style={styles.activityList}>
//                 <li>✔ VIP & Guards list updated</li>
//                 <li>✔ Dashboard loaded successfully</li>
//                 <li>✔ System running smoothly</li>
//               </ul>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// /*  STYLES (UNCHANGED) */
// const styles = {
//   page: { padding: 15 },
//   headerSection: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   pageTitle: { fontSize: 30, fontWeight: 700, color: "#1e73be" },
//   desc: { fontSize: 15, opacity: 0.6 },
//   logoutBtn: {
//     background: "#888",
//     padding: "10px 20px",
//     borderRadius: 8,
//     color: "#fff",
//     border: "none",
//     cursor: "pointer",
//     fontWeight: 600,
//     display: "flex",
//     alignItems: "center",
//   },
//   mainContent: {
//     background: "#fff",
//     padding: 25,
//     borderRadius: 12,
//     boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
//   },
//   welcomeBox: { marginBottom: 25 },
//   welcomeText: {
//     fontSize: 26,
//     fontWeight: 700,
//     color: "#1e73be",
//     marginBottom: 20,
//   },
//   statsGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
//     gap: 25,
//     marginTop: 20,
//   },
//   statCard: {
//     background: "white",
//     borderRadius: 12,
//     padding: 25,
//     textAlign: "center",
//     boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
//   },
//   iconCircle: {
//     width: 55,
//     height: 55,
//     borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     margin: "0 auto 15px",
//   },
//   icon: { fontSize: 22, color: "white" },
//   statValue: { fontSize: 28, fontWeight: 700, color: "#333" },
//   statTitle: { opacity: 0.6 },
//   activityBox: {
//     marginTop: "2%",
//     padding: 20,
//     borderRadius: 12,
//     background: "#f8fbff",
//     border: "1px solid #e5e9f0",
//   },
//   activityTitle: {
//     fontSize: 20,
//     color: "#1e73be",
//     marginBottom: 5,
//   },
//   activityList: { lineHeight: 2, paddingLeft: 10 },
// };
