import DashboardLayout from "../../layout/DashboardLayout.jsx";

function DoctorEarnings() {
  // Mock data for now
  const totalConsultations = 12;
  const totalEarnings = 7200; // INR

  const earningsByHospital = [
    { hospital: "Apollo", consultations: 5, earnings: 3000 },
    { hospital: "Rainbow", consultations: 7, earnings: 4200 },
  ];

  return (
    <DashboardLayout role="doctor">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6">💰 My Earnings</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-100 p-4 rounded text-center shadow">
            <h3 className="text-xl font-semibold text-green-800">Total Consultations</h3>
            <p className="text-3xl font-bold mt-2">{totalConsultations}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded text-center shadow">
            <h3 className="text-xl font-semibold text-yellow-800">Total Earnings</h3>
            <p className="text-3xl font-bold mt-2">₹{totalEarnings}</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4 text-gray-800">Earnings by Hospital</h3>
        <table className="w-full table-auto border-collapse bg-white shadow rounded overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Hospital</th>
              <th className="px-4 py-2">Consultations</th>
              <th className="px-4 py-2">Earnings (₹)</th>
            </tr>
          </thead>
          <tbody>
            {earningsByHospital.map((entry, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{entry.hospital}</td>
                <td className="px-4 py-2">{entry.consultations}</td>
                <td className="px-4 py-2 font-medium text-green-700">₹{entry.earnings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default DoctorEarnings;
