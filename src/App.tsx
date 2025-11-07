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
  useLocation,
} from "react-router-dom";

// Core pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./components/auth/LoginPage";

// Dashboards (Layouts)
import SuperAdminDashboard from "./pages/dashboard/super-admin/SuperAdminDashboard";
import ExecutiveAdminDashboard from "./pages/dashboard/executive-admin/ExecutiveAdminDashboard";
import ClusterHeadDashboard from "./pages/dashboard/cluster-head/ClusterHeadDashboard";
import UserHeadDashboard from "./pages/dashboard/user-head/UserHeadDashboard";
import NurseDashboard from "./pages/dashboard/nurse/NurseDashboard";
import UserDashboard from "./pages/dashboard/user/UserDashboard";
import DoctorDashboard from "./pages/dashboard/doctor/DoctorDashboard";

// Super Admin pages
import RoleManagement from "./pages/dashboard/super-admin/RoleManagement";
import UserManagement from "./pages/dashboard/super-admin/UserManagement";
import AuditLogs from "./pages/dashboard/super-admin/AuditLogs";

// Executive Admin pages
import ExecutiveAdmins from "./pages/dashboard/executive-admin/ExecutiveAdmins";
import ClusterHeads from "./pages/dashboard/executive-admin/ClusterHeads";
import Organizations from "./pages/dashboard/executive-admin/Organizations";
import Doctors from "./pages/dashboard/executive-admin/Doctors";
import Technicians from "./pages/dashboard/executive-admin/Technicians";
import OrganizationView from "./pages/dashboard/executive-admin/OrganisationView";
import Nurses from "./pages/dashboard/executive-admin/Nurses";
import UserHeads from "./pages/dashboard/executive-admin/UserHeads";
import Devices from "./pages/dashboard/executive-admin/Devices";
import Reports from "./pages/dashboard/executive-admin/Reports";

// Cluster Head pages
import TeamManagement from "./pages/dashboard/cluster-head/TeamManagement";

// User Head pages
// import Nurses from "./pages/dashboard/user-head/Nurses";

// Shared pages
// import Devices from "./pages/dashboard/shared/Devices";
// import Reports from "./pages/dashboard/shared/Reports";
import Payments from "./pages/dashboard/shared/Payments";
import Organization from "./pages/dashboard/shared/Organization";

// User pages
import Profile from "./pages/dashboard/user/Profile";
import Sessions from "./pages/dashboard/user/Sessions";
import Consultancy from "./pages/dashboard/user/Consultancy";

// Doctor pages
import Schedule from "./pages/dashboard/doctor/Schedule";
import Consultations from "./pages/dashboard/doctor/Consultations";
import Prescriptions from "./pages/dashboard/doctor/Prescriptions";

// Auth protection
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

// ===============================
// 🔍 Route Logger (for debugging)
// ===============================
const RouteLogger = () => {
  const location = useLocation();
  useEffect(() => {
    console.log("🗺️ Route changed:", location.pathname);
  }, [location]);
  return null;
};

// ===============================
// 🔐 Persistent Auth Redirect (fixed)
// ===============================
const AutoRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    let role = localStorage.getItem("userRole");

    if (token && role) {
      role = role.replace(/_/g, "-");

      // 🚫 Only redirect when user is on login/signup/home
      const redirectPaths = ["/", "/login", "/signup"];
      if (redirectPaths.includes(location.pathname)) {
        console.log("🚀 Auto-redirecting to:", `/dashboard/${role}`);
        navigate(`/dashboard/${role}`);
      } else {
        console.log("✅ Staying on current path:", location.pathname);
      }
    }
  }, [navigate, location.pathname]);

  return null;
};

