import React from "react";
import { useNavigate } from "react-router-dom";
import { useVipStore } from "../context/VipContext";
import VipEditForm from "../components/VipDetailEditPage"; // ✅ FIXED PATH

export default function VipEditPage() {
  const navigate = useNavigate();
  const { selectedVip, handleBack } = useVipStore();

  if (!selectedVip) {
    return (
      <div className="text-center mt-5 text-danger">
        <h4>No Vip data found!</h4>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/vipprofile")}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <VipEditForm
        vipData={selectedVip}
        onBack={() => {
          handleBack();
          navigate("/vipprofile");
        }}
      />
    </div>
  );
}
