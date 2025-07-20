// src/pages/Dashboard/admin/ManageHospitals.jsx
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

export default function ManageHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [form, setForm] = useState({
    name: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [hospitalToDelete, setHospitalToDelete] = useState(null);

  useEffect(() => {
    // Load existing hospitals from localStorage when component mounts
    const savedHospitals = getLocalStorageArray("hospitals");
    setHospitals(savedHospitals);
  }, []);

  // Save hospitals to localStorage whenever the 'hospitals' state changes
  useEffect(() => {
    localStorage.setItem("hospitals", JSON.stringify(hospitals));
  }, [hospitals]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(""); // Clear error on input change
    setSuccessMsg(""); // Clear success message on input change
  };

  const handleAddHospital = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const { name, location } = form;

    if (!name || !location) {
      setError("Hospital name and location are required.");
      return;
    }

    // Check for duplicate hospital name
    const isDuplicate = hospitals.some(
      (hosp) => hosp.name.toLowerCase() === name.toLowerCase()
    );
    if (isDuplicate) {
      setError(`Hospital "${name}" already exists.`);
      return;
    }

    const newHospital = {
      id: `hosp_${Date.now()}`, // Unique ID for the hospital
      name: name,
      location: location,
    };

    setHospitals((prevHospitals) => [...prevHospitals, newHospital]);
    setSuccessMsg(`Hospital "${name}" added successfully.`);
    setForm({ name: "", location: "" }); // Reset form
  };

  const handleDeleteClick = (hospital) => {
    setHospitalToDelete(hospital);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    if (hospitalToDelete) {
      // Before deleting a hospital, check if any departments or doctor slots are linked to it.
      const departments = getLocalStorageArray("departments");
      const linkedDepartments = departments.filter(dept => dept.hospitalId === hospitalToDelete.id);

      if (linkedDepartments.length > 0) {
        setError(`Cannot delete "${hospitalToDelete.name}". It has ${linkedDepartments.length} linked department(s). Please delete departments first.`);
        setSuccessMsg("");
        setShowConfirmModal(false);
        setHospitalToDelete(null);
        return;
      }

      // In a real app, you'd also check doctor slots. For this frontend, we'll assume
      // deleting departments is the primary block.

      setHospitals((prevHospitals) =>
        prevHospitals.filter((hosp) => hosp.id !== hospitalToDelete.id)
      );
      setSuccessMsg(`Hospital "${hospitalToDelete.name}" deleted successfully.`);
      setError("");
    }
    setShowConfirmModal(false);
    setHospitalToDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setHospitalToDelete(null);
  };

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg p-6 min-h-[calc(100vh-144px)]">
      <h2 className="text-3xl font-extrabold text-indigo-800 mb-6 border-b-4 border-indigo-200 pb-2">
        <span className="inline-block mr-2 text-indigo-600">🏥</span> Manage Hospitals
      </h2>

      {/* Add Hospital Form */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200 mb-8">
        <h3 className="text-xl font-bold text-indigo-700 mb-4 border-b-2 border-indigo-100 pb-2">
          Add New Hospital
        </h3>
        <form onSubmit={handleAddHospital} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Hospital Name (e.g., City Hospital)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
            required
          />
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location (e.g., Hyderabad)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
            required
          />

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg border border-red-300 shadow-sm">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-100 text-green-800 p-3 rounded-lg border border-green-300 shadow-sm">
              {successMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md transform hover:scale-105"
          >
            Add Hospital
          </button>
        </form>
      </div>

      {/* Existing Hospitals List */}
      <div className="flex-grow bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200">
        <h3 className="text-xl font-bold text-indigo-700 mb-4 border-b-2 border-indigo-100 pb-2">
          Registered Hospitals
        </h3>
        {hospitals.length === 0 ? (
          <p className="text-gray-600 italic text-base mt-4 text-center py-6">No hospitals registered yet.</p>
        ) : (
          <ul className="space-y-4 mt-4">
            {hospitals.map((hosp) => (
              <li
                key={hosp.id}
                className="bg-white shadow p-4 rounded-lg border-l-4 border-blue-500 flex flex-col md:flex-row md:justify-between md:items-center transform hover:translate-x-1 transition-transform duration-200"
              >
                <div>
                  <strong className="text-lg text-gray-800">{hosp.name}</strong>
                  <p className="text-sm text-gray-600">Location: {hosp.location}</p>
                </div>
                <button
                  onClick={() => handleDeleteClick(hosp)}
                  className="mt-3 md:mt-0 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && hospitalToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete hospital "<strong className="text-red-600">{hospitalToDelete.name}</strong>"?
              <br/>
              This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors duration-200 shadow-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}