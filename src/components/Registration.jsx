import React, { useEffect, useState } from "react";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";
import { submit_gd_FormData, submit_vip_FormData } from "../api/vipform";
import { getAllCategory, getAllDesignations } from "../api/designation";
import { toast } from "react-toastify";

export default function Registration() {
  const [activeType, setActiveType] = useState("guard");
  const [loading, setLoading] = useState(false);

  /* ---------------------- GUARD STATE ---------------------- */
  const [guardForm, setGuardForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    rank: "",
    experience: "",
    contactno: "",
    status: "Inactive",
  });

  const [ranks, setRanks] = useState([]);
  const [otherRank, setOtherRank] = useState("");

  /* ---------------------- VIP STATE ---------------------- */
  const [vipForm, setVipForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    designation: "",
    contactno: "",
    status: "Inactive",
  });

  const [designations, setDesignations] = useState([]);
  const [otherDesignation, setOtherDesignation] = useState("");

  /* ---------------------- FETCH DROPDOWNS ---------------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const r = await getAllCategory();
        setRanks(Array.isArray(r) ? r : ["A Grade", "B Grade", "C Grade", "D Grade", "E Grade"]);
      } catch {
        setRanks(["A Grade", "B Grade", "C Grade", "D Grade", "E Grade"]);
      }

      try {
        const d = await getAllDesignations();
        setDesignations(Array.isArray(d) ? d : ["Bollywood Actor", "Cricketer", "Chessmaster", "User"]);
      } catch {
        setDesignations(["Bollywood Actor", "Cricketer", "Chessmaster", "User"]);
      }
    };

    fetchData();
  }, []);

  /* ---------------------- INPUT HANDLERS ---------------------- */
  const handleGuardChange = (e) => {
    const { name, value } = e.target;

    setGuardForm((prev) => {
      if (name === "rank") {
        if (value !== "Other") setOtherRank("");
        return { ...prev, rank: value };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleVipChange = (e) => {
    const { name, value } = e.target;

    setVipForm((prev) => {
      if (name === "designation") {
        if (value !== "Other") setOtherDesignation("");
        return { ...prev, designation: value };
      }
      return { ...prev, [name]: value };
    });
  };

  /* ---------------------- GUARD SUBMIT ---------------------- */
  const handleGuardSubmit = async (e) => {
    e.preventDefault();

    if (!guardForm.rank) {
      toast.error("Please select a guard rank");
      return;
    }

    const finalData = {
      ...guardForm,
      rank: guardForm.rank === "Other" ? otherRank : guardForm.rank,
      status: "Inactive",
    };

    try {
      setLoading(true);
      const res = await submit_gd_FormData(finalData);
      toast.success(res?.message || "Guard Registered Successfully");
      resetGuard();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Guard Registration Failed";
      toast.error(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------- VIP SUBMIT ---------------------- */
  const handleVipSubmit = async (e) => {
    e.preventDefault();

    if (!vipForm.designation) {
      toast.error("Please select a designation");
      return;
    }

    const finalData = {
      ...vipForm,
      designation:
        vipForm.designation === "Other"
          ? otherDesignation
          : vipForm.designation,
      status: "Inactive",
    };

    try {
      setLoading(true);
      const res = await submit_vip_FormData(finalData);
      toast.success(res?.message || "VIP Registered Successfully");
      resetVip();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "VIP Registration Failed";
      toast.error(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------- RESET FUNCTIONS ---------------------- */
  const resetGuard = () => {
    setGuardForm({
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
  };

  const resetVip = () => {
    setVipForm({
      name: "",
      email: "",
      username: "",
      password: "",
      designation: "",
      contactno: "",
      status: "Inactive",
    });
    setOtherDesignation("");
  };

  /* ---------------------- UI ---------------------- */
  return (
    <div style={styles.page}>
      <div style={styles.switchBox}>
        <button
          onClick={() => setActiveType("guard")}
          style={{
            ...styles.switchBtn,
            background: activeType === "guard" ? "#3B51E3" : "#fff",
            color: activeType === "guard" ? "#fff" : "#3B51E3",
          }}
        >
          Guard Registration
        </button>

        <button
          onClick={() => setActiveType("vip")}
          style={{
            ...styles.switchBtn,
            background: activeType === "vip" ? "#3B51E3" : "#fff",
            color: activeType === "vip" ? "#fff" : "#3B51E3",
          }}
        >
          VIP Registration
        </button>
      </div>

      <div style={styles.card}>
        {activeType === "guard" ? (
          <>
            <h2 style={styles.title}>Guard Registration</h2>

            <form onSubmit={handleGuardSubmit}>
              <FormInput label="Full Name" name="name" value={guardForm.name} onChange={handleGuardChange} required />
              <FormInput label="Email" name="email" value={guardForm.email} onChange={handleGuardChange} required />
              <FormInput label="Username" name="username" value={guardForm.username} onChange={handleGuardChange} required />
              <FormInput label="Password" name="password" value={guardForm.password} onChange={handleGuardChange} required />

              <label>Guard Rank</label>
              <select name="rank" value={guardForm.rank} onChange={handleGuardChange} style={styles.select} required>
                <option value="">Select Rank</option>
                {ranks.map((r, i) => (
                  <option key={i} value={r}>{r}</option>
                ))}
                <option value="Other">Other</option>
              </select>

              {guardForm.rank === "Other" && (
                <FormInput
                  label="Other Rank"
                  value={otherRank}
                  onChange={(e) => setOtherRank(e.target.value)}
                  required
                />
              )}

              <FormInput label="Experience (Years)" name="experience" type="number" value={guardForm.experience} onChange={handleGuardChange} required />
              <FormInput label="Contact No" name="contactno" value={guardForm.contactno} onChange={handleGuardChange} required />

              <SubmitButton
                label={loading ? "Submitting..." : "Register Guard"}
                disabled={loading}
              />
            </form>
          </>
        ) : (
          <>
            <h2 style={styles.title}>VIP Registration</h2>

            <form onSubmit={handleVipSubmit}>
              <FormInput label="Full Name" name="name" value={vipForm.name} onChange={handleVipChange} required />
              <FormInput label="Email" name="email" value={vipForm.email} onChange={handleVipChange} required />
              <FormInput label="Username" name="username" value={vipForm.username} onChange={handleVipChange} required />
              <FormInput label="Password" name="password" value={vipForm.password} onChange={handleVipChange} required />

              <label>Designation</label>
              <select name="designation" value={vipForm.designation} onChange={handleVipChange} style={styles.select} required>
                <option value="">Select</option>
                {designations.map((d, i) => (
                  <option key={i} value={d.name || d}>{d.name || d}</option>
                ))}
                <option value="Other">Other</option>
              </select>

              {vipForm.designation === "Other" && (
                <FormInput
                  label="Other Designation"
                  value={otherDesignation}
                  onChange={(e) => setOtherDesignation(e.target.value)}
                  required
                />
              )}

              <FormInput label="Contact No" name="contactno" value={vipForm.contactno} onChange={handleVipChange} required />

              <SubmitButton
                label={loading ? "Submitting..." : "Register VIP"}
                disabled={loading}
              />
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------------- STYLES ---------------------- */
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #eef2ff, #ffffff)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
  },
  switchBox: {
    display: "flex",
    gap: "12px",
    padding: "12px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
    marginBottom: "20px",
  },
  switchBtn: {
    padding: "12px 18px",
    borderRadius: "10px",
    border: "1px solid #3B51E3",
    fontWeight: "600",
    cursor: "pointer",
    minWidth: "160px",
  },
  card: {
    width: "100%",
    maxWidth: "460px",
    padding: "30px",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "20px",
    textAlign: "center",
  },
  select: {
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
};
