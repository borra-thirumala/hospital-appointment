import { useNavigate } from "react-router-dom";

function DashboardLayout({ children, role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const links = {
    doctor: [
      { label: "Dashboard", path: "/doctor/dashboard" },
      { label: "Manage Slots", path: "/doctor/slots" },
      { label: "Earnings", path: "/doctor/earnings" },
      { label: "Add Slot", path: "/doctor/slots/add" },
      { label: "View Slots", path: "/doctor/slots/view" },


    ],
    patient: [
      { label: "Dashboard", path: "/patient/dashboard" },
      { label: "Book Appointment", path: "/patient/book" },
      { label: "My History", path: "/patient/history" },
    ],
    hospitalAdmin: [
      { label: "Dashboard", path: "/admin/dashboard" },
      { label: "Departments", path: "/admin/departments" },
      { label: "Doctors", path: "/admin/doctors" },
      { label: "Revenue", path: "/admin/revenue" },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6">🏥 Dashboard</h2>
        <nav className="space-y-4">
          {links[role]?.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="block w-full text-left px-4 py-2 rounded hover:bg-indigo-100 text-gray-700"
            >
              {link.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-700">
  {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
</h1>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </header>

        {/* Dynamic Content Here */}
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
