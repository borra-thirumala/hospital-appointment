import { useState, useEffect } from "react";

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
    localStorage.setItem(key, "[]"); // Attempt to fix localStorage if corrupted
    return [];
  }
};

export default function PatientHistory() {
  const [history, setHistory] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const patientUniqueId = currentUser.uniqueId;
  const patientHistoryKey = `patientHistory_${patientUniqueId}`;

  useEffect(() => {
    // Load patient history from localStorage
    const storedHistory = getLocalStorageArray(patientHistoryKey);
    setHistory(storedHistory);
  }, [patientHistoryKey]);

  const handleCancelClick = (appointment) => {
    setAppointmentToCancel(appointment);
    setShowConfirmModal(true);
    setSuccessMsg("");
    setErrorMsg("");
  };

  const confirmCancel = () => {
    if (appointmentToCancel) {
      const updatedHistory = history.map((item) =>
        item.id === appointmentToCancel.id
          ? { ...item, status: "Cancelled", cancelledAt: new Date().toISOString() }
          : item
      );
      localStorage.setItem(patientHistoryKey, JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
      setSuccessMsg(`Appointment with Dr. ${appointmentToCancel.doctor} on ${appointmentToCancel.slot} has been cancelled.`);
      setErrorMsg("");

      // In a more complex system, you would also update the doctor's available slots
      // in their specific localStorage key (e.g., doctorSlots_docId).
      // For this frontend-only app with mockDoctors, directly updating mockDoctors
      // for availability would be complex and not persistent across sessions for mock data.
      // So, we focus on updating the patient's history record.
    }
    setShowConfirmModal(false);
    setAppointmentToCancel(null);
  };

  const cancelConfirmation = () => {
    setShowConfirmModal(false);
    setAppointmentToCancel(null);
  };

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg p-6 min-h-[calc(100vh-144px)]">
      <h2 className="text-3xl font-extrabold text-indigo-800 mb-6 border-b-4 border-indigo-200 pb-2">
        <span className="inline-block mr-2 text-indigo-600">📜</span> My Consultation History
      </h2>

      <p className="text-lg font-semibold text-gray-800 mb-6">
        Here's a record of all your past and upcoming appointments.
      </p>

      {successMsg && (
        <div className="mt-4 bg-green-100 text-green-800 p-4 rounded-lg border border-green-300 shadow-sm">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mt-4 bg-red-100 text-red-700 p-4 rounded-lg border border-red-300 shadow-sm">
          {errorMsg}
        </div>
      )}

      <div className="flex-grow bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200">
        <h3 className="text-xl font-bold text-indigo-700 mb-4 border-b-2 border-indigo-100 pb-2">
          Your Appointments
        </h3>
        {history.length === 0 ? (
          <p className="text-gray-600 italic text-base mt-4 text-center py-6">You have no appointments booked yet.</p>
        ) : (
          <ul className="space-y-4 mt-4">
            {history.map((item) => (
              <li
                key={item.id}
                className={`shadow p-4 rounded-lg flex flex-col md:flex-row md:justify-between md:items-center transform hover:translate-x-1 transition-transform duration-200
                  ${item.status === "Cancelled" ? "bg-red-100 border-l-4 border-red-600 opacity-70" : "bg-white border-l-4 border-blue-600"}`
                }
              >
                <div>
                  <p className="font-semibold text-gray-800 text-lg">
                    Dr. {item.doctor} - <span className="text-indigo-600">{item.specialization}</span>
                  </p>
                  <p className="text-sm text-gray-700">
                    🏥 {item.hospital} | 📅 {item.slot}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: <span className={`font-bold ${item.status === "Cancelled" ? "text-red-700" : "text-green-700"}`}>
                      {item.status || "Confirmed"}
                    </span>
                    {item.status === "Cancelled" && item.cancelledAt && (
                      <span className="text-xs text-gray-500 ml-2">(on {new Date(item.cancelledAt).toLocaleString()})</span>
                    )}
                  </p>
                </div>
                <div className="mt-2 md:mt-0 md:text-right">
                  <p className="text-green-700 font-bold text-lg">Fee: ₹{item.fee}</p>
                  {item.status !== "Cancelled" && (
                    <button
                      onClick={() => handleCancelClick(item)}
                      className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md"
                    >
                      Cancel Appointment
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && appointmentToCancel && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Cancellation</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to cancel your appointment with{" "}
              <strong className="text-red-600">Dr. {appointmentToCancel.doctor}</strong> on{" "}
              <strong className="text-red-600">{appointmentToCancel.slot}</strong>?
              <br />
              This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmCancel}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md"
              >
                Yes, Cancel
              </button>
              <button
                onClick={cancelConfirmation}
                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors duration-200 shadow-md"
              >
                Keep Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

