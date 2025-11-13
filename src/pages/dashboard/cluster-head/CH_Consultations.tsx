import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SimpleTable from "@/components/dashboard/SimpleTable";
// If consultations are "sessions", reuse:
import { listSessions } from "@/services/session.service";

type Row = {
  patient?: string;
  doctor?: string;
  device?: string;
  status?: string;
  startTime?: string;
  duration?: string;
};

const CH_Consultations = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await listSessions(); // or your consultations service
        const mapped = (data || []).map((c: any) => ({
          patient: c?.patient?.name || c?.profile?.name,
          doctor: c?.doctor?.name,
          device: c?.device?.deviceCode || c?.deviceCode,
          status: c?.status,
          startTime: c?.startTime ? new Date(c.startTime).toLocaleString() : "—",
          duration: c?.duration ? `${c.duration} min` : "—",
        }));
        setRows(mapped);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const columns = [
    { key: "patient", header: "Patient" },
    { key: "doctor", header: "Doctor" },
    { key: "device", header: "Device" },
    { key: "status", header: "Status" },
    { key: "startTime", header: "Start Time" },
    { key: "duration", header: "Duration" },
  ];

  return (
    // <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Consultations</h1>
        <SimpleTable columns={columns} data={rows} loading={loading} />
      </div>
    // </DashboardLayout>
  );
};

export default CH_Consultations;
