import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGuardStore } from "../context/GuardContext";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function GuardDutyDecision() {
  const navigate = useNavigate();
  const { selectedGuard } = useGuardStore();

  const [guardId, setGuardId] = useState(null);
  const [guardData, setGuardData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [decisionData, setDecisionData] = useState({
    status: "",
    reason: "",
  });

  const [existingDecision, setExistingDecision] = useState(null);
  const [checkingDecision, setCheckingDecision] = useState(true);

  /* ================= LOAD GUARD FROM CONTEXT OR LOCALSTORAGE ================= */
  useEffect(() => {
    let guard = selectedGuard;

    if (!guard) {
      const storedGuard = localStorage.getItem("selectedGuard");
      if (storedGuard) {
        guard = JSON.parse(storedGuard);
      }
    }

    if (!guard) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    setGuardId(guard.id);
    setGuardData(guard);
  }, [selectedGuard, navigate]);

  /* ================= FETCH EXISTING DECISION ================= */
  useEffect(() => {
    const fetchExistingDecision = async () => {
      try {
        const token = localStorage.getItem("guardToken");
        if (!token) {
          toast.error("Token expired. Please login again.");
          navigate("/login");
          return;
        }

        const res = await axios.get(`${BASE_URL}/api/duty/${guardId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data && res.data.length > 0) {
          setExistingDecision(res.data[0]);
        } else {
          setExistingDecision(null);
        }
      } catch (err) {
        console.error("Fetch Decision Error:", err);
        setExistingDecision(null);
      } finally {
        setCheckingDecision(false);
      }
    };

    if (guardId) fetchExistingDecision();
  }, [guardId, navigate]);

  /* ================= STATUS HANDLER ================= */
  const handleStatusClick = (status) => {
    setDecisionData({
      status,
      reason: "",
    });
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
      decisionData.status === "Guard Rejected" &&
      !decisionData.reason.trim()
    ) {
      toast.error("Reason is required for rejection");
      return;
    }

    const dutyPayload = {
      officer: guardData,
      status: decisionData.status,
      reason: decisionData.reason,
      message: decisionData.reason,
    };

    try {
      setSubmitting(true);

      const token = localStorage.getItem("guardToken");
      if (!token) {
        toast.error("Token expired. Please login again.");
        navigate("/login");
        return;
      }

      await axios.post(`${BASE_URL}/api/duty/decision`, dutyPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Duty decision submitted successfully");
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

          <p><b>Guard ID:</b> {guardId}</p>
          <p><b>Guard Name:</b> {guardData?.name}</p>

          <button
            style={styles.haveBtn}
            onClick={() => navigate("/guardshift")}
          >
            Back to Shift
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div style={styles.formBox}>
          {checkingDecision ? (
            <h3>Checking previous decision...</h3>
          ) : existingDecision ? (
            <>
              <h2 style={styles.formTitle}>Duty Status</h2>

              <p><b>Status:</b> {existingDecision.status}</p>
              <p><b>Message:</b> {existingDecision.message}</p>

              <p><b>Officer:</b> {existingDecision.officer?.name}</p>
              <p><b>Rank:</b> {existingDecision.officer?.rank}</p>

              <button
                style={{ ...styles.submitBtn, marginTop: 30 }}
                onClick={() => navigate("/guardshift")}
              >
                Back to Shift
              </button>
            </>
          ) : (
            <>
              <h2 style={styles.formTitle}>Duty Acceptance</h2>

              <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleStatusClick("Guard Accepted")}
                    style={{
                      ...styles.actionBtn,
                      background:
                        decisionData.status === "Guard Accepted"
                          ? "#28a745"
                          : "#e0e0e0",
                      color:
                        decisionData.status === "Guard Accepted"
                          ? "white"
                          : "black",
                    }}
                  >
                    Accept Duty
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleStatusClick("Guard Rejected")}
                    style={{
                      ...styles.actionBtn,
                      background:
                        decisionData.status === "Guard Rejected"
                          ? "#dc3545"
                          : "#e0e0e0",
                      color:
                        decisionData.status === "Guard Rejected"
                          ? "white"
                          : "black",
                    }}
                  >
                    Reject Duty
                  </button>
                </div>

                {decisionData.status === "Guard Rejected" && (
                  <div style={{ marginBottom: 20 }}>
                    <label><b>Reason for Rejection</b></label>
                    <textarea
                      value={decisionData.reason}
                      onChange={handleReasonChange}
                      rows="3"
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        marginTop: "6px",
                      }}
                      placeholder="Enter reason for rejection..."
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  style={styles.submitBtn}
                >
                  {submitting ? "Submitting..." : "Submit Duty Decision"}
                </button>
              </form>
            </>
          )}
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
    background: "#1e73be",
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
