import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Changed BrowserRouter to HashRouter as Router
import React, { useEffect } from "react";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import DoctorDashboard from "./pages/Dashboard/DoctorDashboard";
import PatientDashboard from "./pages/Dashboard/PatientDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import BookAppointment from "./pages/Dashboard/patient/BookAppointment";

import DoctorEarnings from "./pages/Dashboard/DoctorEarnings.jsx";
import ManageSlots from "./pages/Dashboard/doctor/ManageSlots.jsx";

import DashboardLayout from "./layout/DashboardLayout";
import AddSlot from "./pages/Dashboard/doctor/AddSlot";
import ViewSlots from "./pages/Dashboard/doctor/viewSlots.jsx";
import HospitalDepartments from "./pages/Dashboard/admin/HospitalDepartments";
import PatientHistory from "./pages/Dashboard/patient/History.jsx";
import DoctorAppointments from "./pages/Dashboard/doctor/DoctorAppointments.jsx";

import ManageDoctors from "./pages/Dashboard/admin/ManageDoctors.jsx"
import AllAppointments from "./pages/Dashboard/admin/AllAppointments";
import RevenueReports from "./pages/Dashboard/admin/RevenueReports";
import ManageHospitals from "./pages/Dashboard/admin/ManageHospitals.jsx";


