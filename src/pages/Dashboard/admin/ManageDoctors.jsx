import { useState, useEffect } from "react";

export default function ManageDoctors() {
  const [allDoctors, setAllDoctors] = useState([]); // Store all doctors
  const [filteredDoctors, setFilteredDoctors] = useState([]); // Store filtered doctors
  const [hospitals, setHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const registeredDoctors = users.filter(user => user.role === "doctor");
    setAllDoctors(registeredDoctors); // Set all doctors
    setFilteredDoctors(registeredDoctors); // Initially, all doctors are filtered

    const loadedHospitals = JSON.parse(localStorage.getItem("hospitals") || "[]");
    setHospitals(loadedHospitals);
  }, []);

  // Effect to re-filter doctors whenever searchTerm or allDoctors changes
  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const currentFiltered = allDoctors.filter(doctor =>
      doctor.name.toLowerCase().includes(lowercasedSearchTerm) ||
      doctor.specializations.toLowerCase().includes(lowercasedSearchTerm) ||
      doctor.email.toLowerCase().includes(lowercasedSearchTerm) // Can search by email too
    );
    setFilteredDoctors(currentFiltered);
  }, [searchTerm, allDoctors]); // Dependencies for re-filtering

  const getHospitalName = (hospitalId) => {
    const hospital = hospitals.find(h => h.id === hospitalId);
    return hospital ? hospital.name : "N/A";
  };

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg p-6 min-h-[calc(100vh-144px)]">
      <h2 className="text-3xl font-extrabold text-indigo-800 mb-6 border-b-4 border-indigo-200 pb-2">
        <span className="inline-block mr-2 text-indigo-600">👨‍⚕️</span> Manage Doctors
      </h2>

      <p className="text-lg font-semibold text-gray-800 mb-6">
        Overview of all registered doctors in the system.
      </p>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search doctors by name, specialization, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
        />
      </div>

      {/* Doctors List */}
      <div className="flex-grow bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200">
        <h3 className="text-xl font-bold text-indigo-700 mb-4 border-b-2 border-indigo-100 pb-2">
          Registered Doctors
        </h3>
        {filteredDoctors.length === 0 ? (
          <p className="text-gray-600 italic text-base mt-4 text-center py-6">No doctors found matching your criteria.</p>
        ) : (
          <ul className="space-y-4 mt-4">
            {filteredDoctors.map((doctor) => (
              <li
                key={doctor.email}
                className="bg-white shadow p-4 rounded-lg border-l-4 border-blue-500 flex flex-col md:flex-row md:justify-between md:items-center transform hover:translate-x-1 transition-transform duration-200"
              >
                <div>
                  <p className="font-semibold text-gray-800 text-lg">Dr. {doctor.name}</p>
                  <p className="text-sm text-gray-600">
                    Specialization: <span className="text-indigo-600">{doctor.specializations || 'N/A'}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Experience: {doctor.experience || 'N/A'} years
                  </p>
                  <p className="text-sm text-gray-600">
                    Qualifications: {doctor.qualifications || 'N/A'}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
