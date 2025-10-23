import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./components/auth/LoginPage";
import SuperAdminDashboard from "./pages/dashboard/SuperAdminDashboard";
import ExecutiveAdminDashboard from "./pages/dashboard/ExecutiveAdminDashboard";
import ClusterHeadDashboard from "./pages/dashboard/ClusterHeadDashboard";
import UserHeadDashboard from "./pages/dashboard/UserHeadDashboard";
import NurseDashboard from "./pages/dashboard/NurseDashboard";
import UserDashboard from "./pages/dashboard/UserDashboard";
import DoctorDashboard from "./pages/dashboard/DoctorDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard/super-admin" element={<SuperAdminDashboard />} />
          <Route path="/dashboard/executive-admin" element={<ExecutiveAdminDashboard />} />
          <Route path="/dashboard/cluster-head" element={<ClusterHeadDashboard />} />
          <Route path="/dashboard/user-head" element={<UserHeadDashboard />} />
          <Route path="/dashboard/nurse" element={<NurseDashboard />} />
          <Route path="/dashboard/user" element={<UserDashboard />} />
          <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
