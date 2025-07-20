import { useState, useEffect } from "react"; // Re-import useState and useEffect

// Helper function to safely get and parse an array from localStorage
const getLocalStorageArray = (key) => {
  try {
    const item = localStorage.getItem(key);
    console.log(`[getLocalStorageArray] Key: "${key}", Raw item:`, item); // Debug log
    if (item === null || item === undefined || item.trim() === "") {
      console.log(`[getLocalStorageArray] Key: "${key}" is empty/null, returning [].`); // Debug log
      return [];
    }
    const parsed = JSON.parse(item);
    console.log(`[getLocalStorageArray] Key: "${key}", Parsed item:`, parsed, `(Is Array: ${Array.isArray(parsed)})`); // Debug log
    if (Array.isArray(parsed)) {
      return parsed;
    } else {
      console.warn(`[getLocalStorageArray] Key: "${key}" parsed as non-array (${typeof parsed}), attempting to fix localStorage.`);
      localStorage.setItem(key, "[]"); // Force it to be an empty array string
      return [];
    }
  } catch (error) {
    console.error(`[getLocalStorageArray] Error parsing localStorage key "${key}":`, error);
    localStorage.setItem(key, "[]"); // Force it to be an empty array string on error
    return [];
  }
};

export default function RevenueReports() {
  const [totalHospitalRevenue, setTotalHospitalRevenue] = useState(0);
  const [revenuePerDoctor, setRevenuePerDoctor] = useState({});
  const [revenuePerDepartment, setRevenuePerDepartment] = {};

  // Initialize departments state as an empty array directly.
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    console.log("[RevenueReports useEffect] Component mounted. Loading data...");

    // Load departments here, AFTER the component has safely mounted with []
    const loadedDepartments = getLocalStorageArray("departments");
    setDepartments(loadedDepartments);
    console.log("[RevenueReports useEffect] Loaded departments state AFTER setDepartments:", loadedDepartments, `(Is Array: ${Array.isArray(loadedDepartments)})`);

    let overallHospitalRevenue = 0;
    const doctorRevenueBreakdown = {};
    const departmentRevenueBreakdown = {};

    const allPatientHistoryKeys = Object.keys(localStorage).filter(key => key.startsWith("patientHistory_"));
    console.log("[RevenueReports] Found patient history keys:", allPatientHistoryKeys); // Debug log

    allPatientHistoryKeys.forEach(key => {
      const patientRecords = getLocalStorageArray(key);
      console.log(`[RevenueReports] Processing key "${key}", records:`, patientRecords); // Debug log
      if (Array.isArray(patientRecords)) {
        patientRecords.forEach(record => {
          // Add a check to ensure 'fee' exists and is a number
          if (typeof record.fee === 'number' && record.fee > 0) {
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
            console.log(`[RevenueReports] Processed record: Doctor ${record.doctor}, Fee ${record.fee}, Hospital Share ${hospitalShare}`); // Debug log
          } else {
            console.warn(`[RevenueReports] Skipping record due to invalid fee or missing:`, record); // Warn for invalid fee
          }
        });
      }
    });

    setTotalHospitalRevenue(Math.round(overallHospitalRevenue));
    setRevenuePerDoctor(doctorRevenueBreakdown);
    setRevenuePerDepartment(departmentRevenueBreakdown);

    console.log("[RevenueReports] Final Total Hospital Revenue:", Math.round(overallHospitalRevenue)); // Debug log
    console.log("[RevenueReports] Final Revenue Per Doctor:", doctorRevenueBreakdown); // Debug log
    console.log("[RevenueReports] Final Revenue Per Department:", departmentRevenueBreakdown); // Debug log

  }, []); // Empty dependency array means this runs once on mount

  const getDepartmentName = (specialization) => {
    if (!Array.isArray(departments)) {
      console.warn("getDepartmentName: 'departments' is not an array during lookup, defaulting to specialization.");
      return specialization;
    }

    const dept = departments.find(d => d.name === specialization);
    return dept ? dept.name : specialization;
  };

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg p-6 min-h-[calc(100vh-144px)]">
      <h2 className="text-3xl font-extrabold text-indigo-800 mb-6 border-b-4 border-indigo-200 pb-2">
        <span className="inline-block mr-2 text-indigo-600">📈</span> Hospital Revenue Reports
      </h2>

      <p className="text-lg font-semibold text-gray-800 mb-6">
        Detailed breakdown of hospital revenue from consultations.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                  <strong className="text-base text-gray-800">{getDepartmentName(department)}</strong>
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
