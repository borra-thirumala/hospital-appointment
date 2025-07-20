import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx"; // Assuming useAuth is still relevant for your context

const roles = [
  {
    id: "patient",
    title: "Register as Patient",
    description: "Book appointments and view your consultation history.",
    icon: "�‍⚕️",
    bg: "bg-blue-100",
  },
  {
    id: "doctor",
    title: "Register as Doctor",
    description: "Manage your slots and view earnings.",
    icon: "👨‍⚕️",
    bg: "bg-green-100",
  },
  {
    id: "hospitalAdmin",
    title: "Register as Hospital Admin",
    description: "Manage hospitals, departments, and doctors.",
    icon: "🏢", // Corrected icon for Hospital Admin
    bg: "bg-yellow-100",
  },
];

function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Assuming setUser is used to update global auth state

  const [role, setRole] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    dob: "",
    uniqueId: "", // For patient (e.g., Aadhar/Passport)
    qualifications: "",
    experience: "", // In years
    specializations: "", // For doctor
  });
  const [error, setError] = useState(""); // State for error messages
  const [successMsg, setSuccessMsg] = useState(""); // State for success messages

  // Clear messages when role changes or component mounts/updates
  useEffect(() => {
    setError("");
    setSuccessMsg("");
  }, [role]); // Clear messages when the selected role changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error on input change
    setSuccessMsg(""); // Clear success message on input change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccessMsg(""); // Clear previous success messages

    // Basic validation for all roles
    if (!role) {
      setError("Please select a role to register.");
      return;
    }
    if (!formData.name || !formData.email || !formData.password) {
      setError("Name, Email, and Password are required for all roles.");
      return;
    }

    // Retrieve existing users from localStorage
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // Check if a user with the same email already exists
    if (allUsers.some((user) => user.email.toLowerCase() === formData.email.toLowerCase())) {
      setError("This email is already registered. Please use a different email or login.");
      return;
    }

    // Construct the new user object
    let newUser = {
      id: `user_${Date.now()}`, // Generate a simple unique ID for all users
      role,
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    // Role-specific validation and data addition
    if (role === "patient") {
      if (!formData.gender || !formData.dob || !formData.uniqueId) {
        setError("Gender, Date of Birth, and Unique ID (Aadhar/Passport) are required for patients.");
        return;
      }
      newUser = {
        ...newUser,
        gender: formData.gender,
        dob: formData.dob,
        uniqueId: formData.uniqueId,
      };
    } else if (role === "doctor") {
      if (!formData.qualifications || !formData.experience || !formData.specializations) {
        setError("Qualifications, Years of Experience, and Specializations are required for doctors.");
        return;
      }
      newUser = {
        ...newUser,
        qualifications: formData.qualifications,
        experience: Number(formData.experience), // Ensure experience is a number
        specializations: formData.specializations,
      };
    }
    // No specific extra fields for hospitalAdmin, but the role itself is set.

    // Add the new user to the array of all users
    allUsers.push(newUser);

    // Save the updated array of all users back to localStorage under the 'users' key
    localStorage.setItem("users", JSON.stringify(allUsers));

    // Also set the 'currentUser' for immediate login session (as per your Login.jsx)
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    localStorage.setItem("token", "dummy-jwt-token"); // Store a dummy token for ProtectedRoute

    // Update global user state via AuthContext (if applicable)
    setUser(newUser);

    setSuccessMsg(`Registration successful for ${newUser.name} (${role})! Redirecting...`);

    // Navigate immediately based on role
    if (newUser.role === "doctor") {
      navigate("/doctor/dashboard"); // Redirect doctor to their appointments page
    } else if (newUser.role === "patient") {
      navigate("/patient/history"); // Redirect patient to their history/appointments page
    } else if (newUser.role === "hospitalAdmin") {
      navigate("/admin/appointments"); // Redirect admin to their appointments page
    } else {
      // Fallback for unknown roles or if no specific appointment page
      navigate("/login"); // Fallback to login if role not handled
    }

    // Optionally clear form fields after successful registration
    setFormData({
      name: "", email: "", password: "", gender: "", dob: "", uniqueId: "",
      qualifications: "", experience: "", specializations: ""
    });
    setRole(null); // Reset role selection

    // Remove the setTimeout to navigate to login, as we navigate immediately above
    // setTimeout(() => {
    //   navigate("/login");
    // }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 to-white p-6 flex flex-col items-center">
      <h2 className="text-4xl font-bold text-center text-indigo-700 mb-10">Create an Account</h2>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-10">
        {roles.map((r) => (
          <div
            key={r.id}
            className={`p-6 rounded-xl shadow-md border cursor-pointer transition hover:scale-105 duration-300 ${
              role === r.id ? "border-indigo-600 ring-2 ring-indigo-300" : "border-gray-200"
            } ${r.bg}`}
            onClick={() => setRole(r.id)}
          >
            <div className="text-5xl mb-4 text-center">{r.icon}</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800 text-center">{r.title}</h3>
            <p className="text-sm text-gray-600 text-center">{r.description}</p>
          </div>
        ))}
      </div>

      {/* Role-based Form */}
      {role && (
        <form
          onSubmit={handleSubmit}
          className="bg-white w-full max-w-2xl p-8 rounded-xl shadow-lg space-y-4"
        >
          <h3 className="text-2xl font-semibold text-indigo-700 mb-4 text-center">
            {roles.find((r) => r.id === role)?.title}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
              required
            />
          </div>

          {role === "patient" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
                required
              />

              <input
                type="text"
                name="uniqueId"
                placeholder="Aadhar / Passport / Unique ID"
                value={formData.uniqueId}
                onChange={handleChange}
                className="md:col-span-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
                required
              />
            </div>
          )}

          {role === "doctor" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="qualifications"
                placeholder="Qualifications (e.g., MBBS, MD)"
                value={formData.qualifications}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
                required
              />
              <input
                type="number"
                name="experience"
                placeholder="Years of Experience"
                value={formData.experience}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
                required
              />
              <input
                type="text"
                name="specializations"
                placeholder="Specializations (e.g., Cardiology, Pediatrics)"
                value={formData.specializations}
                onChange={handleChange}
                className="md:col-span-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-lg transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-75 font-semibold text-lg"
          >
            Register
          </button>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mt-6 border border-red-300 shadow-sm text-center">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-100 text-green-800 p-4 rounded-lg mt-6 border border-green-300 shadow-sm text-center">
              {successMsg}
            </div>
          )}

          <p className="mt-4 text-center text-gray-600 text-base">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200">
              Login
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}

