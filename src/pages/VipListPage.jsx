import React from "react";
import { useVipStore } from "../context/VipContext";
import VipDetails from "../components/VipDetails";
import VipDetailEditPage from "../components/VipDetailEditPage";

export default function VipListPage() {
  const { selectedVIP, handleBack } = useVipStore();

  return (
    <div className="container my-3">
      {selectedVIP ? (
        <VipDetailEditPage vipData={selectedVIP} onBack={handleBack} />
      ) : (
        <VipDetails />
      )}
    </div>
  );
}
