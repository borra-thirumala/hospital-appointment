import { useState, useEffect } from "react";

const mockDoctors = [
  {
    id: "doc_1",
    name: "Dr. Arjun Rao",
    specialization: "Cardiology",
    hospitals: [
      {
        id: "hosp_1",
        name: "Apollo Hospital",
        slots: [
          { time: "2025-07-22 10:00", available: true },
          { time: "2025-07-24 09:30", available: true },
        ],
        fee: 500,
      },
      {
        id: "hosp_3",
        name: "City General Hospital",
        slots: [
          { time: "2025-07-26 14:00", available: true },
        ],
        fee: 550,
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
        slots: [
          { time: "2025-07-23 14:00", available: true },
        ],
        fee: 650,
      },
      {
        id: "hosp_1",
        name: "Apollo Hospital",
        slots: [
          { time: "2025-07-25 11:00", available: true },
        ],
        fee: 600,
      },
    ],
  },
  {
    id: "doc_3",
    name: "Dr. Rajesh Kumar",
    specialization: "Orthopedics",
    hospitals: [
      {
        id: "hosp_1",
        name: "Apollo Hospital",
        slots: [
          { time: "2025-07-22 16:00", available: true },
          { time: "2025-07-24 10:00", available: true },
        ],
        fee: 700,
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
  const [errorMsg, setErrorMsg] = useState("");
  const [history, setHistory] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const patientUniqueId = currentUser.uniqueId;
  const patientHistoryKey = `patientHistory_${patientUniqueId}`;

  const specializations = [...new Set(mockDoctors.map((d) => d.specialization))];
  const hospitals = [
    ...new Set(
      mockDoctors.flatMap((d) => d.hospitals.map((h) => JSON.stringify({ id: h.id, name: h.name })))
    ),
  ].map((j) => JSON.parse(j));

  const filteredDoctors = mockDoctors.filter((doc) => {
    const specMatch = !specialization || doc.specialization === specialization;
    const hospitalMatch = !hospitalId || doc.hospitals.some((h) => h.id === hospitalId && h.slots.some(s => s.available));
    return specMatch && hospitalMatch;
  });

  const handleBook = () => {
    if (!selected) {
      setErrorMsg("Please choose a time slot to book.");
      setConfirmMsg("");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setErrorMsg("Please enter a valid consultation amount.");
      setConfirmMsg("");
      return;
    }
    if (Number(amount) < selected.hosp.fee) {
      setErrorMsg(`Amount must be at least the consultation fee: ₹${selected.hosp.fee}`);
      setConfirmMsg("");
      return;
    }


    const newRecord = {
      id: Date.now(),
      patient: currentUser.name || "Anonymous",
      patientId: patientUniqueId,
      doctor: selected.doctor.name,
      doctorId: selected.doctor.id,
      specialization: selected.doctor.specialization,
      hospital: selected.hosp.name,
      hospitalId: selected.hosp.id,
      fee: Number(amount),
      slot: selected.slot.time,
      bookedAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem(patientHistoryKey) || "[]");
    const updatedHistory = [...existing, newRecord];
    localStorage.setItem(patientHistoryKey, JSON.stringify(updatedHistory));
    setHistory(updatedHistory);

    mockDoctors.forEach(doc => {
        doc.hospitals.forEach(hosp => {
            hosp.slots.forEach(s => {
                if (s.time === selected.slot.time && doc.id === selected.doctor.id && hosp.id === selected.hosp.id) {
                    s.available = false;
                }
            });
        });
    });


    setConfirmMsg(`✅ Appointment booked with ${newRecord.doctor} on ${newRecord.slot} at ${newRecord.hospital} for ₹${amount}.`);
    setErrorMsg("");
    setSelected(null);
    setAmount("");
  };

  useEffect(() => {
    setConfirmMsg("");
    setErrorMsg("");
    const stored = JSON.parse(localStorage.getItem(patientHistoryKey) || "[]");
    setHistory(stored);
  }, [patientHistoryKey]);

  return (
    // Consistent outermost div styling
    <div className="flex flex-col bg-white rounded-xl shadow-lg p-6 min-h-[calc(100vh-144px)]">
      <h2 className="text-3xl font-extrabold text-indigo-800 mb-6 border-b-4 border-indigo-200 pb-2">
        <span className="inline-block mr-2 text-indigo-600">🩺</span> Book an Appointment
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <select
          value={specialization}
          onChange={(e) => { setSpec(e.target.value); setHospitalId(""); setSelected(null); }}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
        >
          <option value="">All Specializations</option>
          {specializations.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          value={hospitalId}
          onChange={(e) => { setHospitalId(e.target.value); setSelected(null); }}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
        >
          <option value="">All Hospitals</option>
          {hospitals.map((h) => (
            <option key={h.id} value={h.id}>
              {h.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-grow bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200">
        <h3 className="text-xl font-bold text-indigo-700 mb-4 border-b-2 border-indigo-100 pb-2">
          Available Doctors
        </h3>
        {filteredDoctors.length === 0 ? (
          <p className="text-gray-600 italic text-base mt-4 text-center py-6">No doctors match your selected filters or have available slots.</p>
        ) : (
          <ul className="space-y-6 mt-4">
            {filteredDoctors.map((doc) => (
              <li key={doc.id} className="bg-white rounded-xl shadow-md p-5 border border-gray-200 transform hover:scale-[1.01] transition-transform duration-200">
                <h4 className="text-lg font-bold text-gray-800 mb-2">{doc.name} - <span className="text-indigo-600">{doc.specialization}</span></h4>

                {doc.hospitals
                  .filter((h) => (!hospitalId || h.id === hospitalId) && h.slots.some(s => s.available))
                  .map((hosp) => (
                    <div key={hosp.id} className="mb-4 last:mb-0 p-3 bg-gray-100 rounded-lg border border-gray-200">
                      <div className="font-semibold text-gray-700 mb-2">🏥 {hosp.name} (Fee: ₹{hosp.fee})</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {hosp.slots
                          .filter(s => s.available)
                          .map((slot) => (
                            <label
                              key={slot.time}
                              className={`flex items-center justify-between px-4 py-2 rounded-full cursor-pointer transition-all duration-200 text-sm ${
                                selected?.doctor.id === doc.id && selected?.hosp.id === hosp.id && selected?.slot.time === slot.time
                                  ? "bg-blue-600 text-white shadow-lg"
                                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                              }`}
                            >
                              <input
                                type="radio"
                                name="slot-choice"
                                className="hidden"
                                checked={selected?.doctor.id === doc.id && selected?.hosp.id === hosp.id && selected?.slot.time === slot.time}
                                onChange={() => {
                                  setSelected({ doctor: doc, hosp: hosp, slot: slot });
                                  setErrorMsg("");
                                }}
                              />
                              <span>{slot.time.split(' ')[1]}</span>
                              <span className="font-semibold">₹{hosp.fee}</span>
                            </label>
                          ))}
                      </div>
                      {hosp.slots.filter(s => s.available).length === 0 && (
                        <p className="text-sm text-gray-500 mt-2">No available slots at this hospital.</p>
                      )}
                    </div>
                  ))}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Booking Confirmation Section */}
      {selected && (
        <div className="mt-8 p-6 bg-blue-50 rounded-xl shadow-md border border-blue-200">
          <h4 className="text-xl font-bold text-blue-800 mb-4">Confirm Your Booking</h4>
          <p className="text-gray-700 mb-4">
            You have selected: <strong className="text-indigo-700">{selected.slot.time}</strong> with <strong className="text-indigo-700">{selected.doctor.name}</strong> at{" "}
            <strong className="text-indigo-700">{selected.hosp.name}</strong>.
            <br />
            Consultation Fee: <strong className="text-green-700">₹{selected.hosp.fee}</strong>
          </p>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Enter amount (e.g., ${selected.hosp.fee})`}
              className="border border-gray-300 p-3 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              min={selected.hosp.fee}
              required
            />
            <button
              onClick={handleBook}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      )}

      {/* Messages (Success/Error) */}
      {confirmMsg && (
        <div className="mt-6 bg-green-100 text-green-800 p-4 rounded-lg border border-green-300 shadow-sm">
          {confirmMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-lg border border-red-300 shadow-sm">
          {errorMsg}
        </div>
      )}

      {/* My Booked Appointments (History on this page) */}
      {history.length > 0 && (
        <div className="mt-8 flex-grow bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200">
          <h3 className="text-xl font-bold text-indigo-700 mb-4 border-b-2 border-indigo-100 pb-2">
            🧾 My Recently Booked Appointments
          </h3>
          <ul className="space-y-4">
            {history.map((item) => (
              <li key={item.id} className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded-lg shadow-sm flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <p className="font-semibold text-gray-800 text-lg">Dr. {item.doctor} - <span className="text-indigo-600">{item.specialization}</span></p>
                  <p className="text-sm text-gray-700">🏥 {item.hospital} | 📅 {item.slot}</p>
                </div>
                <div className="mt-2 md:mt-0 md:text-right">
                  <p className="text-green-700 font-bold text-lg">Fee: ₹{item.fee}</p>
                  <p className="text-xs text-gray-500">Booked: {new Date(item.bookedAt).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
