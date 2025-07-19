import { useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";

function BookAppointment() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingAmount, setBookingAmount] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const doctors = [
    {
      id: 1,
      name: "Dr. Arjun Rao",
      specialization: "Cardiology",
      hospital: "Apollo",
      slots: ["2025-07-20 10:00 AM", "2025-07-22 11:30 AM"],
      fee: 500,
    },
    {
      id: 2,
      name: "Dr. Sneha Iyer",
      specialization: "Pediatrics",
      hospital: "Rainbow",
      slots: ["2025-07-21 2:00 PM"],
      fee: 600,
    },
  ];

  const handleBook = (doctor, slot) => {
    if (!bookingAmount) {
      alert("Please enter the amount.");
      return;
    }

    // Normally you'd send data to backend here
    setConfirmation(
      `✅ Appointment booked with ${doctor.name} at ${slot} for ₹${bookingAmount}`
    );
    setSelectedDoctor(null);
    setBookingAmount("");
  };

  return (
    <DashboardLayout role="patient">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">🩺 Book an Appointment</h2>

        {confirmation && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {confirmation}
          </div>
        )}

        {/* Doctor List */}
        <div className="grid md:grid-cols-2 gap-6">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="border p-4 rounded shadow-sm bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800 mb-1">{doctor.name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {doctor.specialization} @ {doctor.hospital}
              </p>
              <p className="text-sm text-gray-700 mb-2">Fee: ₹{doctor.fee}</p>
              <div className="space-y-2">
                {doctor.slots.map((slot, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`slot-${doctor.id}`}
                      onChange={() => setSelectedDoctor({ doctor, slot })}
                    />
                    <label className="text-sm text-gray-700">{slot}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Booking Form */}
        {selectedDoctor && (
          <div className="mt-6 border-t pt-4">
            <h4 className="text-md font-semibold mb-2 text-gray-800">Enter Amount:</h4>
            <input
              type="number"
              value={bookingAmount}
              onChange={(e) => setBookingAmount(e.target.value)}
              className="border px-3 py-2 rounded w-64"
              placeholder="₹ amount"
            />
            <button
              onClick={() => handleBook(selectedDoctor.doctor, selectedDoctor.slot)}
              className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Confirm Booking
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default BookAppointment;
