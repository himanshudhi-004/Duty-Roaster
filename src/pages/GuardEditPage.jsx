import React from "react";
import { useNavigate } from "react-router-dom";
import { useGuardStore } from "../context/GuardContext";
import GuardEditForm from "../components/GuardDetailEditPage"; // ✅ FIXED PATH

export default function GuardEditPage() {
  const navigate = useNavigate();
  const { selectedGuard, handleBack } = useGuardStore();

  if (!selectedGuard) {
    return (
      <div className="text-center mt-5 text-danger">
        <h4>No guard data found!</h4>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/guardprofile")}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <GuardEditForm
        guardData={selectedGuard}
        onBack={() => {
          handleBack();
          navigate("/guardprofile");
        }}
      />
    </div>
  );
}
