import { useNavigate } from "react-router-dom";

function DashboardLayout({ children, role }) {
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  // Redirect if no user or role mismatch
  if (!currentUser || currentUser.role !== role) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Determine the display name for the header
  const displayName = currentUser.name || "User"; // Default to 'User' if name is not available
  const headerTitle =
    role === "doctor"
      ? `Welcome, Dr.${displayName}` // Specific format for doctors
      : `Welcome, ${displayName}`; // General format for others

  const links = {
    doctor: [
      { label: "Dashboard", path: "/doctor/dashboard" },
      { label: "Manage Slots", path: "/doctor/slots" },
      { label: "Earnings", path: "/doctor/earnings" },
      { label: "Add Slot", path: "/doctor/slots/add" },
      { label: "View Slots", path: "/doctor/slots/view" },
      { label: "Appointments", path: "/doctor/appointments" },
    ],
    patient: [
      { label: "Dashboard", path: "/patient/dashboard" },
      { label: "Book Appointment", path: "/patient/book" },
      { label: "My History", path: "/patient/history" },
    ],
    hospitalAdmin: [
      { label: "Dashboard", path: "/admin/dashboard" },
      { label: "Departments", path: "/admin/departments" },
      { label: "Doctors", path: "/admin/manage-doctors" },
      { label: "Appointments", path: "/admin/appointments" },
      { label: "Revenue", path: "/admin/revenue" },
    ],
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar - Remains Fixed Position */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-white shadow-md p-6 flex-shrink-0 z-20">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6">🏥 Dashboard</h2>
        <nav className="space-y-4">
          {links[role]?.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="block w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-100 text-gray-700 transition-colors duration-200"
            >
              {link.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area - Pushed to the right by sidebar's width, and NOW SCROLLABLE */}
      <main className="flex flex-col flex-1 ml-64 overflow-y-auto">
        {/* Header Bar - Now scrolls with the content, with FIXED height and centered items */}
        <header className="flex justify-between items-center px-6 bg-gradient-to-r from-indigo-700 to-purple-800 rounded-b-xl shadow-2xl text-white z-10 h-24"> {/* Changed p-6 to px-6 and added h-24 (fixed height) */}
          <h1 className="text-4xl font-extrabold tracking-wide text-white drop-shadow-md">
            {headerTitle}
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-opacity-75 relative overflow-hidden group"
          >
            <span className="relative z-10">Logout</span>
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          </button>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
