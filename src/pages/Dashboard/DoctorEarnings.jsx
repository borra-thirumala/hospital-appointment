import { useEffect, useState } from "react";
// REMOVED: import DashboardLayout from "../../layout/DashboardLayout"; // This line should be removed

const DoctorEarnings = () => {
  const [appointments, setAppointments] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [hospitalBreakdown, setHospitalBreakdown] = useState({});
  const [doctorName, setDoctorName] = useState("");

  useEffect(() => {
    // Load logged-in doctor from localStorage using 'currentUser'
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const doctor = currentUser?.name || "Unknown";
    setDoctorName(doctor);

    // Collect all keys that match "patientHistory_*"
    const allKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("patientHistory_")
    );

    let allAppointments = [];

    for (const key of allKeys) {
      const records = JSON.parse(localStorage.getItem(key) || "[]");
      // Filter records by the logged-in doctor's name
      const doctorRecords = records.filter((r) => r.doctor === doctor);
      allAppointments = [...allAppointments, ...doctorRecords];
    }

    setAppointments(allAppointments);

    // Earnings: 60% of total fee
    const total = allAppointments.reduce((sum, r) => sum + r.fee, 0);
    const earnings = Math.round((total * 60) / 100);
    setTotalEarnings(earnings);

    // Per hospital breakdown
    const breakdown = {};
    for (const r of allAppointments) {
      if (!breakdown[r.hospital]) breakdown[r.hospital] = 0;
      breakdown[r.hospital] += r.fee;
    }

    setHospitalBreakdown(breakdown);
  }, []);

  return (
    // Outermost div: Removed max-w-3xl mx-auto, p-6, rounded-xl, shadow.
    // Added flex-col, bg, shadow, p-6, rounded.
    <div className="flex flex-col bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
      <h2 className="text-3xl font-extrabold text-indigo-800 mb-6 border-b-4 border-indigo-200 pb-2">
        <span className="inline-block mr-2 text-indigo-600">💼</span> Doctor Earnings
      </h2>

      {/* Summary Cards - Similar to Doctor Dashboard stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300 border-b-4 border-green-400">
          <p className="text-lg text-green-800 font-bold mb-2">Total Appointments</p>
          <h3 className="text-5xl font-extrabold text-green-700">{appointments.length}</h3>
        </div>

        <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300 border-b-4 border-blue-400">
          <p className="text-lg text-blue-800 font-bold mb-2">Total Earnings (60% Share)</p>
          <h3 className="text-5xl font-extrabold text-blue-700">
            ₹{totalEarnings.toLocaleString()}
          </h3>
        </div>
      </div>

      {/* Earnings Per Hospital Section - Enhanced styling */}
      <div className="flex-grow bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200">
        <h3 className="text-xl font-bold text-indigo-700 mb-4 border-b-2 border-indigo-100 pb-2">
          🏥 Earnings Breakdown by Hospital
        </h3>
        {Object.entries(hospitalBreakdown).length === 0 ? (
          <p className="text-gray-600 italic text-base text-center py-6">No earnings data available yet from any hospital.</p>
        ) : (
          <ul className="space-y-4 mt-4">
            {Object.entries(hospitalBreakdown).map(([hospital, amount]) => (
              <li
                key={hospital}
                className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md border border-gray-200 transform hover:translate-x-1 transition-transform duration-200"
              >
                <strong className="text-lg text-gray-800">{hospital}</strong>
                <span className="text-xl font-bold text-green-600">₹{Math.round((amount * 60) / 100).toLocaleString()}</span> {/* Display 60% share here too */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DoctorEarnings;

