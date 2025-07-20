import { useState, useEffect } from "react";

export default function ViewSlots() {
  const [slots, setSlots] = useState([]);

  // Load slots from localStorage on component mount
  useEffect(() => {
    const savedSlots = JSON.parse(localStorage.getItem("doctorSlots") || "[]");
    setSlots(savedSlots);
    console.log("ViewSlots: Loaded slots from localStorage:", savedSlots);
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
      <h2 className="text-3xl font-extrabold text-indigo-800 mb-6 border-b-4 border-indigo-200 pb-2">
        <span className="inline-block mr-2 text-indigo-600">🗓️</span> My Availability Slots
      </h2>

      {slots.length === 0 ? (
        <p className="text-gray-600 italic text-base mt-4 text-center py-6">No slots created yet. Go to "Add Slot" to add your availability!</p>
      ) : (
        <ul className="space-y-4 mt-4">
          {slots.map((slot) => ( // CRITICAL: Use slot.id for the key
            <li key={slot.id} className="bg-white shadow p-4 rounded-lg border-l-4 border-indigo-500 flex justify-between items-center transform hover:translate-x-1 transition-transform duration-200">
              <div>
                <strong className="text-lg text-gray-800">{slot.hospital}</strong>
                <p className="text-sm text-gray-600">{slot.date} | {slot.startTime} – {slot.endTime}</p>
              </div>
              <span className="text-xl font-bold text-indigo-700">₹{slot.fee}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
