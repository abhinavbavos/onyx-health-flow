import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./components/auth/LoginPage";

// Dashboard pages
import SuperAdminDashboard from "./pages/dashboard/SuperAdminDashboard";
import ExecutiveAdminDashboard from "./pages/dashboard/ExecutiveAdminDashboard";
import ClusterHeadDashboard from "./pages/dashboard/ClusterHeadDashboard";
import UserHeadDashboard from "./pages/dashboard/UserHeadDashboard";
import NurseDashboard from "./pages/dashboard/NurseDashboard";
import UserDashboard from "./pages/dashboard/UserDashboard";
import DoctorDashboard from "./pages/dashboard/DoctorDashboard";

// Super Admin pages
import RoleManagement from "./pages/dashboard/super-admin/RoleManagement";
import UserManagement from "./pages/dashboard/super-admin/UserManagement";
import AuditLogs from "./pages/dashboard/super-admin/AuditLogs";

// Executive Admin pages
import Organizations from "./pages/dashboard/executive-admin/Organizations";
import Doctors from "./pages/dashboard/executive-admin/Doctors";
import Technicians from "./pages/dashboard/executive-admin/Technicians";

// Cluster Head pages
import TeamManagement from "./pages/dashboard/cluster-head/TeamManagement";

// User Head pages
import Nurses from "./pages/dashboard/user-head/Nurses";

// Shared pages
import Devices from "./pages/dashboard/shared/Devices";
import Reports from "./pages/dashboard/shared/Reports";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Super Admin Routes */}
          <Route path="/dashboard/super-admin" element={<SuperAdminDashboard />} />
          <Route path="/dashboard/super-admin/roles" element={<RoleManagement />} />
          <Route path="/dashboard/super-admin/users" element={<UserManagement />} />
          <Route path="/dashboard/super-admin/audit" element={<AuditLogs />} />
          
          {/* Executive Admin Routes */}
          <Route path="/dashboard/executive-admin" element={<ExecutiveAdminDashboard />} />
          <Route path="/dashboard/executive-admin/organizations" element={<Organizations />} />
          <Route path="/dashboard/executive-admin/doctors" element={<Doctors />} />
          <Route path="/dashboard/executive-admin/technicians" element={<Technicians />} />
          <Route path="/dashboard/executive-admin/devices" element={<Devices />} />
          <Route path="/dashboard/executive-admin/reports" element={<Reports />} />
          
          {/* Cluster Head Routes */}
          <Route path="/dashboard/cluster-head" element={<ClusterHeadDashboard />} />
          <Route path="/dashboard/cluster-head/organizations" element={<Organizations />} />
          <Route path="/dashboard/cluster-head/team" element={<TeamManagement />} />
          <Route path="/dashboard/cluster-head/payments" element={<Payments />} />
          <Route path="/dashboard/cluster-head/devices" element={<Devices />} />
          <Route path="/dashboard/cluster-head/reports" element={<Reports />} />
          
          {/* User Head Routes */}
          <Route path="/dashboard/user-head" element={<UserHeadDashboard />} />
          <Route path="/dashboard/user-head/nurses" element={<Nurses />} />
          <Route path="/dashboard/user-head/organization" element={<Organization />} />
          <Route path="/dashboard/user-head/devices" element={<Devices />} />
          <Route path="/dashboard/user-head/reports" element={<Reports />} />
          
          {/* Nurse Routes */}
          <Route path="/dashboard/nurse" element={<NurseDashboard />} />
          <Route path="/dashboard/nurse/devices" element={<Devices />} />
          <Route path="/dashboard/nurse/reports" element={<Reports />} />
          <Route path="/dashboard/nurse/organization" element={<Organization />} />
          
          {/* User Routes */}
          <Route path="/dashboard/user" element={<UserDashboard />} />
          <Route path="/dashboard/user/profile" element={<Profile />} />
          <Route path="/dashboard/user/reports" element={<Reports />} />
          <Route path="/dashboard/user/sessions" element={<Sessions />} />
          <Route path="/dashboard/user/consultancy" element={<Consultancy />} />
          <Route path="/dashboard/user/payments" element={<Payments />} />
          
          {/* Doctor Routes */}
          <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
          <Route path="/dashboard/doctor/reports" element={<Reports />} />
          <Route path="/dashboard/doctor/schedule" element={<Schedule />} />
          <Route path="/dashboard/doctor/consultations" element={<Consultations />} />
          <Route path="/dashboard/doctor/prescriptions" element={<Prescriptions />} />
          <Route path="/dashboard/doctor/payments" element={<Payments />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
