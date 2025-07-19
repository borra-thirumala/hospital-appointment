import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../layout/DashboardLayout";

function PatientDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout role="patient">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-blue-700">🧑‍⚕️ Patient Dashboard</h1>
        <p className="mt-4 text-gray-600">
          Welcome, {user?.name || "Patient"}! Book appointments and view your history here.
        </p>
      </div>
    </DashboardLayout>
  );
}

export default PatientDashboard;
