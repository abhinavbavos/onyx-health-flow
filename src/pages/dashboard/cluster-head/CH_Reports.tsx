import { useEffect, useState } from "react";
import SimpleTable from "@/components/dashboard/SimpleTable";
import { listReportsByOrganization } from "@/services/report.service";

type Row = {
  reportCode?: string;
  profile?: string;
  device?: string;
  uploadedBy?: string;
  createdAt?: string;
  s3Link?: string;
};

const CH_Reports = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        const orgId = localStorage.getItem("organizationId");
        if (!orgId) throw new Error("Organization ID missing");

        const data = await listReportsByOrganization(orgId);
        const mapped = (data?.reports || data || []).map((r: any) => ({
          reportCode: r?.reportCode,
          profile: r?.profile?.name || r?.patientName,
          device: r?.product?.deviceCode || r?.deviceCode,
          uploadedBy: r?.uploadedBy?.name || r?.uploadedByName,
          createdAt: r?.createdAt ? new Date(r.createdAt).toLocaleString() : "—",
          s3Link: r?.s3Link,
        }));
        setRows(mapped);
      } catch (err) {
        console.error("Failed to load organization reports", err);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const columns = [
    { key: "reportCode", header: "Report Code" },
    { key: "profile", header: "Profile" },
    { key: "device", header: "Device" },
    { key: "uploadedBy", header: "Uploaded By" },
    { key: "createdAt", header: "Created At" },
    {
      key: "s3Link",
      header: "Action",
      render: (row: Row) =>
        row.s3Link ? (
          <a href={row.s3Link} target="_blank" rel="noreferrer" className="underline text-primary">
            Download
          </a>
        ) : (
          "—"
        ),
    },
  ];

  return (
    // <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <SimpleTable columns={columns} data={rows} loading={loading} />
      </div>
    // {/* </DashboardLayout> */}
  );
};

export default CH_Reports;