export default Register;
// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext.jsx"; // Assuming useAuth is still relevant for your context

// const roles = [
//   {
//     id: "patient",
//     title: "Register as Patient",
//     description: "Book appointments and view your consultation history.",
//     icon: "🧑‍⚕️",
//     bg: "bg-blue-100",
//   },
//   {
//     id: "doctor",
//     title: "Register as Doctor",
//     description: "Manage your slots and view earnings.",
//     icon: "👨‍⚕️",
//     bg: "bg-green-100",
//   },
//   {
//     id: "hospitalAdmin",
//     title: "Register as Hospital Admin",
//     description: "Manage hospitals, departments, and doctors.",
//     icon: "🏢", // Corrected icon for Hospital Admin
//     bg: "bg-yellow-100",
//   },
// ];

// function Register() {
//   const navigate = useNavigate();
//   const { setUser } = useAuth(); // Assuming setUser is used to update global auth state

//   const [role, setRole] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     gender: "",
//     dob: "",
//     uniqueId: "", // For patient (e.g., Aadhar/Passport)
//     qualifications: "",
//     experience: "", // In years
//     specializations: "", // For doctor
//   });
//   const [error, setError] = useState(""); // State for error messages
//   const [successMsg, setSuccessMsg] = useState(""); // State for success messages

//   // Clear messages when role changes or component mounts/updates
//   useEffect(() => {
//     setError("");
//     setSuccessMsg("");
//   }, [role]); // Clear messages when the selected role changes

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     setError(""); // Clear error on input change
//     setSuccessMsg(""); // Clear success message on input change
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setError(""); // Clear previous errors
//     setSuccessMsg(""); // Clear previous success messages

