import React, { useState, useEffect } from "react";
import axios from "axios";
import { submit_gd_FormData, updateGuard } from "../api/vipform";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function GuardForm() {
  const [guardformData, setGuardFormData] = useState({
    id: "",
    name: "",
    email: "",
    username: "",
    password: "",
    rank: "",
    experience: 0,
    contactno: "",
    status: "Inactive",
  });

  const [ranks, setRanks] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [otherRank, setOtherRank] = useState("");
  const [showOtherRank, setShowOtherRank] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [contactError, setContactError] = useState("");

  const [loading, setLoading] = useState(false);

  /* -------------------------------------------------------
     FETCH DYNAMIC RANKS FROM API
  ------------------------------------------------------- */
  useEffect(() => {
    const fetchRanks = async () => {
      try {
        const role = localStorage.getItem("role"); // admin or vip
        const token = localStorage.getItem(`${role}Token`);

        const response = await axios.get(
          `${BASE_URL}/api/officer/unique-ranks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRanks(response.data || []);
      } catch (error) {
        console.error("Failed to fetch ranks:", error);
        toast.error("Unable to load ranks!");
        setRanks([]);
      }
    };

    fetchRanks();
  }, []);

  /* -------------------------------------------------------
     INPUT HANDLERS
  ------------------------------------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // EMAIL VALIDATION (WITH DELAY)
    if (name === "email") {
      setGuardFormData((prev) => ({ ...prev, email: value }));
      setTimeout(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailError(emailRegex.test(value) ? "" : "Invalid email format");
      }, 600);
      return;
    }

    // CONTACT (ONLY DIGITS 10)
    if (name === "contactno") {
      if (/^\d{0,10}$/.test(value)) {
        setGuardFormData((prev) => ({ ...prev, contactno: value }));
        setContactError(
          value.length === 10 ? "" : "Contact number must be exactly 10 digits"
        );
      }
      return;
    }

    // RANK HANDLING (SHOW "OTHER" INPUT)
    if (name === "rank") {
      setGuardFormData((prev) => ({ ...prev, rank: value }));
      setShowOtherRank(value === "Other");
      if (value !== "Other") setOtherRank("");
      return;
    }

    // NORMAL INPUTS
    setGuardFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* -------------------------------------------------------
      SUBMIT FORM
  ------------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emailError || contactError) {
      toast.error("Please fix all errors!");
      return;
    }

    const finalData = {
      ...guardformData,
      rank: guardformData.rank === "Other" ? otherRank : guardformData.rank,
      status: "Inactive",
    };

    try {
      setLoading(true);

      if (isEditMode) {
        const res = await updateGuard(finalData.id, finalData);
        toast.success(res?.message || "Guard updated successfully!");
      } else {
        const res = await submit_gd_FormData(finalData);
        toast.success(res?.message || "Guard registered successfully!");
      }

      resetForm();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to save data";

      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------
     RESET FORM
  ------------------------------------------------------- */
  const resetForm = () => {
    setGuardFormData({
      id: "",
      name: "",
      email: "",
      username: "",
      password: "",
      rank: "",
      experience: "",
      contactno: "",
      status: "Inactive",
    });

    setOtherRank("");
    setShowOtherRank(false);
    setEmailError("");
    setContactError("");
    setIsEditMode(false);
  };

  /* -------------------------------------------------------
      UI RETURN
  ------------------------------------------------------- */
  return (
    <>
      <style>{CSS}</style>

      <div className="container">
        <div className="registration-card">
          {/* HEADER */}
          <div className="header-section">
            <div className="header-content">
              <h1 className="header-title">
                {isEditMode ? "Edit Guard Details" : "Guard Registration Form"}
              </h1>
              <p className="header-description">
                Register new security personnel with complete details.
              </p>
            </div>

            <div className={`mode-display ${isEditMode ? "edit-mode" : ""}`}>
              {isEditMode ? "Edit Mode" : "Registration Mode"}
            </div>
          </div>

          {/* FORM */}
          <div className="form-section">
            <form onSubmit={handleSubmit}>
              <div className="form-layout">

                {/* NAME */}
                <div className="form-field">
                  <label className="field-label">Full Name *</label>
                  <input
                    name="name"
                    value={guardformData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* EMAIL */}
                <div className="form-field">
                  <label className="field-label">Email *</label>
                  <input
                    name="email"
                    value={guardformData.email}
                    onChange={handleChange}
                    required
                  />
                  {emailError && (
                    <div className="error-message visible">{emailError}</div>
                  )}
                </div>

                {/* USERNAME */}
                <div className="form-field">
                  <label className="field-label">Username *</label>
                  <input
                    name="username"
                    value={guardformData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* PASSWORD */}
                <div className="form-field">
                  <label className="field-label">Password *</label>
                  <input
                    name="password"
                    type="text"
                    value={guardformData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* RANK */}
                <div className="form-field full-width-field">
                  <label className="field-label">Guard Rank *</label>
                  <select
                    name="rank"
                    value={guardformData.rank}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Rank</option>

                    {ranks.map((rank, i) => (
                      <option key={i} value={rank}>
                        {rank}
                      </option>
                    ))}

                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* OTHER RANK INPUT */}
                {showOtherRank && (
                  <div className="other-rank-wrapper visible">
                    <input
                      placeholder="Enter new rank (Example: X Grade)"
                      value={otherRank}
                      onChange={(e) => setOtherRank(e.target.value)}
                      required
                    />
                  </div>
                )}

                {/* EXPERIENCE */}
                <div className="form-field">
                  <label className="field-label">Experience *</label>
                  <input
                    type="number"
                    name="experience"
                    value={guardformData.experience}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* CONTACT */}
                <div className="form-field">
                  <label className="field-label">Contact *</label>
                  <input
                    name="contactno"
                    value={guardformData.contactno}
                    onChange={handleChange}
                    required
                  />
                  {contactError && (
                    <div className="error-message visible">{contactError}</div>
                  )}
                </div>
              </div>

              <div className="actions-section">
                <button className="submit-btn" type="submit" disabled={loading}>
                  {loading
                    ? "Processing..."
                    : isEditMode
                    ? "Update Guard"
                    : "Submit Guard"}
                </button>

                {isEditMode && (
                  <button
                    type="button"
                    className="cancel-btn visible"
                    onClick={resetForm}
                  >
                    Cancel Update
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------ CSS ------------------ */
const CSS = `
* { margin:0; padding:0; box-sizing:border-box; }

.container {
  max-width:1100px;
  margin:auto;
  padding:20px;
}

.registration-card {
  background:#fff;
  border-radius:20px;
  box-shadow:0 15px 40px rgba(0,0,0,.1);
  overflow:hidden;
  border:1px solid #e5e7eb;
}

.header-section {
  background:linear-gradient(135deg,#1e3a8a,#3b82f6);
  padding:35px 40px 45px;
  color:#fff;
  position:relative;
}

.header-title { font-size:32px; font-weight:700; color:#fff; }

.header-description { margin-top:8px; opacity:0.9; }

.mode-display {
  position:absolute;
  right:40px;
  bottom:-18px;
  background:linear-gradient(135deg,#fbbf24,#f59e0b);
  padding:10px 22px;
  border-radius:50px;
  color:white;
  font-weight:600;
  border:2px solid white;
}

.mode-display.edit-mode {
  background:linear-gradient(135deg,#10b981,#059669);
}

.form-section {
  padding:50px 40px;
}

.form-layout {
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:28px 32px;
}

.form-field { display:flex; flex-direction:column; }

.full-width-field { grid-column:span 2; }

.other-rank-wrapper { grid-column:span 2; }

input, select {
  padding:15px 20px;
  border:2px solid #e5e7eb;
  border-radius:12px;
  font-size:15px;
}

.actions-section {
  margin-top:40px;
  display:flex;
  gap:12px;
}

.submit-btn {
  flex:1;
  background:#2563eb;
  color:white;
  padding:18px;
  border:none;
  border-radius:12px;
  font-weight:600;
}

.cancel-btn {
  background:#f3f4f6;
  padding:18px;
  border-radius:12px;
  border:2px solid #ddd;
}

.error-message {
  color:red;
  font-size:13px;
  margin-top:6px;
}

/* TABLET */
@media (max-width: 768px) {
  .form-layout { grid-template-columns:1fr; }
  .full-width-field, .other-rank-wrapper { grid-column:span 1; }
}

/* MOBILE */
@media (max-width: 480px) {
  .form-section { padding:25px; }
  .actions-section { flex-direction:column; }
  .submit-btn, .cancel-btn { width:100%; }
}
`;
