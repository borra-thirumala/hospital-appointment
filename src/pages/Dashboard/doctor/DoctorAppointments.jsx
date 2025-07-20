import { useEffect, useState } from "react";
// REMOVED: import DashboardLayout from "../../../layout/DashboardLayout"; // This line should be removed

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Load logged-in doctor from localStorage using 'currentUser'
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const doctorName = currentUser.name;

    const allKeys = Object.keys(localStorage);
    const patientHistoryKeys = allKeys.filter((key) =>
      key.startsWith("patientHistory_")
    );

    let allAppointments = [];

    patientHistoryKeys.forEach((key) => {
      const records = JSON.parse(localStorage.getItem(key) || "[]");
      const doctorAppointments = records.filter(
        (app) => app.doctor === doctorName
      );
      allAppointments.push(...doctorAppointments);
    });

    setAppointments(allAppointments);
  }, []);

  return (
    // REMOVED: max-w-5xl mx-auto from the className below.
    // The DashboardLayout will now control the max-width and centering.
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">
        📅 My Patient Appointments
      </h2>

      {appointments.length === 0 ? (
        <p className="text-gray-600">No appointments found yet.</p>
      ) : (
        <table className="w-full table-auto border mt-4">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-2 text-left">Patient</th>
              <th className="p-2 text-left">Specialization</th>
              <th className="p-2 text-left">Hospital</th>
              <th className="p-2 text-left">Slot</th>
              <th className="p-2 text-left">Fee</th>
              <th className="p-2 text-left">Booked At</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((app, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{app.patient || "Anonymous"}</td>
                <td className="p-2">{app.specialization}</td>
                <td className="p-2">{app.hospital}</td>
                <td className="p-2">
                  {app.slot} {/* Assuming app.slot contains date and time */}
                </td>
                <td className="p-2">₹{app.fee}</td>
                <td className="p-2">
                  {new Date(app.bookedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

