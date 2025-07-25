import { useEffect, useState } from "react";

// Helper function to safely get and parse an array from localStorage
const getLocalStorageArray = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === undefined || item.trim() === "") {
      return [];
    }
    const parsed = JSON.parse(item);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    return [];
  }
};

export default function AdminDashboard() {
  const [admin, setAdmin] = useState({});
  const [totalHospitalDoctors, setTotalHospitalDoctors] = useState(0);
  const [totalHospitalConsultations, setTotalHospitalConsultations] = useState(0);
  const [totalHospitalRevenue, setTotalHospitalRevenue] = useState(0);
  const [revenuePerDoctor, setRevenuePerDoctor] = useState({});
  const [revenuePerDepartment, setRevenuePerDepartment] = {};

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    setAdmin(currentUser);

    // 🧪 Ensure mock data is always stored as arrays
    // This is where initial hospitals data is set if not present or malformed.
    const mockHospitals = [
      { id: "hosp_1", name: "Apollo Hospital", location: "Hyderabad" },
      { id: "hosp_2", name: "Rainbow Children’s Hospital", location: "Bangalore" },
      { id: "hosp_3", name: "City General Hospital", location: "Chennai" },
    ];
    // Check if 'hospitals' is not set OR if it's set but not a valid array
    const currentHospitals = getLocalStorageArray("hospitals");
    if (currentHospitals.length === 0 || !Array.isArray(currentHospitals)) {
      localStorage.setItem("hospitals", JSON.stringify(mockHospitals));
      console.log("AdminDashboard: Initialized 'hospitals' in localStorage.");
    }

    const mockDepartments = [
      { id: "dept_1", name: "Cardiology", hospitalId: "hosp_1" },
      { id: "dept_2", name: "Pediatrics", hospitalId: "hosp_2" },
      { id: "dept_3", name: "Orthopedics", hospitalId: "hosp_1" },
      { id: "dept_4", name: "General Medicine", hospitalId: "hosp_3" },
    ];
    const currentDepartments = getLocalStorageArray("departments");
    if (currentDepartments.length === 0 || !Array.isArray(currentDepartments)) {
      localStorage.setItem("departments", JSON.stringify(mockDepartments));
      console.log("AdminDashboard: Initialized 'departments' in localStorage.");
    }

    // --- Calculate Admin Dashboard Metrics ---
    const allDoctors = getLocalStorageArray("users").filter(user => user.role === "doctor");
    setTotalHospitalDoctors(allDoctors.length);

    let overallConsultations = 0;
    let overallHospitalRevenue = 0;
    const doctorRevenueBreakdown = {};
    const departmentRevenueBreakdown = {};

    const allPatientHistoryKeys = Object.keys(localStorage).filter(key => key.startsWith("patientHistory_"));

    allPatientHistoryKeys.forEach(key => {
      const patientRecords = getLocalStorageArray(key);
      if (Array.isArray(patientRecords)) {
        patientRecords.forEach(record => {
          overallConsultations++;
          const hospitalShare = record.fee * 0.4;
          overallHospitalRevenue += hospitalShare;

          if (!doctorRevenueBreakdown[record.doctor]) {
            doctorRevenueBreakdown[record.doctor] = 0;
          }
          doctorRevenueBreakdown[record.doctor] += hospitalShare;

          const departmentName = record.specialization;
          if (!departmentRevenueBreakdown[departmentName]) {
            departmentRevenueBreakdown[departmentName] = 0;
          }
          departmentRevenueBreakdown[departmentName] += hospitalShare;
        });
      }
    });

    setTotalHospitalConsultations(overallConsultations);
    setTotalHospitalRevenue(Math.round(overallHospitalRevenue));
    setRevenuePerDoctor(doctorRevenueBreakdown);
    setRevenuePerDepartment(departmentRevenueBreakdown);

  }, []);

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg p-6 min-h-[calc(100vh-144px)]">
      <h2 className="text-3xl font-extrabold text-indigo-800 mb-6 border-b-4 border-indigo-200 pb-2">
        <span className="inline-block mr-2 text-indigo-600">🏢</span> Hospital Admin Overview
      </h2>

      <p className="text-lg font-semibold text-gray-800 mb-6">
        Welcome, <span className="text-indigo-600 font-bold">{admin.name || "Admin"}</span>!
        <br />
        Here's a summary of your hospital's performance.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300 border-b-4 border-blue-400">
          <p className="text-lg text-blue-800 font-bold mb-2">Total Doctors</p>
          <h3 className="text-5xl font-extrabold text-blue-700">{totalHospitalDoctors}</h3>
        </div>

        <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300 border-b-4 border-purple-400">
          <p className="text-lg text-purple-800 font-bold mb-2">Total Consultations</p>
          <h3 className="text-5xl font-extrabold text-purple-700">{totalHospitalConsultations}</h3>
        </div>

        <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300 border-b-4 border-green-400">
          <p className="text-lg text-green-800 font-bold mb-2">Total Hospital Revenue</p>
          <h3 className="text-5xl font-extrabold text-green-700">₹{totalHospitalRevenue.toLocaleString()}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
        <div className="bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200">
          <h3 className="text-xl font-bold text-indigo-700 mb-4 border-b-2 border-indigo-100 pb-2">
            💰 Revenue Per Doctor (Hospital Share)
          </h3>
          {Object.keys(revenuePerDoctor).length === 0 ? (
            <p className="text-gray-600 italic text-base mt-4 text-center py-6">No doctor revenue data yet.</p>
          ) : (
            <ul className="space-y-3 mt-4">
              {Object.entries(revenuePerDoctor).map(([doctor, amount]) => (
                <li key={doctor} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                  <strong className="text-base text-gray-800">Dr. {doctor}</strong>
                  <span className="text-lg font-bold text-green-600">₹{Math.round(amount).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200">
          <h3 className="text-xl font-bold text-indigo-700 mb-4 border-b-2 border-indigo-100 pb-2">
            📊 Revenue Per Department (Hospital Share)
          </h3>
          {Object.keys(revenuePerDepartment).length === 0 ? (
            <p className="text-gray-600 italic text-base mt-4 text-center py-6">No department revenue data yet.</p>
          ) : (
            <ul className="space-y-3 mt-4">
              {Object.entries(revenuePerDepartment).map(([department, amount]) => (
                <li key={department} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                  <strong className="text-base text-gray-800">{department}</strong>
                  <span className="text-lg font-bold text-green-600">₹{Math.round(amount).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}