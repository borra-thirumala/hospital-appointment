import DashboardLayout from "../../layout/DashboardLayout";

function AdminDashboard() {
  return (
    <DashboardLayout role="hospitalAdmin">
      <div className="p-4 bg-white rounded shadow">
        <h1 className="text-3xl font-bold text-yellow-700">🏥 Admin Dashboard</h1>
        <p className="mt-4 text-gray-600">
          Welcome, admin! Manage your hospital, departments, doctors and view revenue reports.
        </p>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
