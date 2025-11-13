import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SimpleTable from "@/components/dashboard/SimpleTable";
import { listDevices } from "@/services/device.service";

type Device = {
  name?: string;
  deviceCode?: string;
  modelNo?: string;
  status?: string;       // your backend may use boolean; format below
  lastActive?: string;
  location?: string;
};

const CH_Devices = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Device[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        const devs = await listDevices();
        const mapped = (devs || []).map((d: any) => ({
          name: d?.name || d?.deviceName,
          deviceCode: d?.deviceCode,
          modelNo: d?.modelNo,
          status: d?.online ? "Online" : "Offline",
          lastActive: d?.lastActive,
          location: d?.location || `${d?.city || ""} ${d?.country || ""}`.trim(),
        }));
        setRows(mapped);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const columns = [
    { key: "name", header: "Device" },
    { key: "deviceCode", header: "Code" },
    { key: "modelNo", header: "Model" },
    { key: "status", header: "Status" },
    { key: "lastActive", header: "Last Active" },
    { key: "location", header: "Location" },
  ];

  return (
    // <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Devices</h1>
        <SimpleTable columns={columns} data={rows} loading={loading} />
      </div>
    // {/* </DashboardLayout> */}
  );
};

export default CH_Devices;
