import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { USER_KEY } from "@/utils/localKeys";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem(USER_KEY));
  const role = user?.role || "";
  const name = user?.name || "Guest";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getDashboardLink = () => {
    switch (role) {
      case "doctor":
        return "/dashboard/doctor/DoctorDashboard";
      case "patient":
        return "/dashboard/patient/PatientDashboard";
      case "admin":
        return "/dashboard/AdminDashboard";
      default:
        return "/";
    }
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md flex items-center justify-between">
      <Link to={getDashboardLink()} className="text-xl font-bold">
        🏥 Hospital System
      </Link>

      <div className="flex items-center gap-4">
        <span className="text-sm">Welcome, <strong>{name}</strong></span>
        <Button onClick={handleLogout} className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-xl text-sm">
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
