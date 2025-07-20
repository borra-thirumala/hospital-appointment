import { useState } from "react";
// NO import DashboardLayout here!

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
    // Outermost div: Removed space-y-6, p-4. Added flex-col, bg, shadow, p-6, rounded.
    <div className="flex flex-col bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
      <h2 className="text-3xl font-extrabold text-indigo-800 mb-6 border-b-4 border-indigo-200 pb-2">
        <span className="inline-block mr-2 text-indigo-600">🕑</span> Manage Slots
      </h2>

      <form onSubmit={handleAddSlot} className="space-y-6 mb-8"> {/* Increased space-y */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Increased gap */}
          <input
            type="text"
            name="hospital"
            value={form.hospital}
            onChange={handleChange}
            placeholder="Hospital Name"
            className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm" // Enhanced input styling
            required
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm" // Enhanced input styling
            required
          />
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm" // Enhanced input styling
            required
          />
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm" // Enhanced input styling
            required
          />
          <input
            type="number"
            name="fee"
            value={form.fee}
            onChange={handleChange}
            placeholder="Consultation Fee (₹)"
            className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm" // Enhanced input styling
            required
          />
        </div>
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md transform hover:scale-105"> {/* Enhanced button styling */}
          Add Slot
        </button>
      </form>

      <div className="flex-grow bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200"> {/* Added flex-grow, p-6 */}
        <h3 className="text-xl font-bold text-indigo-700 mb-4 border-b-2 border-indigo-100 pb-2">Your Current Slots:</h3> {/* Enhanced heading */}
        {slots.length === 0 ? (
          <p className="text-gray-600 italic text-base mt-4 text-center py-6">No slots added yet. Use the form above to add your availability!</p> 
        ) : (
          <ul className="mt-5 space-y-4">
            {slots.map((slot, index) => (
              <li
                key={index}
                className="bg-white shadow p-4 rounded-lg border-l-4 border-green-600 flex justify-between items-center transform hover:translate-x-1 transition-transform duration-200" // Enhanced list item styling
              >
                <div>
                  <strong className="text-lg text-gray-800">{slot.hospital}</strong>
                  <p className="text-sm text-gray-600">{slot.date} | {slot.startTime} – {slot.endTime}</p>
                </div>
                <span className="text-xl font-bold text-green-700">₹{slot.fee}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ManageSlots;