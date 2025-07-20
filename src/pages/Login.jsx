// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any previous messages on component mount
    setError("");
    setSuccessMsg("");
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("token", "dummy-jwt-token"); // Store a dummy token for ProtectedRoute
      setSuccessMsg("Login successful!");

      // Navigate based on user role
      if (user.role === "doctor") {
        navigate("/doctor/dashboard");
      } else if (user.role === "patient") {
        navigate("/patient/dashboard");
      } else if (user.role === "hospitalAdmin") {
        navigate("/admin/dashboard");
      } else {
        // Fallback for unknown roles
        navigate("/");
      }
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    // Main container: Full screen, centered, with a subtle gradient background
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4 sm:p-6">
      {/* Login Card: Modern, rounded, with shadow and subtle background */}
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-[1.01]">
        {/* Title and Icon */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-indigo-800 mb-2 tracking-tight">
            <span className="inline-block mr-2 text-indigo-600">🏥</span> Login
          </h1>
          <p className="text-gray-600 text-lg">Access your Hospital Appointment System</p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 border border-red-300 shadow-sm text-center">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6 border border-green-300 shadow-sm text-center">
            {successMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm text-gray-800"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm text-gray-800"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-lg transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-75 font-semibold text-lg"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-gray-600 mt-6 text-base">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200 focus:outline-none"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}


// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

// const Login = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("patient"); // Default role set to patient
//   const [error, setError] = useState("");

//   const handleLogin = (e) => {
//     e.preventDefault();

//     // Retrieve users from local storage
//     const users = JSON.parse(localStorage.getItem("users")) || [];

//     // --- DEBUGGING LOGS START ---
//     console.log("--- Login Attempt ---");
//     console.log("Attempting to log in with:");
//     console.log("Email:", email);
//     console.log("Password:", password);
//     console.log("Selected Role:", role);
//     console.log("Users currently in localStorage:", users);
//     // --- DEBUGGING LOGS END ---

//     // Find a user that matches the provided email, password, and selected role
//     const existingUser = users.find(
//       (user) => user.email === email && user.password === password && user.role === role
//     );

//     // --- DEBUGGING LOGS START ---
//     console.log("Found User (if any):", existingUser);
//     // --- DEBUGGING LOGS END ---

//     if (existingUser) {
//       // If user found, store current user in local storage
//       localStorage.setItem("currentUser", JSON.stringify(existingUser));
//       setError(""); // Clear any previous errors

//       // Navigate based on the user's role
//       if (role === "doctor") {
//         navigate("/doctor/dashboard");
//       } else if (role === "patient") {
//         // Corrected path to match the App.jsx route
//         navigate("/patient/dashboard");
//       } else if (role === "admin") {
//         navigate("/admin/dashboard");
//       }
//     } else {
//       // If no matching user found, set an error message
//       setError("Invalid credentials or role");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-200">
//       <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Login to Your Account</h2>

//         {error && (
//           <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleLogin} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
//             <input
//               type="email"
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
//             <input
//               type="password"
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-1">Select Role</label>
//             <select
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//             >
//               <option value="patient">Patient</option>
//               <option value="doctor">Doctor</option>
//               <option value="hospitalAdmin">Hospital Admin</option>
//             </select>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
//           >
//             Login
//           </button>
//         </form>

//         <p className="text-center mt-4 text-sm text-gray-600">
//           Don't have an account?{" "}
//           <Link to="/register" className="text-blue-600 font-medium hover:underline">
//             Register here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