//     // Basic validation for all roles
//     if (!role) {
//       setError("Please select a role to register.");
//       return;
//     }
//     if (!formData.name || !formData.email || !formData.password) {
//       setError("Name, Email, and Password are required for all roles.");
//       return;
//     }

//     // Retrieve existing users from localStorage
//     const allUsers = JSON.parse(localStorage.getItem("users") || "[]");

//     // Check if a user with the same email already exists
//     if (allUsers.some((user) => user.email.toLowerCase() === formData.email.toLowerCase())) {
//       setError("This email is already registered. Please use a different email or login.");
//       return;
//     }

//     // Construct the new user object
//     let newUser = {
//       id: `user_${Date.now()}`, // Generate a simple unique ID for all users
//       role,
//       name: formData.name,
//       email: formData.email,
//       password: formData.password,
//     };

//     // Role-specific validation and data addition
//     if (role === "patient") {
//       if (!formData.gender || !formData.dob || !formData.uniqueId) {
//         setError("Gender, Date of Birth, and Unique ID (Aadhar/Passport) are required for patients.");
//         return;
//       }
//       newUser = {
//         ...newUser,
//         gender: formData.gender,
//         dob: formData.dob,
//         uniqueId: formData.uniqueId,
//       };
//     } else if (role === "doctor") {
//       if (!formData.qualifications || !formData.experience || !formData.specializations) {
//         setError("Qualifications, Years of Experience, and Specializations are required for doctors.");
//         return;
//       }
//       newUser = {
//         ...newUser,
//         qualifications: formData.qualifications,
//         experience: Number(formData.experience), // Ensure experience is a number
//         specializations: formData.specializations,
//       };
//     }else if (role === "hospitalAdmin") {
//         navigate("/admin/appointments"); // Changed from /admin/dashboard
//       }

//     // Add the new user to the array of all users
//     allUsers.push(newUser);

//     // Save the updated array of all users back to localStorage under the 'users' key
//     localStorage.setItem("users", JSON.stringify(allUsers));

//     // Also set the 'currentUser' for immediate login session (as per your Login.jsx)
//     localStorage.setItem("currentUser", JSON.stringify(newUser));
//     localStorage.setItem("token", "dummy-jwt-token"); // Store a dummy token for ProtectedRoute

//     // Update global user state via AuthContext (if applicable)
//     setUser(newUser);

//     setSuccessMsg(`Registration successful for ${newUser.name} (${role})! Redirecting to login...`);

//     // Optionally clear form fields after successful registration
//     setFormData({
//       name: "", email: "", password: "", gender: "", dob: "", uniqueId: "",
//       qualifications: "", experience: "", specializations: ""
//     });
//     setRole(null); // Reset role selection

//     // Navigate to login after a short delay
//     setTimeout(() => {
//       navigate("/login");
//     }, 2000); // 2-second delay to show success message
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-tr from-indigo-100 to-white p-6 flex flex-col items-center">
//       <h2 className="text-4xl font-bold text-center text-indigo-700 mb-10">Create an Account</h2>

//       {/* Role Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-10">
//         {roles.map((r) => (
//           <div
//             key={r.id}
//             className={`p-6 rounded-xl shadow-md border cursor-pointer transition hover:scale-105 duration-300 ${
//               role === r.id ? "border-indigo-600 ring-2 ring-indigo-300" : "border-gray-200"
//             } ${r.bg}`}
//             onClick={() => setRole(r.id)}
//           >
//             <div className="text-5xl mb-4 text-center">{r.icon}</div> {/* Added text-center */}
//             <h3 className="text-xl font-bold mb-2 text-gray-800 text-center">{r.title}</h3> {/* Added text-center */}
//             <p className="text-sm text-gray-600 text-center">{r.description}</p> {/* Added text-center */}
//           </div>
//         ))}
//       </div>

//       {/* Role-based Form */}
//       {role && (
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white w-full max-w-2xl p-8 rounded-xl shadow-lg space-y-4"
//         >
//           <h3 className="text-2xl font-semibold text-indigo-700 mb-4 text-center">
//             {roles.find((r) => r.id === role)?.title}
//           </h3>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input
//               type="text"
//               name="name"
//               placeholder="Full Name"
//               value={formData.name}
//               onChange={handleChange}
//               className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
//               required
//             />
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={formData.email}
//               onChange={handleChange}
//               className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
//               required
//             />
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
//               required
//             />
//           </div>

