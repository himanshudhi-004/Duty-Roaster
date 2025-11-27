// pages/UserEditPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../context/UserContext";
import UserEditForm from "../components/UserDetailEditPage";

export default function UserEditPage() {
  const { selectedUser, handleBack } = useUserStore();
  const navigate = useNavigate();

  if (!selectedUser) {
    return (
      <div className="text-center mt-5 text-danger">
        <h4>No user data found to edit.</h4>
      </div>
    );
  }

  return (
    <UserEditForm
      userData={selectedUser}
      onBack={() => {
        handleBack();
        navigate("/userprofile");
      }}
    />
  );
}
