import { useState, useEffect } from "react";
import DashboardLayout from "../../../layout/DashboardLayout";

export default function HospitalDepartments() {
  const [hospital, setHospital] = useState({ name: "", location: "" });
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("hospitalData"));
    if (stored) {
      setHospital({ name: stored.name, location: stored.location });
      setDepartments(stored.departments || []);
    }
  }, []);

  const saveToLocalStorage = (hospitalObj) => {
    localStorage.setItem("hospitalData", JSON.stringify(hospitalObj));
  };

  const handleAddHospital = (e) => {
    e.preventDefault();
    if (!hospital.name || !hospital.location) {
      alert("Please enter hospital name and location");
      return;
    }
    const hospitalObj = {
      name: hospital.name,
      location: hospital.location,
      departments,
    };
    saveToLocalStorage(hospitalObj);
    alert("✅ Hospital saved!");
  };

  const handleAddDepartment = () => {
    const dept = newDept.trim();
    if (!dept) return;
    if (departments.includes(dept)) {
      alert("Department already exists");
      return;
    }
    const updated = [...departments, dept];
    setDepartments(updated);
    setNewDept("");
    saveToLocalStorage({ ...hospital, departments: updated });
  };

  return (
    <DashboardLayout role="hospitalAdmin">
      <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded-xl">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6">
          🏥 Add Hospital & Departments
        </h2>

        <form onSubmit={handleAddHospital} className="space-y-4">
          <input
            type="text"
            placeholder="Hospital Name"
            className="w-full p-3 border rounded"
            value={hospital.name}
            onChange={(e) =>
              setHospital({ ...hospital, name: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Location"
            className="w-full p-3 border rounded"
            value={hospital.location}
            onChange={(e) =>
              setHospital({ ...hospital, location: e.target.value })
            }
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Save Hospital
          </button>
        </form>

        <div className="mt-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            🏬 Departments
          </h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Add Department"
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleAddDepartment}
              className="bg-indigo-600 text-white px-4 rounded hover:bg-indigo-700"
            >
              Add
            </button>
          </div>

          {departments.length > 0 && (
            <ul className="mt-4 list-disc pl-5 text-gray-700 space-y-1">
              {departments.map((dept, i) => (
                <li key={i}>{dept}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