//           {role === "patient" && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <select
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 required
//                 className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
//               >
//                 <option value="">Select Gender</option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//                 <option value="other">Other</option>
//               </select>

//               <input
//                 type="date"
//                 name="dob"
//                 value={formData.dob}
//                 onChange={handleChange}
//                 className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
//                 required
//               />

//               <input
//                 type="text"
//                 name="uniqueId"
//                 placeholder="Aadhar / Passport / Unique ID"
//                 value={formData.uniqueId}
//                 onChange={handleChange}
//                 className="md:col-span-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
//                 required
//               />
//             </div>
//           )}

//           {role === "doctor" && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 name="qualifications"
//                 placeholder="Qualifications (e.g., MBBS, MD)"
//                 value={formData.qualifications}
//                 onChange={handleChange}
//                 className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
//                 required
//               />
//               <input
//                 type="number"
//                 name="experience"
//                 placeholder="Years of Experience"
//                 value={formData.experience}
//                 onChange={handleChange}
//                 className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
//                 required
//               />
//               <input
//                 type="text"
//                 name="specializations"
//                 placeholder="Specializations (e.g., Cardiology, Pediatrics)"
//                 value={formData.specializations}
//                 onChange={handleChange}
//                 className="md:col-span-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
//                 required
//               />
//             </div>
//           )}

//           <button
//             type="submit"
//             className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-lg transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-75 font-semibold text-lg"
//           >
//             Register
//           </button>

//           {/* Error/Success Messages */}
//           {error && (
//             <div className="bg-red-100 text-red-700 p-4 rounded-lg mt-6 border border-red-300 shadow-sm text-center">
//               {error}
//             </div>
//           )}
//           {successMsg && (
//             <div className="bg-green-100 text-green-800 p-4 rounded-lg mt-6 border border-green-300 shadow-sm text-center">
//               {successMsg}
//             </div>
//           )}

//           <p className="mt-4 text-center text-gray-600 text-base">
//             Already have an account?{" "}
//             <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200">
//               Login
//             </Link>
//           </p>
//         </form>
//       )}
//     </div>
//   );
// }

// export default Register;

// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext.jsx"; // Assuming useAuth is still relevant for your context

// const roles = [
//   {
//     id: "patient",
//     title: "Register as Patient",
//     description: "Book appointments and view your consultation history.",
//     icon: "🧑‍⚕️",
//     bg: "bg-blue-100",
//   },
//   {
//     id: "doctor",
//     title: "Register as Doctor",
//     description: "Manage your slots and view earnings.",
//     icon: "👨‍⚕️",
//     bg: "bg-green-100",
//   },
//   {
//     id: "hospitalAdmin",
//     title: "Register as Hospital Admin",
//     description: "Manage hospitals, departments, and doctors.",
//     icon: "�",
//     bg: "bg-yellow-100",
//   },
// ];

// function Register() {
//   const navigate = useNavigate();
//   const { setUser } = useAuth();
//   const [role, setRole] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "", // Ensure password is part of formData state
//     gender: "",
//     dob: "",
//     uniqueId: "",
//     qualifications: "",
//     experience: "",
//     specializations: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Retrieve existing users from localStorage or initialize an empty array
//     // NOTE: Your Login.jsx expects an array under 'users' key, not just 'user'
//     const allUsers = JSON.parse(localStorage.getItem("users")) || [];

//     // Check if a user with the same email already exists in the 'users' array
//     const existingUserInStorage = allUsers.find((user) => user.email === formData.email);

//     if (existingUserInStorage) {
//         // You might want to add an error state here to inform the user
//         console.error("User with this email already exists.");
//         // For now, just return to prevent duplicate registration
//         return;
//     }

//     // Construct the user data to be saved.
//     // CRUCIAL: Include the password here!
//     const newUser = {
//       role,
//       name: formData.name,
//       email: formData.email,
//       password: formData.password, // <-- ADDED THIS LINE
//     };

