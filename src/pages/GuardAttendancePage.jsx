import React, { useState } from "react";
import GuardAttendanceForm from "../components/GuardAttendanceForm";
import GuardAttendanceTable from "../components/GuardAttendanceTable";

export default function GuardAttendancePage() {
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => !prev);
  };

  return (
    <div className="container mt-4">
      <GuardAttendanceForm onAttendanceAdded={handleRefresh} />
      <GuardAttendanceTable refreshTrigger={refreshTrigger} />
    </div>
  );
}
