import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
 // ← save whatever fields you like
const roles = [
  {
    id: "patient",
    title: "Register as Patient",
    description: "Book appointments and view your consultation history.",
    icon: "🧑‍⚕️",
    bg: "bg-blue-100",
  },
  {
    id: "doctor",
    title: "Register as Doctor",
    description: "Manage your slots and view earnings.",
    icon: "👨‍⚕️",
    bg: "bg-green-100",
  },
  {
    id: "hospitalAdmin",
    title: "Register as Hospital Admin",
    description: "Manage hospitals, departments, and doctors.",
    icon: "🏥",
    bg: "bg-yellow-100",
  },
];

function Register() {
  const navigate = useNavigate();
   const { setUser } = useAuth(); // ✅ Moved inside function
  const [role, setRole] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    dob: "",
    uniqueId: "",
    qualifications: "",
    experience: "",
    specializations: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({ role, name: formData.name });

    localStorage.setItem("token", "fake_token_123");
    localStorage.setItem("role", role);
    localStorage.setItem("name", formData.name);

    if (role === "doctor") navigate("/doctor/dashboard");
    else if (role === "hospitalAdmin") navigate("/admin/dashboard");
    else navigate("/patient/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 to-white p-6 flex flex-col items-center">
      <h2 className="text-4xl font-bold text-center text-indigo-700 mb-10">Create an Account</h2>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-10">
        {roles.map((r) => (
          <div
            key={r.id}
            className={`p-6 rounded-xl shadow-md border cursor-pointer transition hover:scale-105 duration-300 ${
              role === r.id ? "border-indigo-600 ring-2 ring-indigo-300" : "border-gray-200"
            } ${r.bg}`}
            onClick={() => setRole(r.id)}
          >
            <div className="text-5xl mb-4">{r.icon}</div>
            <h3 className="text-xl font-bold mb-2">{r.title}</h3>
            <p className="text-sm text-gray-600">{r.description}</p>
          </div>
        ))}
      </div>

      {/* Role-based Form */}
      {role && (
        <form
          onSubmit={handleSubmit}
          className="bg-white w-full max-w-2xl p-8 rounded-xl shadow-lg space-y-4"
        >
          <h3 className="text-2xl font-semibold text-indigo-700 mb-4">
            {roles.find((r) => r.id === role)?.title}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="p-3 border rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 border rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="p-3 border rounded"
              required
            />
          </div>

          {role === "patient" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="p-3 border rounded"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="p-3 border rounded"
                required
              />

              <input
                type="text"
                name="uniqueId"
                placeholder="Aadhar / Passport"
                value={formData.uniqueId}
                onChange={handleChange}
                className="md:col-span-2 p-3 border rounded"
                required
              />
            </div>
          )}

          {role === "doctor" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="qualifications"
                placeholder="Qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                className="p-3 border rounded"
                required
              />
              <input
                type="number"
                name="experience"
                placeholder="Years of Experience"
                value={formData.experience}
                onChange={handleChange}
                className="p-3 border rounded"
                required
              />
              <input
                type="text"
                name="specializations"
                placeholder="Specializations (comma-separated)"
                value={formData.specializations}
                onChange={handleChange}
                className="md:col-span-2 p-3 border rounded"
                required
              />
            </div>
          )}

          {/* Admin has no extra fields */}

          <button
            type="submit"
            className="w-full mt-4 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Register
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 underline">
              Login
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}

export default Register;

