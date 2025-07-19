import { useState } from "react";
import DashboardLayout from "../../../layout/DashboardLayout"; // ⬅️ path: up 3 levels to /layout

// 🔹 Mock hospitals the doctor is associated with.
//    Replace with an API call later.
const hospitalsYouWorkAt = [
  { id: "hosp_1", name: "Apollo Hospital" },
  { id: "hosp_2", name: "Rainbow Children’s Hospital" },
];

export default function AddSlot() {
  /*──────────────── State ────────────────*/
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({
    hospitalId: "",
    date: "",
    startTime: "",
    endTime: "",
    fee: "",
  });
  const [error, setError] = useState("");

  /*───────────── Handlers ─────────────*/
  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const slotOverlaps = (a, b) =>
    a.date === b.date &&
    ((a.startTime <= b.startTime && b.startTime < a.endTime) ||
      (b.startTime <= a.startTime && a.startTime < b.endTime));

  const handleAdd = (e) => {
    e.preventDefault();
    setError("");

    // basic validation
    if (!form.hospitalId || !form.date || !form.startTime || !form.endTime || !form.fee) {
      setError("All fields are required");
      return;
    }
    if (form.startTime >= form.endTime) {
      setError("End time must be after start time");
      return;
    }
    // overlap check
    if (slots.some((s) => slotOverlaps(s, form))) {
      setError("Slot overlaps with an existing one");
      return;
    }

    setSlots([...slots, form]);
    setForm({ hospitalId: "", date: "", startTime: "", endTime: "", fee: "" });
  };

  /*─────────────── UI ───────────────*/
  return (
    <DashboardLayout role="doctor">
      <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded-xl">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6">➕ Add Availability Slot</h2>

        {/* Form */}
        <form onSubmit={handleAdd} className="space-y-4">
          <select
            name="hospitalId"
            value={form.hospitalId}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          >
            <option value="">Select Hospital</option>
            {hospitalsYouWorkAt.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="p-3 border rounded"
              required
            />
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="p-3 border rounded"
              required
            />
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="p-3 border rounded"
              required
            />
          </div>

          <input
            type="number"
            name="fee"
            value={form.fee}
            onChange={handleChange}
            placeholder="Consultation fee (₹)"
            className="w-full p-3 border rounded"
            min={100}
            required
          />

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            Save Slot
          </button>
        </form>

        {/* List */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Current Slots</h3>
          {slots.length === 0 ? (
            <p className="text-gray-600">No slots added yet.</p>
          ) : (
            <ul className="space-y-3">
              {slots.map((s, idx) => (
                <li
                  key={idx}
                  className="bg-gray-50 border-l-4 border-green-600 p-3 rounded"
                >
                  <strong>
                    {hospitalsYouWorkAt.find((h) => h.id === s.hospitalId)?.name}
                  </strong>{" "}
                  – {s.date} ({s.startTime}-{s.endTime})|₹{s.fee}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
