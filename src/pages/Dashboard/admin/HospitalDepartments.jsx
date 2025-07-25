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

export default function HospitalDepartments() {
  const [departments, setDepartments] = useState([]);
  const [hospitals, setHospitals] = useState([]); // To store hospitals from localStorage
  const [form, setForm] = useState({
    name: "",
    hospitalId: "",
  });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  useEffect(() => {
    // Load existing departments from localStorage
    const savedDepartments = getLocalStorageArray("departments");
    setDepartments(savedDepartments);

    // Load hospitals from localStorage
    const loadedHospitals = getLocalStorageArray("hospitals");
    setHospitals(loadedHospitals);

    // If there's only one hospital, pre-select it
    if (loadedHospitals.length === 1) {
      setForm((prevForm) => ({ ...prevForm, hospitalId: loadedHospitals[0].id }));
    }
  }, []);

  // Save departments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("departments", JSON.stringify(departments));
  }, [departments]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(""); // Clear error on input change
    setSuccessMsg(""); // Clear success message on input change
  };

  const handleAddDepartment = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const { name, hospitalId } = form;

    if (!name || !hospitalId) {
      setError("Department name and hospital are required.");
      return;
    }

    // Check for duplicate department name within the same hospital
    const isDuplicate = departments.some(
      (dept) => dept.name.toLowerCase() === name.toLowerCase() && dept.hospitalId === hospitalId
    );
    if (isDuplicate) {
      setError(`Department "${name}" already exists for this hospital.`);
      return;
    }

    const newDepartment = {
      id: `dept_${Date.now()}`, // Simple unique ID
      name: name,
      hospitalId: hospitalId,
    };

    setDepartments((prevDepartments) => [...prevDepartments, newDepartment]);
    setSuccessMsg(`Department "${name}" added successfully to ${hospitals.find(h => h.id === hospitalId)?.name}.`);
    setForm({ name: "", hospitalId: hospitals.length === 1 ? hospitals[0].id : "" }); // Reset form, pre-select if only one hospital
  };

  const getHospitalName = (id) => {
    const hospital = hospitals.find((h) => h.id === id);
    return hospital ? hospital.name : "Unknown Hospital";
  };

  const handleDeleteClick = (department) => {
    setDepartmentToDelete(department);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    if (departmentToDelete) {
      setDepartments((prevDepartments) =>
        prevDepartments.filter((dept) => dept.id !== departmentToDelete.id)
      );
      setSuccessMsg(`Department "${departmentToDelete.name}" deleted successfully.`);
      setError("");
    }
    setShowConfirmModal(false);
    setDepartmentToDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setDepartmentToDelete(null);
  };

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg p-6 min-h-[calc(100vh-144px)]">
      <h2 className="text-3xl font-extrabold text-indigo-800 mb-6 border-b-4 border-indigo-200 pb-2">
        <span className="inline-block mr-2 text-indigo-600">🏥</span> Manage Hospital Departments
      </h2>

      {/* Add Department Form */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200 mb-8">
        <h3 className="text-xl font-bold text-indigo-700 mb-4 border-b-2 border-indigo-100 pb-2">
          Add New Department
        </h3>
        <form onSubmit={handleAddDepartment} className="space-y-4">
          {hospitals.length === 0 ? (
            <p className="text-red-600 font-semibold">No hospitals registered. Please add a hospital first (via "Manage Hospitals" page).</p>
          ) : (
            <select
              name="hospitalId"
              value={form.hospitalId}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
              required
            >
              <option value="">Select Hospital</option>
              {hospitals.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          )}

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Department Name (e.g., Cardiology)"
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
            disabled={hospitals.length === 0}
          >
            Add Department
          </button>
        </form>
      </div>

      {/* Existing Departments List */}
      <div className="flex-grow bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200">
        <h3 className="text-xl font-bold text-indigo-700 mb-4 border-b-2 border-indigo-100 pb-2">
          Current Departments
        </h3>
        {departments.length === 0 ? (
          <p className="text-gray-600 italic text-base mt-4 text-center py-6">No departments added yet.</p>
        ) : (
          <ul className="space-y-4 mt-4">
            {departments.map((dept) => (
              <li
                key={dept.id}
                className="bg-white shadow p-4 rounded-lg border-l-4 border-indigo-500 flex flex-col md:flex-row md:justify-between md:items-center transform hover:translate-x-1 transition-transform duration-200"
              >
                <div>
                  <strong className="text-lg text-gray-800">{dept.name}</strong>
                  <p className="text-sm text-gray-600">Hospital: {getHospitalName(dept.hospitalId)}</p>
                </div>
                <button
                  onClick={() => handleDeleteClick(dept)}
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
      {showConfirmModal && departmentToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete department "<strong className="text-red-600">{departmentToDelete.name}</strong>"?
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
