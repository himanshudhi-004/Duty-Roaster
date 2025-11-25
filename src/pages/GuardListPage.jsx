
import React from "react";
import { useGuardStore } from "../context/GuardContext";
import GuardDetails from "../components/GuardDetails";
import GuardDetailEditPage from "../components/GuardDetailEditPage";

export default function GuardListPage() {
  const { selectedGuard, handleBack } = useGuardStore();

  return (
    <div className="container my-3">
      {selectedGuard ? (
        <GuardDetailEditPage guardData={selectedGuard} onBack={handleBack} />
      ) : (
        <GuardDetails />
      )}
    </div>
  );
}
