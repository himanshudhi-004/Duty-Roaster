import React, { useState } from 'react';
import FormInput from './FormInput';
import SubmitButton from './SubmitButton';
import { submitUserFormData, updateUser } from '../api/vipform';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function UserForm() {
  const [userformData, setuserFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    contactno: '',
    status: "Active",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const navigate = useNavigate();

  const handle_us_Edit = (user) => {
    setuserFormData(user);
    setIsEditMode(true);
    setSelectedUser(user);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setuserFormData({
      name: '',
      username: '',
      password: '',
      email: '',
      contactno: '',
      status: "Active",
    });
    setIsEditMode(false);
    setSelectedUser(null);
  };

  const handle_us_Change = (e) => {
    const { name, value } = e.target;
    setuserFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handle_us_Submit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateUser(userformData.id, userformData);
        toast.success("User details updated successfully!");
      } else {
        await submitUserFormData(userformData);
        navigate("/login");
      }
      resetForm();
      setRefreshTrigger((prev) => !prev);
    } catch (err) {
      console.error("Form submission failed:", err);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* LEFT BLUE SIDE */}
        <div style={styles.leftBox}>
          <h2 style={styles.leftTitle}>INFORMATION</h2>

          <p style={styles.desc}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
          </p>

          <p style={styles.desc}>
            <b>Eu ultrices:</b> Vitae auctor eu augue ut. Malesuada nunc vel risus commodo viverra.
          </p>

          <button style={styles.haveBtn} onClick={() => navigate("/login")}>
            Have An Account
          </button>
        </div>

        {/* RIGHT WHITE FORM */}
        <div style={styles.formBox}>
          <h2 style={styles.formTitle}>
            {isEditMode ? "Edit User Details" : "Manager Registeration Form"}
          </h2>

          <form className="user-form" onSubmit={handle_us_Submit}>

            {/* <FormInput label="User ID" name="id" type="text"
              value={userformData.id} onChange={handle_us_Change}   required/> */}

            <FormInput label="Full Name" name="name" type='text'
              value={userformData.name} onChange={handle_us_Change} required />

            <FormInput label="Username" name="username" type='text'
              value={userformData.username} onChange={handle_us_Change} required />

            <FormInput label="Email Id" name="email" type='email'
              value={userformData.email} onChange={handle_us_Change}  required />

            <FormInput label="Password" name="password" type='text'
              value={userformData.password} onChange={handle_us_Change} required />

            <FormInput label="Contact Number" name="contactno" type='text'
              value={userformData.contactno} onChange={handle_us_Change} required />

            {/* <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={userformData.status}
                onChange={handle_us_Change}
                style={styles.select}
                required
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="InActive">InActive</option>
              </select>
            </div> */}

            <SubmitButton label={isEditMode ? "Update User Details" : "Submit User Details"} />

            {isEditMode && (
              <button type="button" onClick={resetForm} style={styles.cancelBtn}>
                Cancel Updation
              </button>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}


// ---------- STYLES ----------
const styles = {
  //  page: {
  //    width: "100vw",
  //    // background: "#7bd3e2",
  //    display: "flex",
  //    justifyContent: "center",
  //    alignItems: "center",

  //   },

  container: {
    minHeight: "100vh",
    width: "100%",
    // margin: "auto",
    display: "flex",
    // borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 0 25px rgba(0,0,0,0.15)",
    background: "white",
  },

  leftBox: {
    width: "40%",
    background: "#fff",
    padding: "40px",
    color: "black",
  },

  leftTitle: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "20px",
  },

  desc: {
    fontSize: "15px",
    marginBottom: "20px",
    lineHeight: "1.5",
  },

  haveBtn: {
    background: "white",
    color: "#1e73be",
    border: "none",
    padding: "12px 25px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
  },

  formBox: {
    width: "60%",
    padding: "40px",
    background: "#f5f3f3ff",
  },

  formTitle: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#1e73be",
    marginBottom: "20px",
    textAlign: "left",
  },

  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid ##f5f3f3ff",
    marginTop: "5px",
  },

  cancelBtn: {
    marginTop: "10px",
    backgroundColor: "gray",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    width: "100%",
  },
};
