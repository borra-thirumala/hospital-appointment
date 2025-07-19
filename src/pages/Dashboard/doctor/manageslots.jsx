import { useState } from "react";

function ManageSlots() {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({
    hospital: "",
    date: "",
    startTime: "",
    endTime: "",
    fee: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddSlot = (e) => {
    e.preventDefault();
    setSlots([...slots, form]);
    setForm({
      hospital: "",
      date: "",
      startTime: "",
      endTime: "",
      fee: "",
    });
  };

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold text-indigo-700">🕑 Manage Slots</h2>

      <form onSubmit={handleAddSlot} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="hospital"
            value={form.hospital}
            onChange={handleChange}
            placeholder="Hospital Name"
            className="p-3 border rounded"
            required
          />
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
          <input
            type="number"
            name="fee"
            value={form.fee}
            onChange={handleChange}
            placeholder="Consultation Fee"
            className="p-3 border rounded"
            required
          />
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Add Slot
        </button>
      </form>

      <div>
        <h3 className="text-lg font-semibold mt-6">Your Slots:</h3>
        {slots.length === 0 ? (
          <p className="text-gray-600 mt-2">No slots added yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {slots.map((slot, index) => (
              <li
                key={index}
                className="bg-white shadow p-4 rounded border-l-4 border-green-600"
              >
                <strong>{slot.hospital}</strong> on {slot.date} from{" "}
                {slot.startTime} to {slot.endTime} - ₹{slot.fee}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ManageSlots;
