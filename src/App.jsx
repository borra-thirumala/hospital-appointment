import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import DoctorDashboard from "./pages/Dashboard/DoctorDashboard";
import PatientDashboard from "./pages/Dashboard/PatientDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
// import DoctorSlots from "./pages/Dashboard/DoctorSlots.jsx";
import DoctorEarnings from "./pages/Dashboard/DoctorEarnings.jsx";
import BookAppointment from "./pages/Dashboard/BookAppointment.jsx";
import ManageSlots from "./pages/Dashboard/doctor/manageslots.jsx";
import DashboardLayout from "./layout/DashboardLayout";
import DoctorAddSlot from "./pages/Dashboard/DoctorAddSlot";
import AddSlot from "./pages/Dashboard/doctor/AddSlot";
import ViewSlots from "./pages/Dashboard/doctor/viewSlots.jsx";
import HospitalDepartments from "./pages/Dashboard/admin/HospitalDepartments";
import PatientHistory from "./pages/Dashboard/patient/History.jsx";
import DoctorAppointments from "./pages/Dashboard/doctor/DoctorAppointments.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* <Route
  path="/doctor/slots"
  element={
    <ProtectedRoute>
      <DoctorSlots />
    </ProtectedRoute>
  }
/> */}

<Route
  path="/doctor/earnings"
  element={
    <ProtectedRoute>
      <DoctorEarnings />
    </ProtectedRoute>
  }
/>

<Route
  path="/patient/book"
  element={
    <ProtectedRoute>
      <BookAppointment />
    </ProtectedRoute>
  }
/>

<Route
  path="/doctor/slots"
  element={
    <ProtectedRoute>
      <DashboardLayout role="doctor">
        <ManageSlots />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/doctor/slots/add"
  element={
    <ProtectedRoute>
      <DashboardLayout role="doctor">
        <DoctorAddSlot />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/doctor/slots/add"
  element={
    <ProtectedRoute>
      <AddSlot />           
    </ProtectedRoute>
  }
/>

<Route
  path="/doctor/slots/add"
  element={
    <ProtectedRoute>
      <AddSlot />
    </ProtectedRoute>
  }
/>

<Route
  path="/doctor/slots/view"
  element={
    <ProtectedRoute>
      <ViewSlots />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/departments"
  element={
    <ProtectedRoute>
      <HospitalDepartments />
    </ProtectedRoute>
  }
/>


<Route
  path="/patient/history"
  element={
    <ProtectedRoute>
      <PatientHistory />
    </ProtectedRoute>
  }
/>

<Route
  path="/doctor/appointments"
  element={
    <ProtectedRoute>
      <DoctorAppointments />
    </ProtectedRoute>
  }
/>




    </Routes>
  );
}

export default App;
