import React from "react";
import { useUserStore } from "../context/UserContext";
import UserDetails from "../components/UserDetails";
import UserDetailEditPage from "../components/UserDetailEditPage";

export default function UserListPage() {
  const { selectedUser, handleBack } = useUserStore();

  return (
    <div className="container my-3">
      {selectedUser ? (
        <UserDetailEditPage userData={selectedUser} onBack={handleBack} />
      ) : (
        <UserDetails />
      )}
    </div>
  );
}
