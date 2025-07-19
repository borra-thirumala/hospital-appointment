import { useState } from "react";
import DashboardLayout from "../../../layout/DashboardLayout";

// Sample slots (mocked data, replace with API later)
const mockSlots = [
  {
    id: 1,
    hospital: "Apollo Hospital",
    date: "2025-07-22",
    startTime: "10:00",
    endTime: "11:00",
    fee: 500,
  },
  {
    id: 2,
    hospital: "Rainbow Children’s",
    date: "2025-07-23",
    startTime: "15:00",
    endTime: "16:00",
    fee: 700,
  },
];

export default function ViewSlots() {
  const [slots] = useState(mockSlots);

  return (
    <DashboardLayout role="doctor">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-xl">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6">🗓️ My Availability Slots</h2>
        {slots.length === 0 ? (
          <p className="text-gray-600">No slots created yet.</p>
        ) : (
          <ul className="space-y-4">
            {slots.map((slot) => (
              <li key={slot.id} className="bg-gray-50 p-4 border-l-4 border-indigo-500 rounded">
                <div className="font-semibold text-lg">{slot.hospital}</div>
                <div className="text-gray-700">
                  {slot.date} | {slot.startTime} – {slot.endTime} | ₹{slot.fee}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
}
