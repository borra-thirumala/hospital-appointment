import React, { useEffect, useState } from "react";

const AdminOverview = () => {
  const [summary, setSummary] = useState({
    hospitals: 0,
    departments: 0,
    doctors: 0,
    patients: 0,
    appointments: 0,
    revenue: 0,
  });

  useEffect(() => {
    const departments = JSON.parse(localStorage.getItem("departments")) || [];
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    const doctors = users.filter((u) => u.role === "doctor");
    const patients = users.filter((u) => u.role === "patient");

    const revenue = appointments.reduce((sum, appt) => sum + (appt.fee || 0), 0);

    setSummary({
      hospitals: 1, // Assuming 1 hospital
      departments: departments.length,
      doctors: doctors.length,
      patients: patients.length,
      appointments: appointments.length,
      revenue,
    });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(summary).map(([key, value]) => (
          <div key={key} className="bg-white shadow-md rounded-xl p-4 text-center">
            <h3 className="text-lg font-semibold capitalize">{key}</h3>
            <p className="text-2xl font-bold text-blue-600">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
