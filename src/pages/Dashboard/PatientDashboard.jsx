import { useEffect, useState } from "react";

export default function PatientDashboard() {
  const [patient, setPatient] = useState({});
  const [totalAppointments, setTotalAppointments] = useState(0);

  useEffect(() => {
    // Load logged-in patient from localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    setPatient(currentUser);

    // Calculate total appointments for the current patient
    // Ensure uniqueId is used to fetch patient-specific history
    const patientHistoryKey = `patientHistory_${currentUser.uniqueId}`;
    const patientAppointments = JSON.parse(localStorage.getItem(patientHistoryKey) || "[]");
    setTotalAppointments(patientAppointments.length);

  }, []);

  return (
    // Outermost div: Consistent styling with other dashboard content pages
    // This div should NOT contain any header elements like "Welcome, Patient" or Logout button
    <div className="flex flex-col bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
      <h2 className="text-3xl font-extrabold text-indigo-800 mb-6 border-b-4 border-indigo-200 pb-2">
        <span className="inline-block mr-2 text-indigo-600">👤</span> Patient Overview
      </h2>

      <p className="text-lg font-semibold text-gray-800 mb-6">
        Welcome, <span className="text-indigo-600 font-bold">{patient.name || "Patient"}</span>!
        <br />
        Here's a summary of your activity.
      </p>

      {/* Stats Card - Total Appointments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300 border-b-4 border-purple-400">
          <p className="text-lg text-purple-800 font-bold mb-2">Total Appointments Booked</p>
          <h3 className="text-5xl font-extrabold text-purple-700">{totalAppointments}</h3>
        </div>
        {/* You can add more patient-specific stats here, e.g., upcoming appointments */}
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300 border-b-4 border-yellow-400">
            <p className="text-lg text-yellow-800 font-bold mb-2">Upcoming Appointments</p>
            <h3 className="text-5xl font-extrabold text-yellow-700">0</h3> {/* Placeholder */}
        </div>
      </div>

      {/* Quick Links/Call to Action */}
      <div className="flex-grow bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200 text-center">
        <h3 className="text-xl font-bold text-indigo-700 mb-4">Ready to book an appointment?</h3>
        <p className="text-gray-700 mb-6">Explore available doctors and their slots.</p>
        {/* This button will navigate to the Book Appointment page */}
        <button
          onClick={() => window.location.href = "/patient/book"} // Using window.location for simplicity, react-router-dom navigate is better
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Book New Appointment
        </button>
      </div>
    </div>
  );
}
