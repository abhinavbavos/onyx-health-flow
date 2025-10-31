import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./components/auth/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Dashboards
import SuperAdminDashboard from "./pages/dashboard/SuperAdminDashboard";
import ExecutiveAdminDashboard from "./pages/dashboard/ExecutiveAdminDashboard";
import ClusterHeadDashboard from "./pages/dashboard/ClusterHeadDashboard";
import UserHeadDashboard from "./pages/dashboard/UserHeadDashboard";
import NurseDashboard from "./pages/dashboard/NurseDashboard";
import UserDashboard from "./pages/dashboard/UserDashboard";
import DoctorDashboard from "./pages/dashboard/DoctorDashboard";

// Common pages
import RoleManagement from "./pages/dashboard/super-admin/RoleManagement";
import UserManagement from "./pages/dashboard/super-admin/UserManagement";
import AuditLogs from "./pages/dashboard/super-admin/AuditLogs";
import Organizations from "./pages/dashboard/executive-admin/Organizations";
import Doctors from "./pages/dashboard/executive-admin/Doctors";
import Technicians from "./pages/dashboard/executive-admin/Technicians";
import TeamManagement from "./pages/dashboard/cluster-head/TeamManagement";
import Nurses from "./pages/dashboard/user-head/Nurses";
import Devices from "./pages/dashboard/shared/Devices";
import Reports from "./pages/dashboard/shared/Reports";
import Payments from "./pages/dashboard/shared/Payments";
import Organization from "./pages/dashboard/shared/Organization";
import Profile from "./pages/dashboard/user/Profile";
import Sessions from "./pages/dashboard/user/Sessions";
import Consultancy from "./pages/dashboard/user/Consultancy";
import Schedule from "./pages/dashboard/doctor/Schedule";
import Consultations from "./pages/dashboard/doctor/Consultations";
import Prescriptions from "./pages/dashboard/doctor/Prescriptions";

const queryClient = new QueryClient();

function PersistentSession() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    if (token && role && window.location.pathname === "/login") {
      navigate(`/dashboard/${role}`, { replace: true });
    }
  }, [navigate]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PersistentSession />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />

          {/* PROTECTED ROUTES */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard/super-admin"
              element={<SuperAdminDashboard />}
            />
            <Route
              path="/dashboard/super-admin/roles"
              element={<RoleManagement />}
            />
            <Route
              path="/dashboard/super-admin/users"
              element={<UserManagement />}
            />
            <Route
              path="/dashboard/super-admin/audit"
              element={<AuditLogs />}
            />
            <Route
              path="/dashboard/executive-admin"
              element={<ExecutiveAdminDashboard />}
            />
            <Route
              path="/dashboard/executive-admin/organizations"
              element={<Organizations />}
            />
            <Route
              path="/dashboard/executive-admin/doctors"
              element={<Doctors />}
            />
            <Route
              path="/dashboard/executive-admin/technicians"
              element={<Technicians />}
            />
            <Route
              path="/dashboard/cluster-head"
              element={<ClusterHeadDashboard />}
            />
            <Route
              path="/dashboard/cluster-head/team"
              element={<TeamManagement />}
            />
            <Route
              path="/dashboard/user-head"
              element={<UserHeadDashboard />}
            />
            <Route path="/dashboard/nurse" element={<NurseDashboard />} />
            <Route path="/dashboard/user" element={<UserDashboard />} />
            <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
            <Route path="/dashboard/shared/devices" element={<Devices />} />
            <Route path="/dashboard/shared/reports" element={<Reports />} />
            <Route path="/dashboard/shared/payments" element={<Payments />} />
            <Route
              path="/dashboard/shared/organization"
              element={<Organization />}
            />
            <Route path="/dashboard/user/profile" element={<Profile />} />
            <Route path="/dashboard/user/sessions" element={<Sessions />} />
            <Route
              path="/dashboard/user/consultancy"
              element={<Consultancy />}
            />
            <Route path="/dashboard/doctor/schedule" element={<Schedule />} />
            <Route
              path="/dashboard/doctor/consultations"
              element={<Consultations />}
            />
            <Route
              path="/dashboard/doctor/prescriptions"
              element={<Prescriptions />}
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