// ===============================
// 🚀 Main App Component
// ===============================
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouteLogger />
        <AutoRedirect />

        <Routes>
          {/* ===============================
              PUBLIC ROUTES
          =============================== */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/signup"
            element={
              localStorage.getItem("userRole") &&
              localStorage.getItem("userRole") !== "user" ? (
                <Navigate
                  to={`/dashboard/${localStorage
                    .getItem("userRole")!
                    .replace(/_/g, "-")}`}
                  replace
                />
              ) : (
                <LoginPage />
              )
            }
          />

          {/* ===============================
              SUPER ADMIN
          =============================== */}
          <Route element={<ProtectedRoute allowedRoles={["super-admin"]} />}>
            <Route
              path="/dashboard/super-admin"
              element={<SuperAdminDashboard />}
            >
              <Route index element={<RoleManagement />} />
              <Route path="roles" element={<RoleManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="audit" element={<AuditLogs />} />
            </Route>
          </Route>

          {/* ===============================
              EXECUTIVE ADMIN
          =============================== */}
          <Route
            element={<ProtectedRoute allowedRoles={["executive-admin"]} />}
          >
            <Route
              path="/dashboard/executive-admin"
              element={<ExecutiveAdminDashboard />}
            >
              <Route index element={<Organizations />} />
              <Route path="executives" element={<ExecutiveAdmins />} />

              <Route path="cluster-heads" element={<ClusterHeads />} />
              <Route path="organizations" element={<Organizations />} />
              <Route
                path="organizations/:id"
                element={<OrganizationView />}
              />{" "}
              {/* ✅ FIXED */}
              <Route path="doctors" element={<Doctors />} />
              <Route path="devices" element={<Devices />} />

              <Route path="user-heads" element={<UserHeads />} />
              <Route path="technicians" element={<Technicians />} />
              <Route path="nurses" element={<Nurses />} />
              <Route path="reports" element={<Reports />} />
            </Route>
          </Route>

          {/* ===============================
              CLUSTER HEAD
          =============================== */}
          <Route element={<ProtectedRoute allowedRoles={["cluster-head"]} />}>
            <Route
              path="/dashboard/cluster-head"
              element={<ClusterHeadDashboard />}
            >
              <Route index element={<TeamManagement />} />
              <Route path="organizations" element={<Organizations />} />
              <Route path="team" element={<TeamManagement />} />
              <Route path="payments" element={<Payments />} />
              <Route path="devices" element={<Devices />} />
              <Route path="reports" element={<Reports />} />
            </Route>
          </Route>

          {/* ===============================
              USER HEAD
          =============================== */}
          <Route element={<ProtectedRoute allowedRoles={["user-head"]} />}>
            <Route path="/dashboard/user-head" element={<UserHeadDashboard />}>
              <Route index element={<Nurses />} />
              <Route path="nurses" element={<Nurses />} />
              <Route path="organization" element={<Organization />} />
              <Route path="devices" element={<Devices />} />
              <Route path="reports" element={<Reports />} />
            </Route>
          </Route>

          {/* ===============================
              NURSE
          =============================== */}
          <Route element={<ProtectedRoute allowedRoles={["nurse"]} />}>
            <Route path="/dashboard/nurse" element={<NurseDashboard />}>
              <Route index element={<Devices />} />
              <Route path="devices" element={<Devices />} />
              <Route path="reports" element={<Reports />} />
              <Route path="organization" element={<Organization />} />
            </Route>
          </Route>

          {/* ===============================
              USER (PATIENT)
          =============================== */}
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/dashboard/user" element={<UserDashboard />}>
              <Route index element={<Profile />} />
              <Route path="profile" element={<Profile />} />
              <Route path="reports" element={<Reports />} />
              <Route path="sessions" element={<Sessions />} />
              <Route path="consultancy" element={<Consultancy />} />
              <Route path="payments" element={<Payments />} />
            </Route>
          </Route>

          {/* ===============================
              DOCTOR
          =============================== */}
          <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
            <Route path="/dashboard/doctor" element={<DoctorDashboard />}>
              <Route index element={<Schedule />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="consultations" element={<Consultations />} />
              <Route path="prescriptions" element={<Prescriptions />} />
              <Route path="reports" element={<Reports />} />
              <Route path="payments" element={<Payments />} />
            </Route>
          </Route>

          {/* ===============================
              NOT FOUND
          =============================== */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
