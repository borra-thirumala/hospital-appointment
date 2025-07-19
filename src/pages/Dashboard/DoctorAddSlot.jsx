import { useState } from "react";

function DoctorAddSlot() {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    maxPatients: 1,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // For now, just show alert — backend integration will come next
    alert(`Slot added on ${formData.date} at ${formData.time} for ${formData.maxPatients} patients`);

    // Clear form
    setFormData({ date: "", time: "", maxPatients: 1 });
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 shadow rounded-lg">
      <h2 className="text-2xl font-bold text-green-700 mb-4">➕ Add Appointment Slot</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />
        <input
          type="number"
          name="maxPatients"
          value={formData.maxPatients}
          onChange={handleChange}
          min={1}
          className="w-full p-3 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Add Slot
        </button>
      </form>
    </div>
  );
}

export default DoctorAddSlot;
