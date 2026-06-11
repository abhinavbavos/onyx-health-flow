import { useEffect, useState } from "react";
import SimpleTable from "@/components/dashboard/SimpleTable";
import { listDevices, toggleDevicePaymentMode } from "@/services/device.service";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

type Device = {
  id: string;
  name?: string;
  deviceCode?: string;
  modelNo?: string;
  status?: string;
  lastActive?: string;
  location?: string;
  paymentMode: boolean;
};

const CH_Devices = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Device[]>([]);

  const fetchDevicesData = async () => {
    setLoading(true);
    try {
      const devs = await listDevices();
      const mapped = (devs || []).map((d: any) => ({
        id: d?._id || d?.id,
        name: d?.name || d?.deviceName,
        deviceCode: d?.deviceCode,
        modelNo: d?.modelNo,
        status: d?.online ? "Online" : "Offline",
        lastActive: d?.lastActive ? new Date(d.lastActive).toLocaleString() : "—",
        location: d?.location || `${d?.city || ""} ${d?.country || ""}`.trim(),
        paymentMode: d?.paymentMode ?? false,
      }));
      setRows(mapped);
    } catch (err: any) {
      toast({
        title: "Failed to load devices",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevicesData();
  }, []);

  const handleTogglePaymentMode = async (deviceId: string, currentVal: boolean) => {
    try {
      const newVal = !currentVal;
      await toggleDevicePaymentMode(deviceId, newVal);
      setRows((prev) =>
        prev.map((r) => (r.id === deviceId ? { ...r, paymentMode: newVal } : r))
      );
      toast({
        title: `Payment mode ${newVal ? "enabled" : "disabled"}`,
      });
    } catch (err: any) {
      toast({
        title: "Failed to toggle payment mode",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const columns = [
    { key: "name", header: "Device" },
    { key: "deviceCode", header: "Code" },
    { key: "modelNo", header: "Model" },
    { key: "status", header: "Status" },
    { key: "lastActive", header: "Last Active" },
    { key: "location", header: "Location" },
    {
      key: "paymentMode",
      header: "Payment Enabled",
      render: (row: Device) => (
        <Switch
          checked={row.paymentMode}
          onCheckedChange={() => handleTogglePaymentMode(row.id, row.paymentMode)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Devices</h1>
      <SimpleTable columns={columns} data={rows} loading={loading} />
    </div>
  );
};

export default CH_Devices;