function App() {
  useEffect(() => {
    console.log("--- App.jsx Loaded ---");
    console.log("localStorage 'users':", localStorage.getItem("users"));
    console.log("localStorage 'currentUser':", localStorage.getItem("currentUser"));
    console.log("localStorage 'hospitals':", localStorage.getItem("hospitals"));
    console.log("localStorage 'departments':", localStorage.getItem("departments"));
  }, []);

  return (
    <Router> {/* Changed to HashRouter */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Doctor Routes - ALL wrapped in ProtectedRoute and DashboardLayout */}
        <Route path="/doctor/dashboard" element={<ProtectedRoute><DashboardLayout role="doctor"><DoctorDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/doctor/earnings" element={<ProtectedRoute><DashboardLayout role="doctor"><DoctorEarnings /></DashboardLayout></ProtectedRoute>} />
        <Route path="/doctor/slots" element={<ProtectedRoute><DashboardLayout role="doctor"><ManageSlots /></DashboardLayout></ProtectedRoute>} />
        <Route path="/doctor/slots/add" element={<ProtectedRoute><DashboardLayout role="doctor"><AddSlot /></DashboardLayout></ProtectedRoute>} />
        <Route path="/doctor/slots/view" element={<ProtectedRoute><DashboardLayout role="doctor"><ViewSlots /></DashboardLayout></ProtectedRoute>} />
        <Route path="/doctor/appointments" element={<ProtectedRoute><DashboardLayout role="doctor"><DoctorAppointments /></DashboardLayout></ProtectedRoute>} />

        {/* Patient Routes - ALL wrapped in ProtectedRoute and DashboardLayout */}
        <Route path="/patient/dashboard" element={<ProtectedRoute><DashboardLayout role="patient"><PatientDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/patient/book" element={<ProtectedRoute><DashboardLayout role="patient"><BookAppointment /></DashboardLayout></ProtectedRoute>} />
        <Route path="/patient/history" element={<ProtectedRoute><DashboardLayout role="patient"><PatientHistory /></DashboardLayout></ProtectedRoute>} />

        {/* Admin Routes - ALL wrapped in ProtectedRoute and DashboardLayout */}
        <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardLayout role="hospitalAdmin"><AdminDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/departments" element={<ProtectedRoute><DashboardLayout role="hospitalAdmin"><HospitalDepartments /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/manage-doctors" element={<ProtectedRoute><DashboardLayout role="hospitalAdmin"><ManageDoctors /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/appointments" element={<ProtectedRoute><DashboardLayout role="hospitalAdmin"><AllAppointments /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/revenue" element={<ProtectedRoute><DashboardLayout role="hospitalAdmin"><RevenueReports /></DashboardLayout></ProtectedRoute>} />
        <Route
          path="/admin/manage-hospitals"
          element={
            <ProtectedRoute>
              <DashboardLayout role="hospitalAdmin">
                <ManageHospitals />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
// import { Routes, Route, Navigate } from "react-router-dom";
// import React, { useEffect } from "react";
// // Corrected import paths as per your project structure
// import Login from "./pages/Login.jsx"; // Corrected path
// import Register from "./pages/Register.jsx"; // Corrected path

// import DoctorDashboard from "./pages/Dashboard/DoctorDashboard";
// import PatientDashboard from "./pages/Dashboard/PatientDashboard";
// import AdminDashboard from "./pages/Dashboard/AdminDashboard";
// import ProtectedRoute from "./components/ProtectedRoute";
// import BookAppointment from "./pages/Dashboard/patient/BookAppointment";

// import DoctorEarnings from "./pages/Dashboard/DoctorEarnings.jsx";
// import ManageSlots from "./pages/Dashboard/doctor/ManageSlots.jsx";

// import DashboardLayout from "./layout/DashboardLayout";
// import AddSlot from "./pages/Dashboard/doctor/AddSlot";
// import ViewSlots from "./pages/Dashboard/doctor/viewSlots.jsx";
// import HospitalDepartments from "./pages/Dashboard/admin/HospitalDepartments";
// import PatientHistory from "./pages/Dashboard/patient/History.jsx";
// import DoctorAppointments from "./pages/Dashboard/doctor/DoctorAppointments.jsx";

// import ManageDoctors from "./pages/Dashboard/admin/ManageDoctors.jsx"
// import AllAppointments from "./pages/Dashboard/admin/AllAppointments";
// import RevenueReports from "./pages/Dashboard/admin/RevenueReports";
// import ManageHospitals from "./pages/Dashboard/admin/ManageHospitals.jsx"; 
// function App() {
//   // This useEffect logs the state of localStorage when the App component mounts
//   useEffect(() => {
//     console.log("--- App.jsx Loaded ---");
//     console.log("localStorage 'users':", localStorage.getItem("users"));
//     console.log("localStorage 'currentUser':", localStorage.getItem("currentUser"));
//     // Add logs for hospitals and departments too
//     console.log("localStorage 'hospitals':", localStorage.getItem("hospitals"));
//     console.log("localStorage 'departments':", localStorage.getItem("departments"));
//   }, []);

//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/" element={<Navigate to="/login" />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />

//       {/* Doctor Routes - ALL wrapped in ProtectedRoute and DashboardLayout */}
//       <Route
//         path="/doctor/dashboard"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout role="doctor">
//               <DoctorDashboard />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/doctor/earnings"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout role="doctor">
//               <DoctorEarnings />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/doctor/slots"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout role="doctor">
//               <ManageSlots />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/doctor/slots/add"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout role="doctor">
//               <AddSlot />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/doctor/slots/view"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout role="doctor">
//               <ViewSlots />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/doctor/appointments"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout role="doctor">
//               <DoctorAppointments />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       {/* Patient Routes - ALL wrapped in ProtectedRoute and DashboardLayout */}
//       <Route
//         path="/patient/dashboard"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout role="patient">
//               <PatientDashboard />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/patient/book"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout role="patient">
//               <BookAppointment />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/patient/history"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout role="patient">
//               <PatientHistory />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       {/* Admin Routes - ALL wrapped in ProtectedRoute and DashboardLayout */}
//       <Route
//         path="/admin/dashboard"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout role="hospitalAdmin">
//               <AdminDashboard />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/admin/departments"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout role="hospitalAdmin">
//               <HospitalDepartments />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/admin/manage-doctors"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout role="hospitalAdmin">
//               <ManageDoctors />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/admin/appointments"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout role="hospitalAdmin">
//               <AllAppointments />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/admin/revenue"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout role="hospitalAdmin">
//               <RevenueReports />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//        <Route
//         path="/admin/manage-hospitals" // NEW ROUTE
//         element={
//           <ProtectedRoute>
//             <DashboardLayout role="hospitalAdmin">
//               <ManageHospitals />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//     </Routes>
//   );
// }

// export default App;

