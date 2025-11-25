// // components/DesignationForm.jsx
// import React, { useState } from "react";
// import { createCategory } from "../api/designation";

// export default function GuardCategoryForm() {
//   const [category, setCategory] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!category.trim()) {
//       alert("Please enter a Category name.");
//       return;
//     }

//     try {
//       await createCategory({ name: category });
//       alert("Category created successfully!");
//       setCategory("");
//     } catch (error) {
//       console.error("Error creating category:", error);
//       alert("Failed to create category.");
//     }
//   };

//   return (
//     <div
//       style={{
//         padding: "30px",
//         maxWidth: "600px",
//         margin: "auto",
//         background: "white",
//         borderRadius: "10px",
//         boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//       }}
//     >
//       <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
//         Create New Guard Grade
//       </h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Grade Name</label>
//           <input
//             type="text"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             placeholder="Enter Categories (e.g., A Grade)"
//             style={{
//               width: "100%",
//               padding: "8px",
//               marginTop: "5px",
//               borderRadius: "5px",
//               border: "1px solid #ccc",
//             }}
//           />
//         </div>
//         <button
//           type="submit"
//           style={{
//             marginTop: "15px",
//             backgroundColor: "#007bff",
//             color: "white",
//             border: "none",
//             padding: "10px",
//             borderRadius: "5px",
//             width: "100%",
//           }}
//         >
//           Add Categories
//         </button>
//       </form>
//     </div>
//   );
// }
