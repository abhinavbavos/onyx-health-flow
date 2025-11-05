import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { Building2, Stethoscope, UserCog, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import { listOrganizations } from "@/services/organization.service";
import { listDoctors } from "@/services/doctor.service";
import { listTechnicians } from "@/services/technician.service";

const ExecutiveAdminDashboard = () => {
  const location = useLocation();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    organizations: 0,
    doctors: 0,
    technicians: 0,
    devices: 0,
  });

  const [orgOverview, setOrgOverview] = useState<
    { name: string; doctors: number; devices: number; status: string }[]
  >([]);

  const isMainDashboard = location.pathname === "/dashboard/executive-admin";

  // small helper
  const isArray = (value: any): value is any[] => Array.isArray(value);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        listOrganizations(), // 0
        listDoctors(),       // 1
        listTechnicians(),   // 2
      ]);

      // ---------- ORGANIZATIONS ----------
      let organizations: any[] = [];
      if (results[0].status === "fulfilled") {
        const orgData = results[0].value;
        console.log("🏥 Raw organizations response:", orgData);

        organizations = isArray(orgData?.organizations)
          ? orgData.organizations
          : isArray(orgData)
          ? orgData
          : [];
      } else {
        console.error("❌ Failed to fetch organizations:", results[0].reason);
      }

      // ---------- DOCTORS ----------
      let doctors: any[] = [];
      if (results[1].status === "fulfilled") {
        const docData = results[1].value;
        console.log("🩺 Raw doctors response:", docData);

        doctors = isArray(docData?.doctors)
          ? docData.doctors
          : isArray(docData)
          ? docData
          : [];
      } else {
        console.warn(
          "⚠️ Doctors API failed or not implemented yet. Doctors will show as 0.",
          results[1].reason
        );
      }

      // ---------- TECHNICIANS ----------
      let technicians: any[] = [];
      if (results[2].status === "fulfilled") {
        const techData = results[2].value;
        console.log("🔧 Raw technicians response:", techData);

        technicians = isArray(techData?.technicians)
          ? techData.technicians
          : isArray(techData)
          ? techData
          : [];
      } else {
        console.error("❌ Failed to fetch technicians:", results[2].reason);
      }

      console.log("✅ Parsed data:", {
        organizations,
        doctors,
        technicians,
      });

      // total devices from organizations
      const totalDevices = organizations.reduce(
        (sum: number, org: any) => sum + (org.devices?.length || 0),
        0
      );

      // overview rows
      const overview = organizations.map((org: any) => ({
        name: org.organizationName,
        doctors: doctors.filter(
          (d: any) => d.orgId === org.id || d.orgId === org._id
        ).length,
        devices: org.devices?.length || 0,
        status: org.status || "Inactive",
      }));

      setStats({
        organizations: organizations.length,
        doctors: doctors.length,
        technicians: technicians.length,
        devices: totalDevices,
      });

      setOrgOverview(overview);
    } catch (err) {
      console.error("💥 Unexpected error in dashboard fetch:", err);
      toast({
        title: "Error fetching dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout>
      {isMainDashboard ? (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Executive Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Organization and resource management
            </p>
          </div>

          {loading ? (
            <div className="text-center text-muted-foreground py-10">
              Loading dashboard data...
            </div>
          ) : (
            <>
              {/* Top Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Organizations"
                  value={stats.organizations.toString()}
                  icon={Building2}
                  variant="primary"
                  trend={{ value: "Live count", isPositive: true }}
                />
                <StatCard
                  title="Active Doctors"
                  value={stats.doctors.toString()}
                  icon={Stethoscope}
                  variant="secondary"
                  trend={{ value: "Live count", isPositive: true }}
                />
                <StatCard
                  title="Technicians"
                  value={stats.technicians.toString()}
                  icon={UserCog}
                  variant="default"
                />
                <StatCard
                  title="Connected Devices"
                  value={stats.devices.toString()}
                  icon={Settings}
                  variant="success"
                />
              </div>

              {/* Organization Overview */}
              <div className="bg-card rounded-lg shadow-card p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Organization Overview
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">
                          Organization
                        </th>
                        <th className="text-left py-3 px-4 font-semibold">
                          Doctors
                        </th>
                        <th className="text-left py-3 px-4 font-semibold">
                          Devices
                        </th>
                        <th className="text-left py-3 px-4 font-semibold">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orgOverview.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center text-muted-foreground py-6"
                          >
                            No organization data available
                          </td>
                        </tr>
                      ) : (
                        orgOverview.map((org, i) => (
                          <tr
                            key={i}
                            className="border-b hover:bg-muted/50 transition-colors"
                          >
                            <td className="py-3 px-4 font-medium">
                              {org.name}
                            </td>
                            <td className="py-3 px-4">{org.doctors}</td>
                            <td className="py-3 px-4">{org.devices}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  org.status === "Active"
                                    ? "bg-success/10 text-success"
                                    : "bg-warning/10 text-warning"
                                }`}
                              >
                                {org.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="mt-4">
          <Outlet />
        </div>
      )}
    </DashboardLayout>
  );
};

export default ExecutiveAdminDashboard;
