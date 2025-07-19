import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulated login logic (in real apps: call API)
    const role = localStorage.getItem("role") || "patient";
    const name = "John Doe"; // You could save and retrieve real name from localStorage in register

    // ✅ Save to AuthContext
    setUser({ role, name });

    // Simulate token set
    localStorage.setItem("token", "fake_token_123");

    // Redirect based on role
    if (role === "doctor") navigate("/doctor/dashboard");
    else if (role === "hospitalAdmin") navigate("/admin/dashboard");
    else navigate("/patient/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md space-y-4 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-indigo-600 text-center">Login</h2>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-3 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-3 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-3 rounded hover:bg-indigo-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