//     if (role === "patient") {
//       newUser.gender = formData.gender;
//       newUser.dob = formData.dob;
//       newUser.uniqueId = formData.uniqueId;
//     } else if (role === "doctor") {
//       newUser.qualifications = formData.qualifications;
//       newUser.experience = formData.experience;
//       newUser.specializations = formData.specializations;
//     }

//     // Add the new user to the array of all users
//     allUsers.push(newUser);

//     // Save the updated array of all users back to localStorage under the 'users' key
//     localStorage.setItem("users", JSON.stringify(allUsers));

//     // Also set the 'currentUser' for immediate login session (as per your Login.jsx)
//     localStorage.setItem("currentUser", JSON.stringify(newUser));


//     // Set global user state (assuming useAuth expects this structure)
//     setUser(newUser); // Pass the full user object to context

//     // Navigate based on role
//     if (role === "doctor") navigate("/doctor/dashboard");
//     else if (role === "hospitalAdmin") navigate("/admin/dashboard");
//     else navigate("/patient/dashboard");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-tr from-indigo-100 to-white p-6 flex flex-col items-center">
//       <h2 className="text-4xl font-bold text-center text-indigo-700 mb-10">Create an Account</h2>

//       {/* Role Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-10">
//         {roles.map((r) => (
//           <div
//             key={r.id}
//             className={`p-6 rounded-xl shadow-md border cursor-pointer transition hover:scale-105 duration-300 ${
//               role === r.id ? "border-indigo-600 ring-2 ring-indigo-300" : "border-gray-200"
//             } ${r.bg}`}
//             onClick={() => setRole(r.id)}
//           >
//             <div className="text-5xl mb-4">{r.icon}</div>
//             <h3 className="text-xl font-bold mb-2">{r.title}</h3>
//             <p className="text-sm text-gray-600">{r.description}</p>
//           </div>
//         ))}
//       </div>

//       {/* Role-based Form */}
//       {role && (
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white w-full max-w-2xl p-8 rounded-xl shadow-lg space-y-4"
//         >
//           <h3 className="text-2xl font-semibold text-indigo-700 mb-4">
//             {roles.find((r) => r.id === role)?.title}
//           </h3>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input
//               type="text"
//               name="name"
//               placeholder="Full Name"
//               value={formData.name}
//               onChange={handleChange}
//               className="p-3 border rounded"
//               required
//             />
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={formData.email}
//               onChange={handleChange}
//               className="p-3 border rounded"
//               required
//             />
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               className="p-3 border rounded"
//               required
//             />
//           </div>

//           {role === "patient" && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <select
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 required
//                 className="p-3 border rounded"
//               >
//                 <option value="">Select Gender</option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//                 <option value="other">Other</option>
//               </select>

//               <input
//                 type="date"
//                 name="dob"
//                 value={formData.dob}
//                 onChange={handleChange}
//                 className="p-3 border rounded"
//                 required
//               />

//               <input
//                 type="text"
//                 name="uniqueId"
//                 placeholder="Aadhar / Passport"
//                 value={formData.uniqueId}
//                 onChange={handleChange}
//                 className="md:col-span-2 p-3 border rounded"
//                 required
//               />
//             </div>
//           )}

//           {role === "doctor" && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 name="qualifications"
//                 placeholder="Qualifications"
//                 value={formData.qualifications}
//                 onChange={handleChange}
//                 className="p-3 border rounded"
//                 required
//               />
//               <input
//                 type="number"
//                 name="experience"
//                 placeholder="Years of Experience"
//                 value={formData.experience}
//                 onChange={handleChange}
//                 className="p-3 border rounded"
//                 required
//               />
//               <input
//                 type="text"
//                 name="specializations"
//                 placeholder="Specializations (comma-separated)"
//                 value={formData.specializations}
//                 onChange={handleChange}
//                 className="md:col-span-2 p-3 border rounded"
//                 required
//               />
//             </div>
//           )}

//           <button
//             type="submit"
//             className="w-full mt-4 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition"
//           >
//             Register
//           </button>

//           <p className="mt-4 text-center text-sm text-gray-600">
//             Already have an account?{" "}
//             <Link to="/login" className="text-indigo-600 underline">
//               Login
//             </Link>
//           </p>
//         </form>
//       )}
//     </div>
//   );
// }

// export default Register;

