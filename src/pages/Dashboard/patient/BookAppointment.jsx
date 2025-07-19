import { useState, useEffect } from "react";
import DashboardLayout from "../../../layout/DashboardLayout";

// 🔹 Mock doctors, hospitals & slots
const mockDoctors = [
  {
    id: "doc_1",
    name: "Dr. Arjun Rao",
    specialization: "Cardiology",
    hospitals: [
      {
        id: "hosp_1",
        name: "Apollo Hospital",
        slots: ["2025-07-22 10:00", "2025-07-24 09:30"],
        fee: 500,
      },
    ],
  },
  {
    id: "doc_2",
    name: "Dr. Sneha Iyer",
    specialization: "Pediatrics",
    hospitals: [
      {
        id: "hosp_2",
        name: "Rainbow Children’s Hospital",
        slots: ["2025-07-23 14:00"],
        fee: 650,
      },
      {
        id: "hosp_1",
        name: "Apollo Hospital",
        slots: ["2025-07-25 11:00"],
        fee: 600,
      },
    ],
  },
];

export default function BookAppointment() {
  const [specialization, setSpec] = useState("");
  const [hospitalId, setHospitalId] = useState("");
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState("");
  const [confirmMsg, setConfirmMsg] = useState("");
  const [history, setHistory] = useState([]);

  const specializations = [...new Set(mockDoctors.map((d) => d.specialization))];
  const hospitals = [
    ...new Set(
      mockDoctors.flatMap((d) => d.hospitals.map((h) => JSON.stringify(h)))
    ),
  ].map((j) => JSON.parse(j));

  const matchesFilter = (doc) =>
    (!specialization || doc.specialization === specialization) &&
    (!hospitalId ||
      doc.hospitals.some((h) => h.id === hospitalId && h.slots.length));

  const filteredDoctors = mockDoctors.filter(matchesFilter);

  const handleBook = () => {
    if (!selected || !amount) {
      alert("Choose a slot and enter amount");
      return;
    }

    const newRecord = {
      doctor: selected.doctor.name,
      specialization: selected.doctor.specialization,
      hospital: selected.hosp.name,
      fee: Number(amount),
      slot: selected.slot,
      bookedAt: new Date().toISOString(),
    };

    const user = JSON.parse(localStorage.getItem("user") || "{}");
const key = `patientHistory_${user.name || "anonymous"}`;

const existing = JSON.parse(localStorage.getItem(key) || "[]");
const updated = [...existing, newRecord];
localStorage.setItem(key, JSON.stringify(updated));

    setHistory(updated);
    setConfirmMsg(`✅ Appointment booked with ${newRecord.doctor} at ${newRecord.slot} for ₹${amount}`);
    setSelected(null);
    setAmount("");
  };

  useEffect(() => {
    setConfirmMsg("");
    const stored = JSON.parse(localStorage.getItem("patientHistory") || "[]");
    setHistory(stored);
  }, []);

  return (
    <DashboardLayout role="patient">
      <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-xl">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6">
          🩺 Book an Appointment
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <select
            value={specialization}
            onChange={(e) => setSpec(e.target.value)}
            className="p-3 border rounded"
          >
            <option value="">All Specializations</option>
            {specializations.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            value={hospitalId}
            onChange={(e) => setHospitalId(e.target.value)}
            className="p-3 border rounded"
          >
            <option value="">All Hospitals</option>
            {hospitals.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        {filteredDoctors.length === 0 ? (
          <p className="text-gray-600">No doctors match filters.</p>
        ) : (
          filteredDoctors.map((doc) => (
            <div key={doc.id} className="border rounded mb-6 p-4 bg-gray-50 shadow-sm">
              <h3 className="text-lg font-bold">{doc.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{doc.specialization}</p>

              {doc.hospitals
                .filter((h) => !hospitalId || h.id === hospitalId)
                .map((h) => (
                  <div key={h.id} className="mb-4">
                    <div className="font-semibold">{h.name}</div>
                    <div className="space-y-2 mt-2">
                      {h.slots.map((slot) => (
                        <label
                          key={slot}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="slot-choice"
                            onChange={() =>
                              setSelected({ doctor: doc, hosp: h, slot })
                            }
                          />
                          <span className="text-sm text-gray-700">
                            {slot} – ₹{h.fee}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          ))
        )}

        {selected && (
          <div className="border-t pt-4 mt-6">
            <h4 className="text-md font-semibold mb-2">
              Selected: {selected.slot} with {selected.doctor.name} at{" "}
              {selected.hosp.name}
            </h4>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="border p-2 rounded w-40"
              min={100}
            />
            <button
              onClick={handleBook}
              className="ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Confirm Booking
            </button>
          </div>
        )}

        {confirmMsg && (
          <div className="mt-4 bg-green-100 text-green-800 p-3 rounded">
            {confirmMsg}
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-bold text-indigo-700 mb-4">
              🧾 My Booked Appointments
            </h3>
            <ul className="space-y-4">
              {history.map((item, idx) => (
                <li key={idx} className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded">
                  <p className="font-semibold">{item.doctor}</p>
                  <p className="text-sm text-gray-700">{item.specialization} @ {item.hospital}</p>
                  <p className="text-gray-600">{item.slot}</p>
                  <p className="text-green-700 font-semibold">Fee: ₹{item.fee}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
