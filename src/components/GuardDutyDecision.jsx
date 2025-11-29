import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGuardStore } from "../context/GuardContext";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function GuardDutyDecision() {
  const navigate = useNavigate();
  const { assignmentId } = useParams();
  const { selectedGuard } = useGuardStore();

  const [guardAssignmentId, setGuardAssignmentId] = useState(null);
  const [loadingRanks, setLoadingRanks] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [decisionData, setDecisionData] = useState({
    status: "",
    reason: "",
  });

  /* ================= FETCH ASSIGNMENT ID ================= */
  useEffect(() => {
    if (!assignmentId) {
      toast.error("Please open Duty page from 'My Shift'");
      navigate("/guardshift");
      return;
    }

    if (!selectedGuard) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    const id = Number(assignmentId);
    setGuardAssignmentId(id);
    setLoadingRanks(false);
  }, [assignmentId, selectedGuard, navigate]);

  /* ================= STATUS HANDLER ================= */
  const handleStatusClick = (status) => {
    setDecisionData((prev) => ({
      ...prev,
      status,
    }));
  };

  /* ================= REASON HANDLER ================= */
  const handleReasonChange = (e) => {
    setDecisionData((prev) => ({
      ...prev,
      reason: e.target.value,
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!decisionData.status) {
      toast.error("Please select Accept or Reject");
      return;
    }

    if (
      decisionData.status === "REJECTED" &&
      !decisionData.reason.trim()
    ) {
      toast.error("Reason is required for rejection");
      return;
    }

    //  STATUS → MESSAGE
    const statusMessageMap = {
      ACCEPTED: "Guard accepted the assigned duty",
      REJECTED: "Guard rejected the assigned duty and requested leave",
    };

    //  EXACT PAYLOAD WITH REASON + FULL OFFICER
    const dutyPayload = {
      officer: selectedGuard, //  FULL OBJECT
      status: decisionData.status,
      reason: decisionData.reason, //  FROM INPUT
      message: statusMessageMap[decisionData.status],
    };

    try {
      setSubmitting(true);

      //  TOKEN ADDED HERE
      const token = localStorage.getItem("guardToken");

      await axios.post(
        `${BASE_URL}/api/duty/decision`,
        dutyPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`, //  TOKEN
          },
        }
      );

      if (decisionData.status === "REJECTED") {
        toast.warning("Duty Rejected Successfully");
      } else {
        toast.success("Duty Accepted Successfully");
      }

      setDecisionData({ status: "", reason: "" });
      navigate("/guardshift");
    } catch (err) {
      console.error("Duty Submit Error:", err);
      toast.error("Failed to submit duty decision");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* LEFT SIDE */}
        <div style={styles.leftBox}>
          <h2 style={styles.leftTitle}>DUTY INFORMATION</h2>
          <p style={styles.desc}>Accept or Reject your assigned duty.</p>

          <p>
            <b>Assignment ID:</b> {guardAssignmentId}
          </p>

          {loadingRanks ? (
            <p>Loading...</p>
          ) : (
            <p>
              <b>Guard Name:</b> {selectedGuard?.name}
            </p>
          )}

          <button
            style={styles.haveBtn}
            onClick={() => navigate("/guardshift")}
          >
             Back to Shift
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div style={styles.formBox}>
          <h2 style={styles.formTitle}>Duty Acceptance</h2>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleStatusClick("ACCEPTED")}
                style={{
                  ...styles.actionBtn,
                  background:
                    decisionData.status === "ACCEPTED"
                      ? "#28a745"
                      : "#e0e0e0",
                  color:
                    decisionData.status === "ACCEPTED"
                      ? "white"
                      : "black",
                }}
              >
                 Accept Duty
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={() => handleStatusClick("REJECTED")}
                style={{
                  ...styles.actionBtn,
                  background:
                    decisionData.status === "REJECTED"
                      ? "#dc3545"
                      : "#e0e0e0",
                  color:
                    decisionData.status === "REJECTED"
                      ? "white"
                      : "black",
                }}
              >
                 Reject Duty
              </button>
            </div>

            {/*  REASON BOX ADDED */}
            {decisionData.status === "REJECTED" && (
              <div style={{ marginBottom: 20 }}>
                <label><b>Reason for Rejection</b></label>
                <textarea
                  value={decisionData.reason}
                  onChange={handleReasonChange}
                  rows="4"
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    marginTop: "6px",
                  }}
                  placeholder="Enter reason for rejecting duty..."
                />
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.submitBtn,
                marginTop: 10,
                background:
                  decisionData.status === "REJECTED"
                    ? "#dc3545"
                    : "#1e73be",
              }}
            >
              {submitting ? "Submitting..." : "Submit Duty Decision"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    minHeight: "90vh",
    background: "#f4f6fa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    minHeight: "80vh",
    display: "flex",
    flexWrap: "wrap",
    background: "white",
  },
  leftBox: {
    width: "40%",
    minWidth: "300px",
    padding: "40px",
  },
  leftTitle: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "20px",
  },
  desc: {
    fontSize: "15px",
    marginBottom: "10px",
  },
  haveBtn: {
    background: "gray",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "30px",
  },
  formBox: {
    width: "60%",
    minWidth: "300px",
    padding: "40px",
  },
  formTitle: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#1e73be",
    marginBottom: "20px",
  },
  submitBtn: {
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "5px",
    width: "100%",
    cursor: "pointer",
  },
  actionBtn: {
    flex: 1,
    border: "none",
    padding: "12px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "600",
  },
};
