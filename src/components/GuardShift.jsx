import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function GuardShift() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vip, setVip] = useState(null);

  useEffect(() => {
    async function fetchVip() {
      try {
        const res = await axios.get(
          `${REACT_APP_BASE_URL}/api/assignments/getvip/${id}`
        );

        console.log("API Response:", res.data);

        // supports different possible API response structures
        const extracted =
          res.data?.data || res.data?.vip || res.data || null;

        setVip(extracted);
      } catch (error) {
        console.error("VIP Fetch Error:", error);
      }
    }

    fetchVip();
  }, [id]);

  if (!vip) {
    return (
      <div style={{ padding: 30 }}>
        <h2>No VIP Data Found</h2>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            background: "#1967d2",
            color: "#fff",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Guard Shift Details</h2>

      <div style={styles.card}>
        <h3 style={styles.vipTitle}>{vip.name}</h3>
        <p>Email: {vip.email}</p>
        <p>Designation: {vip.designation}</p>
        <p>Status: {vip.status}</p>
      </div>

      <h3 style={{ marginTop: 25 }}>Assigned Guards</h3>

      {vip.assignedGuards && vip.assignedGuards.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Contact No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Designation</th>
              <th>Status</th>
              <th>Shift Start</th>
              <th>Shift End</th>
            </tr>
          </thead>
          <tbody>
            {vip.assignedGuards.map((g, index) => (
              <tr key={index}>
                <td>{g.id}</td>
                <td>{g.contactNo}</td>
                <td>{g.guardName}</td>
                <td>{g.email}</td>
                <td>{g.username}</td>
                <td>{g.designation}</td>
                <td>{g.status}</td>
                <td>{new Date(g.startTime).toLocaleString()}</td>
                <td>{new Date(g.endTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ color: "#d32f2f" }}>No guard assigned for this VIP</p>
      )}
    </div>
  );
}

const styles = {
  container: { padding: 30 },
  title: { fontSize: 32, fontWeight: 700, marginBottom: 25, color: "#1967d2" },
  card: {
    padding: 18,
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  vipTitle: { fontSize: 22, fontWeight: 700 },
  table: {
    width: "100%",
    marginTop: 15,
    borderCollapse: "collapse",
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  th: {
    padding: 12,
    background: "#1967d2",
    color: "#fff",
  },
  td: {
    padding: 10,
    borderBottom: "1px solid #ddd",
    textAlign: "center",
  },
};
