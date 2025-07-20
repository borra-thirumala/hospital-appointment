import { useState, useEffect } from "react";

// Mock hospitals (replace with API later)
const hospitalsYouWorkAt = [
  { id: "hosp_1", name: "Apollo Hospital" },
  { id: "hosp_2", name: "Rainbow Children’s Hospital" },
];

export default function AddSlot() {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({
    hospitalId: "",
    date: "",
    startTime: "",
    endTime: "",
    fee: "",
  });
  const [error, setError] = useState("");

  // Load saved slots from localStorage on component mount
  useEffect(() => {
    const savedSlots = JSON.parse(localStorage.getItem("doctorSlots") || "[]");
    setSlots(savedSlots);
    console.log("AddSlot: Loaded initial slots from localStorage:", savedSlots);
  }, []);

  // Save slots to localStorage whenever they change
  useEffect(() => {
    if (slots.length > 0 || localStorage.getItem("doctorSlots") !== "[]") {
      localStorage.setItem("doctorSlots", JSON.stringify(slots));
      console.log("AddSlot: Saved slots to localStorage:", slots);
    }
  }, [slots]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Slot overlap logic
  const slotOverlaps = (a, b) =>
    a.hospitalId === b.hospitalId &&
    a.date === b.date &&
    ((a.startTime < b.endTime && b.startTime < a.endTime));

  const handleAdd = (e) => {
    e.preventDefault();
    setError("");

    const { hospitalId, date, startTime, endTime, fee } = form;

    // Basic Validation
    if (!hospitalId || !date || !startTime || !endTime || !fee) {
      setError("All fields are required");
      return;
    }

    if (startTime >= endTime) {
      setError("End time must be after start time");
      return;
    }

    // Generate a unique ID for the new slot
    const newSlot = {
      id: Date.now(), // CRITICAL: Ensure this is present and unique
      hospitalId,
      date,
      startTime,
      endTime,
      fee: parseFloat(fee),
    };

    // Overlap check
    if (slots.some((slot) => slotOverlaps(slot, newSlot))) {
      setError("Slot overlaps with an existing one for this hospital and date.");
      return;
    }

    // Add new slot to state
    setSlots((prevSlots) => [...prevSlots, newSlot]);

    // Reset form
    setForm({
      hospitalId: "",
      date: "",
      startTime: "",
      endTime: "",
      fee: "",
    });
    console.log("AddSlot: Added new slot to state:", newSlot);
  };

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
      <h2 className="text-3xl font-extrabold text-indigo-800 mb-6 border-b-4 border-indigo-200 pb-2">
        <span className="inline-block mr-2 text-indigo-600">➕</span> Add Availability Slot
      </h2>

      {/* Form */}
      <form onSubmit={handleAdd} className="space-y-6 mb-8">
        <select
          name="hospitalId"
          value={form.hospitalId}
          onChange={handleChange}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
          required
        >
          <option value="">Select Hospital</option>
          {hospitalsYouWorkAt.map((h) => (
            <option key={h.id} value={h.id}>
              {h.name}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
            required
          />
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
            required
          />
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
            required
          />
        </div>

        <input
          type="number"
          name="fee"
          value={form.fee}
          onChange={handleChange}
          placeholder="Consultation fee (₹)"
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
          min={100}
          required
        />

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg border border-red-300 shadow-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md transform hover:scale-105"
        >
          Save Slot
        </button>
      </form>

      {/* List */}
      <div className="flex-grow bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200">
        <h3 className="text-xl font-bold text-indigo-700 mb-4 border-b-2 border-indigo-100 pb-2">Current Slots:</h3>
        {slots.length === 0 ? (
          <p className="text-gray-600 italic text-base mt-4 text-center py-6">No slots added yet. Use the form above to add your availability!</p>
        ) : (
          <ul className="mt-5 space-y-4">
            {slots.map((s) => (
              <li
                key={s.id} // CRITICAL: Using the unique ID for the key
                className="bg-white shadow p-4 rounded-lg border-l-4 border-green-600 flex justify-between items-center transform hover:translate-x-1 transition-transform duration-200"
              >
                <div>
                  <strong className="text-lg text-gray-800">
                    {hospitalsYouWorkAt.find((h) => h.id === s.hospitalId)?.name}
                  </strong>
                  <p className="text-sm text-gray-600">{s.date} | {s.startTime} – {s.endTime}</p>
                </div>
                <span className="text-xl font-bold text-green-700">₹{s.fee}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
