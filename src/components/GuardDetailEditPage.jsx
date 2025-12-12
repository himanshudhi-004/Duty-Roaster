import React, { useState, useEffect } from "react";
import axios from "axios";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";
import { updateGuard } from "../api/vipform";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function GuardEditForm({ guardData, onBack }) {
  const role = localStorage.getItem("role"); // CHECK USER ROLE

  // -------- INITIAL STATE --------
  const [guardformData, setGuardFormData] = useState({
    ...guardData,
    password: "", // always start empty
  });

  const [ranks, setRanks] = useState([]);
  const [otherRank, setOtherRank] = useState("");
  const [showOtherRank, setShowOtherRank] = useState(false);

  /* -------------------------------------------------------
      FETCH DYNAMIC RANKS (Admin only)
  ------------------------------------------------------- */
  useEffect(() => {
    if (role !== "admin") return; // Only admin can fetch/edit ranks

    const fetchRanks = async () => {
      try {
        const token = localStorage.getItem(`${role}Token`);

        const response = await axios.get(
          `${BASE_URL}/api/officer/unique-ranks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fetchedRanks = response.data || [];
        setRanks(fetchedRanks);

        // if rank is not in list → auto show "Other"
        if (guardData.rank && !fetchedRanks.includes(guardData.rank)) {
          setShowOtherRank(true);
          setOtherRank(guardData.rank);
          setGuardFormData((prev) => ({ ...prev, rank: "Other" }));
        }
      } catch (error) {
        console.error("Failed to fetch ranks:", error);
        toast.error("Unable to load ranks!");
      }
    };

    fetchRanks();
  }, [guardData.rank, role]);

  /* -------------------------------------------------------
      INPUT CHANGE HANDLER
  ------------------------------------------------------- */
  const handle_gd_change = (e) => {
    const { name, value } = e.target;

    // Rank logic—Admin only
    if (name === "rank") {
      setGuardFormData((prev) => ({ ...prev, rank: value }));
      setShowOtherRank(value === "Other");

      if (value !== "Other") setOtherRank("");
      return;
    }

    setGuardFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* -------------------------------------------------------
      SUBMIT UPDATED DETAILS
  ------------------------------------------------------- */
  const handle_gd_submit = async (e) => {
    e.preventDefault();

    const finalData = {
      ...guardformData,
      rank:
        guardformData.rank === "Other" ? otherRank : guardformData.rank,
    };

    // Remove password field if empty
    if (!finalData.password) delete finalData.password;

    try {
      await updateGuard(finalData.id, finalData);
      toast.success("Guard updated successfully!");
      onBack();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update Guard");
    }
  };

  /* -------------------------------------------------------
      RETURN UI
  ------------------------------------------------------- */
  return (
    <form onSubmit={handle_gd_submit}>
      <h2>Edit Guard</h2>

      <FormInput
        label="Full Name"
        name="name"
        value={guardformData.name}
        onChange={handle_gd_change}
        isEdit={true}
      />

      <FormInput
        label="Email"
        name="email"
        value={guardformData.email}
        onChange={handle_gd_change}
        isEdit={true}
      />

      <FormInput
        label="Username"
        name="username"
        value={guardformData.username}
        onChange={handle_gd_change}
        isEdit={true}
      />

      {/* PASSWORD FIELD */}
      <FormInput
        label="Password"
        name="password"
        type="text"
        value={guardformData.password}
        onChange={handle_gd_change}
        isEdit={true}
      />

      {/* -----------------------------
          RANK SECTION
         ----------------------------- */}
      {role === "admin" ? (
        <>
          {/* DYNAMIC DROPDOWN FOR ADMIN */}
          <div className="form-group">
            <label>Guard Rank</label>
            <select
              name="rank"
              value={guardformData.rank || ""}
              onChange={handle_gd_change}
              style={selectStyle}
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

          {/* "OTHER RANK" FIELD FOR ADMIN */}
          {showOtherRank && (
            <FormInput
              label="Enter Custom Rank"
              name="otherRank"
              value={otherRank}
              onChange={(e) => setOtherRank(e.target.value)}
              isEdit={true}
            />
          )}
        </>
      ) : (
        <>
        
        </>
      )}

      <FormInput
        label="Guard Experience"
        name="experience"
        type="number"
        value={guardformData.experience || ""}
        onChange={handle_gd_change}
        isEdit={true}
      />

      <FormInput
        label="Contact No"
        name="contactno"
        value={guardformData.contactno}
        onChange={handle_gd_change}
        isEdit={true}
      />

      <SubmitButton label="Update" />

      <button
        type="button"
        onClick={onBack}
        className="btn btn-secondary w-100 mt-3"
      >
        Cancel
      </button>
    </form>
  );
}

const selectStyle = {
  width: "100%",
  padding: "8px",
  marginTop: "5px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};
