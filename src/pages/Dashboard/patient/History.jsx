import { useState, useEffect } from "react";
import DashboardLayout from "../../../layout/DashboardLayout";

export default function PatientHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
const key = `patientHistory_${user.name || "anonymous"}`;
const stored = JSON.parse(localStorage.getItem(key) || "[]");

    setHistory(stored);
  }, []);

  return (
    <DashboardLayout role="patient">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6">
          📜 My Consultation History
        </h2>

        {history.length === 0 ? (
          <p className="text-gray-600">No consultations yet.</p>
        ) : (
          <ul className="space-y-4">
            {history.map((item, idx) => (
              <li
                key={idx}
                className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded"
              >
                <p className="font-semibold">{item.doctor}</p>
                <p className="text-sm text-gray-700">
                  {item.specialization} @ {item.hospital}
                </p>
                <p className="text-gray-600">{item.slot}</p>
                <p className="text-green-700 font-medium">Fee: ₹{item.fee}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
}
