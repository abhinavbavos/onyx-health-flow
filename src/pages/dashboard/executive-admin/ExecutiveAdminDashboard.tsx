import { Outlet, NavLink } from "react-router-dom";

const ExecutiveAdminDashboard = () => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4">
        <h2 className="font-bold text-lg mb-4">Executive Admin</h2>
        <nav className="flex flex-col gap-2">
          <NavLink
            to="/dashboard/executive-admin"
            className={({ isActive }) =>
              isActive ? "font-semibold text-blue-600" : ""
            }
            end
          >
            Dashboard Home
          </NavLink>
          <NavLink to="/dashboard/executive-admin/organizations">
            Organizations
          </NavLink>
          <NavLink to="/dashboard/executive-admin/doctors">Doctors</NavLink>
          <NavLink to="/dashboard/executive-admin/technicians">
            Technicians
          </NavLink>
          <NavLink to="/dashboard/executive-admin/reports">Reports</NavLink>
          <NavLink to="/dashboard/executive-admin/devices">Devices</NavLink>
        </nav>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-6 bg-white">
        {/* ⬇️ This is where child routes will render */}
        <Outlet />
      </main>
    </div>
  );
};

export default ExecutiveAdminDashboard;
