import { useEffect, useState } from "react";
import DashboardLayout from "../../../layout/DashboardLayout";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Get all appointments booked by patients from localStorage
    const all = JSON.parse(localStorage.getItem("patientHistory") || "[]");

    // Get currently logged-in doctor name from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Filter only those appointments that belong to this doctor
    const myAppointments = all.filter((appt) => appt.doctor === user.name);
    setAppointments(myAppointments);
  }, []);

  return (
    <DashboardLayout role="doctor">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6">
          📅 My Appointments
        </h2>

        {appointments.length === 0 ? (
          <p className="text-gray-600">No appointments yet.</p>
        ) : (
          <ul className="space-y-4">
            {appointments.map((appt, idx) => (
              <li
                key={idx}
                className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded"
              >
                <p className="font-semibold text-lg">🧑 Patient Appointment</p>
                <p className="text-gray-700">
                  {appt.specialization} @ {appt.hospital}
                </p>
                <p className="text-gray-600">🕒 {appt.slot}</p>
                <p className="text-green-700 font-medium">💰 ₹{appt.fee}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
}








// // src/pages/Dashboard/doctor/DoctorAppointments.jsx
// import DashboardLayout from "../../../layout/DashboardLayout";
// import { useEffect, useState } from "react";

// export default function DoctorAppointments() {
//   const [appointments, setAppointments] = useState([]);

//   useEffect(() => {
//     const all = JSON.parse(localStorage.getItem("patientHistory") || "[]");

//     // mock current doctor name (in real case, get from context/localStorage)
//     const doctorName = "Dr. Arjun Rao";

//     const doctorAppointments = all.filter(a => a.doctor === doctorName);
//     setAppointments(doctorAppointments);
//   }, []);

//   return (
//     <DashboardLayout role="doctor">
//       <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
//         <h2 className="text-3xl font-bold text-indigo-700 mb-6">
//           📅 My Appointments
//         </h2>

//         {appointments.length === 0 ? (
//           <p className="text-gray-600">No appointments yet.</p>
//         ) : (
//           <ul className="space-y-4">
//             {appointments.map((appt, idx) => (
//               <li key={idx} className="border-l-4 border-green-600 bg-green-50 p-4 rounded">
//                 <p><strong>Patient:</strong> [Mock Patient]</p>
//                 <p><strong>Hospital:</strong> {appt.hospital}</p>
//                 <p><strong>Slot:</strong> {appt.slot}</p>
//                 <p className="text-green-700 font-semibold">Fee: ₹{appt.fee}</p>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }
