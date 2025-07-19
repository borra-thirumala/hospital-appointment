import { useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";

function DoctorSlots() {
  const [slots, setSlots] = useState([
    { date: "2025-07-22", time: "10:00 AM", hospital: "Apollo", fee: 500 },
    { date: "2025-07-23", time: "04:00 PM", hospital: "Rainbow", fee: 600 },
  ]);

  const [newSlot, setNewSlot] = useState({
    date: "",
    time: "",
    hospital: "",
    fee: "",
  });

  const handleChange = (e) => {
    setNewSlot({ ...newSlot, [e.target.name]: e.target.value });
  };

  const addSlot = () => {
    if (!newSlot.date || !newSlot.time || !newSlot.hospital || !newSlot.fee) return;
    setSlots([...slots, newSlot]);
    setNewSlot({ date: "", time: "", hospital: "", fee: "" });
  };

  return (
    <DashboardLayout role="doctor">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">🗓️ Manage Available Slots</h2>

        {/* Slot Form */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <input
            type="date"
            name="date"
            value={newSlot.date}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            placeholder="Date"
          />
          <input
            type="time"
            name="time"
            value={newSlot.time}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            placeholder="Time"
          />
          <input
            type="text"
            name="hospital"
            value={newSlot.hospital}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            placeholder="Hospital"
          />
          <input
            type="number"
            name="fee"
            value={newSlot.fee}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            placeholder="Consultation Fee"
          />
        </div>

        <button
          onClick={addSlot}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          ➕ Add Slot
        </button>

        {/* Slot List */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Your Available Slots:</h3>
          {slots.length === 0 ? (
            <p className="text-gray-500">No slots added yet.</p>
          ) : (
            <ul className="space-y-3">
              {slots.map((slot, index) => (
                <li
                  key={index}
                  className="border rounded p-3 bg-gray-50 flex justify-between"
                >
                  <span>{slot.date} @ {slot.time} - {slot.hospital}</span>
                  <span className="font-medium text-green-700">₹{slot.fee}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DoctorSlots;
