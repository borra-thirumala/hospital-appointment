import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState({});
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Load logged-in doctor from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setDoctor(user);

    // 🧪 Sample mock appointment data
    const mockAppointments = [
      { hospital: "Apollo", date: "2025-07-18", fee: 500 },
      { hospital: "Rainbow", date: "2025-07-19", fee: 600 },
      { hospital: "Apollo", date: "2025-07-20", fee: 500 },
    ];
    setAppointments(mockAppointments);
  }, []);

  // Calculate earnings: 60% goes to doctor
  const totalEarnings = appointments.reduce((sum, appt) => sum + appt.fee * 0.6, 0);
  const earningsPerHospital = appointments.reduce((acc, appt) => {
    acc[appt.hospital] = (acc[appt.hospital] || 0) + appt.fee * 0.6;
    return acc;
  }, {});

  return (
    <DashboardLayout role="doctor">
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6">
          👨‍⚕️ Doctor Dashboard
        </h2>

        <p className="text-xl font-semibold mb-4">
          Welcome, {doctor.name || "Doctor"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-100 p-4 rounded shadow">
            <p className="text-gray-600">Total Appointments</p>
            <h3 className="text-2xl font-bold">{appointments.length}</h3>
          </div>

          <div className="bg-blue-100 p-4 rounded shadow">
            <p className="text-gray-600">Total Earnings (60%)</p>
            <h3 className="text-2xl font-bold text-green-700">
              ₹{totalEarnings}
            </h3>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">
            💼 Earnings Per Hospital
          </h4>
          {Object.keys(earningsPerHospital).length === 0 ? (
            <p className="text-gray-500">No earnings yet.</p>
          ) : (
            <ul className="space-y-2">
              {Object.entries(earningsPerHospital).map(([hospital, amount]) => (
                <li key={hospital} className="p-3 bg-gray-100 rounded">
                  <strong>{hospital}</strong>: ₹{amount}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}




// import DashboardLayout from "../../layout/DashboardLayout";
// import { useEffect, useState } from "react";

// export default function DoctorDashboard() {
//   const [appointments, setAppointments] = useState([]);

//   useEffect(() => {
//     const all = JSON.parse(localStorage.getItem("patientHistory") || "[]");
//     const doctorName = "Dr. Arjun Rao"; // Mock current doctor name
//     const doctorAppointments = all.filter((a) => a.doctor === doctorName);
//     setAppointments(doctorAppointments);
//   }, []);

//   const totalEarnings = appointments.reduce((sum, a) => sum + (a.fee * 0.6), 0);

//   return (
//     <DashboardLayout role="doctor">
//       <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
//         <h2 className="text-3xl font-bold text-indigo-700 mb-6">👨‍⚕️ Doctor Dashboard</h2>

//         <div className="grid grid-cols-2 gap-4">
//           <div className="bg-blue-100 p-4 rounded shadow text-center">
//             <p className="text-xl font-semibold">Total Bookings</p>
//             <p className="text-3xl text-blue-700 font-bold">{appointments.length}</p>
//           </div>
//           <div className="bg-green-100 p-4 rounded shadow text-center">
//             <p className="text-xl font-semibold">Total Earnings</p>
//             <p className="text-3xl text-green-700 font-bold">₹{totalEarnings.toFixed(2)}</p>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }
