import React from "react";
import { useVipStore } from "../context/VipContext";
import VipDetails from "../components/VipDetails";
import VipDetailEditPage from "../components/VipDetailEditPage";

export default function VipListPage() {
  const { selectedVip, handleBack } = useVipStore();

  return (
    <div className="container my-3">
      {selectedVip ? (
        <VipDetailEditPage vipData={selectedVip} onBack={handleBack} />
      ) : (
        <VipDetails />
      )}
    </div>
  );
}
