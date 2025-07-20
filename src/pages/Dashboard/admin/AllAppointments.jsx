// src/pages/Dashboard/admin/AllAppointments.jsx
import { useState, useEffect } from "react";

export default function AllAppointments() {
  const [allAppointments, setAllAppointments] = useState([]);
  const [totalConsultations, setTotalConsultations] = useState(0);

  useEffect(() => {
    let consultationsCount = 0;
    const loadedAppointments = [];

    // Iterate through all patientHistory_ keys in localStorage
    const allPatientHistoryKeys = Object.keys(localStorage).filter(key => key.startsWith("patientHistory_"));

    allPatientHistoryKeys.forEach(key => {
      const patientRecords = JSON.parse(localStorage.getItem(key) || "[]");
      loadedAppointments.push(...patientRecords); // Collect all records
      consultationsCount += patientRecords.length; // Count total consultations
    });

    // Sort appointments by date and time (most recent first)
    loadedAppointments.sort((a, b) => {
      const dateTimeA = new Date(`${a.slot.split(' ')[0]}T${a.slot.split(' ')[1]}`);
      const dateTimeB = new Date(`${b.slot.split(' ')[0]}T${b.slot.split(' ')[1]}`);
      return dateTimeB.getTime() - dateTimeA.getTime(); // Descending order
    });

    setAllAppointments(loadedAppointments);
    setTotalConsultations(consultationsCount);
  }, []);

  return (
    // Consistent outermost div styling
    <div className="flex flex-col bg-white rounded-xl shadow-lg p-6 min-h-[calc(100vh-144px)]">
      <h2 className="text-3xl font-extrabold text-indigo-800 mb-6 border-b-4 border-indigo-200 pb-2">
        <span className="inline-block mr-2 text-indigo-600">📋</span> All Hospital Appointments
      </h2>

      <p className="text-lg font-semibold text-gray-800 mb-6">
        Overview of all appointments booked across the hospital.
      </p>

      {/* Total Consultations Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300 border-b-4 border-purple-400">
          <p className="text-lg text-purple-800 font-bold mb-2">Total Consultations</p>
          <h3 className="text-5xl font-extrabold text-purple-700">{totalConsultations}</h3>
        </div>
      </div>

      {/* Appointments List */}
      <div className="flex-grow bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200">
        <h3 className="text-xl font-bold text-indigo-700 mb-4 border-b-2 border-indigo-100 pb-2">
          Appointment Details
        </h3>
        {allAppointments.length === 0 ? (
          <p className="text-gray-600 italic text-base mt-4 text-center py-6">No appointments found yet.</p>
        ) : (
          <ul className="space-y-4 mt-4">
            {allAppointments.map((appointment) => (
              <li
                key={appointment.id} // Use the unique ID for the key
                className="bg-white shadow p-4 rounded-lg border-l-4 border-blue-600 flex flex-col md:flex-row md:justify-between md:items-center transform hover:translate-x-1 transition-transform duration-200"
              >
                <div>
                  <p className="font-semibold text-gray-800 text-lg">
                    <span className="text-blue-700">{appointment.patient}</span> with Dr. {appointment.doctor}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="text-indigo-600">{appointment.specialization}</span> @ {appointment.hospital}
                  </p>
                  <p className="text-gray-600">📅 {appointment.slot}</p>
                </div>
                <div className="mt-2 md:mt-0 md:text-right">
                  <p className="text-green-700 font-bold text-lg">Fee: ₹{appointment.fee}</p>
                  <p className="text-xs text-gray-500">Booked: {new Date(appointment.bookedAt).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
