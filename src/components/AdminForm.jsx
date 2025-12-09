// import React, { useState } from 'react';
// import FormInput from './FormInput';
// import SubmitButton from './SubmitButton';
// import { submitAdminFormData, updateAdmin } from '../api/vipform';
// import AdminDetails from './AdminDetails';
// import { useNavigate } from 'react-router-dom';


// export default function AdminForm() {
//   const [adminformData, setadminFormData] = useState({
//     admin_id: '',
//     admin_name: '', 
//     username: '', 
//     admin_email: '',
//     password: '',
//     contact_no: '',
//     admin_status: '',
//   });

//   const [isEditMode, setIsEditMode] = useState(false);
//   const [selectedAdmin, setSelectedAdmin] = useState(null);
//   const [refreshTrigger, setRefreshTrigger] = useState(false);

//   const navigate = useNavigate();

//   //  when edit button clicked from AdminDetails
//   const handleEdit = (admin) => {
//     setadminFormData(admin);
//     setIsEditMode(true);
//     setSelectedAdmin(admin);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   //  reset after save or cancel
//   const resetForm = () => {
//     setadminFormData({
//     admin_id: '',
//     admin_name: '', 
//     username: '', 
//     admin_email: '',
//     password: '',
//     contact_no: '',
//     admin_status: '',
//     });
//     setIsEditMode(false);
//     setSelectedAdmin(null);
//   };

//   //  handle input
//   const handle_ad_Change = (e) => {
//     const { name, value } = e.target;
//     setadminFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // handle form submit
//   const handle_ad_Submit = async (e) => {
//     e.preventDefault();
//     try {
//       if (isEditMode) {
//         await updateAdmin(adminformData.id, adminformData);
//         alert("Admin details updated successfully!");
       
//       } else {
//         await submitAdminFormData(adminformData);
//         // alert("Admin registered successfully!");
//         navigate("/login");
//       }
//       resetForm();
//       setRefreshTrigger((prev) => !prev); // refresh table
//     } catch (err) {
//       console.error("Form submission failed:", err);
//       // alert("Error! while saving data");
//     }
//   };

//   return (
//     <div style={{ padding: "30px", maxWidth: "800px", margin: "auto", background: "white", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", }}
//     >
//       <h2 style={{ textAlign: "center", marginBottom: "20px" }}>{isEditMode ? "Edit Admin Details" : "Admin Registration Page"}</h2>
//       <form className="admin-form" onSubmit={handle_ad_Submit}>
//         <FormInput label="Admin ID" name="admin_id" type="text" value={adminformData.admin_id} onChange={handle_ad_Change} />
//         <FormInput label="Full Name" name="admin_name" type='name' value={adminformData.admin_name} onChange={handle_ad_Change} />
//         <FormInput label="Admin Username" name="username" type='name' value={adminformData.username} onChange={handle_ad_Change} />
//         <FormInput label="Email Id" name="admin_email" type='email' value={adminformData.admin_email} onChange={handle_ad_Change} />
//         <FormInput label="Password" name="password" type='password' value={adminformData.password} onChange={handle_ad_Change} />
//         <FormInput label="Contact Number" name="contact_no" type='text' value={adminformData.contact_no} onChange={handle_ad_Change} /> 
//         <div className="form-group">
//           <label>Admin Status</label>
//           <select name="admin_status" value={adminformData.admin_status} onChange={handle_ad_Change} style={{   width: "100%",   padding: "8px",   marginTop: "5px",   borderRadius: "5px",   border: "1px solid #ccc", }} required >
//             <option value="">Select Status</option>
//             <option value="Active">Active</option>
//             <option value="Inactive">Inactive</option>
//           </select><br/>
//         </div>
//         <SubmitButton label={isEditMode ? "Update Admin Details" : "Submit Admin Details"}/>
//         {isEditMode && (
//           <button type="button" onClick={resetForm} style={{   marginTop: "10px",   backgroundColor: "gray",   color: "white",   border: "none",   padding: "10px",   borderRadius: "5px",   width: "100%", }}>Cancel Updation</button>
//         )}
//       </form>
//       {/* Show the table below the form */}
//       {/* <div style={{ marginTop: "40px" }}>
//         <AdminDetails onEdit={handleEdit} refreshTrigger={refreshTrigger}/>
//       </div> */}
//     </div>
//   );
// }


import React, { useState } from 'react';
import FormInput from './FormInput';
import SubmitButton from './SubmitButton';
import { submitAdminFormData, updateAdmin } from '../api/vipform';
import { useNavigate } from 'react-router-dom';

export default function AdminForm() {
  const [adminformData, setadminFormData] = useState({
    id: '',
    adminName: '',
    adminUsername: '',
    adminEmail: '',
    adminPassword: '',
    contactNo: '',
    role: '',
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const navigate = useNavigate();

  const handleEdit = (admin) => {
    setadminFormData(admin);
    setIsEditMode(true);
    setSelectedAdmin(admin);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setadminFormData({
      id: '',
      adminName: '',
      adminUsername: '',
      adminEmail: '',
      adminPassword: '',
      contactNo: '',
      role: '',
    });
    setIsEditMode(false);
    setSelectedAdmin(null);
  };

  const handle_ad_Change = (e) => {
    const { name, value } = e.target;
    setadminFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handle_ad_Submit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateAdmin(adminformData.id, adminformData);
        alert("Admin details updated successfully!");
      } else {
        await submitAdminFormData(adminformData);
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
            {isEditMode ? "Edit Admin Details" : "Register Form"}
          </h2>

          <form className="admin-form" onSubmit={handle_ad_Submit}>

            <FormInput label="Admin ID" name="id" type="text"
              value={adminformData.id} onChange={handle_ad_Change}  required/>

            <FormInput label="Full Name" name="adminName" type='text'
              value={adminformData.adminName} onChange={handle_ad_Change}  required/>

            <FormInput label="Admin Username" name="adminUsername" type='text'
              value={adminformData.adminUsername} onChange={handle_ad_Change}  required/>

            <FormInput label="Email Id" name="adminEmail" type='email'
              value={adminformData.adminEmail} onChange={handle_ad_Change}  required/>

            <FormInput label="Password" name="adminPassword" type='text'
              value={adminformData.adminPassword} onChange={handle_ad_Change}  required/>

            <FormInput label="Contact Number" name="contactNo" type='text'
              value={adminformData.contactNo} onChange={handle_ad_Change} required />

            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                value={adminformData.role}
                onChange={handle_ad_Change}
                style={styles.select}
                required
              >
                <option value="">Select Role</option>
                <option value="ADMIN">Administrator</option>
                <option value="VIP">Vip</option>
                <option value="GUARD">Guard</option>
                <option value="USER">User</option>
              </select>
            </div>

            <SubmitButton label={isEditMode ? "Update Admin Details" : "Submit Admin Details"} />

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
    background: "#1e73be",
    padding: "40px",
    color: "white",
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
