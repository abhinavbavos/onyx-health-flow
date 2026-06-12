import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden bg-dashboard-wavy p-4 gap-0">
      {/* Decorative blobs sit behind everything */}
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden pl-4 relative z-10">
        <Topbar />
        <main className="flex-1 overflow-y-auto pt-4 pb-4 pr-2 custom-scrollbar">
          <div className="page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
