import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  Sparkles,
  Download,
  FileSpreadsheet,
  FileText,
  Users,
  Coins,
  Cpu,
  BarChart3,
  PieChart as PieIcon,
  Loader2,
  Database,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  getMachineAnalytics,
  exportMachineSummary,
  exportBulkRawData,
  MachineAnalyticsSummary,
} from "@/services/machineAnalytics.service";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe", "#a78bfa", "#f472b6"];

const MOCK_DATA: MachineAnalyticsSummary = {
  machineNickName: "Onyx Baner (Sandbox Device)",
  machineId: "mock-onyx-baner-id",
  dateRange: {
    startDate: "01-01-2025",
    endDate: "31-12-2026",
  },
  userCount: 432,
  testCount: 989,
  testsPerDevice: [
    {
      deviceId: "dev-h-usb",
      count: 618,
      deviceName: "Height-USB",
      price: 10.0,
      subtotal: 6180.0,
    },
    {
      deviceId: "dev-spo2",
      count: 142,
      deviceName: "SPO2",
      price: 15.0,
      subtotal: 2130.0,
    },
    {
      deviceId: "dev-glucose",
      count: 120,
      deviceName: "Blood Glucose",
      price: 25.0,
      subtotal: 3000.0,
    },
    {
      deviceId: "dev-visc",
      count: 85,
      deviceName: "Visceral Fat",
      price: 20.0,
      subtotal: 1700.0,
    },
    {
      deviceId: "dev-ecg",
      count: 24,
      deviceName: "ECG",
      price: 50.0,
      subtotal: 1200.0,
    },
  ],
};

const EA_MachineAnalytics = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [data, setData] = useState<MachineAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [filter, setFilter] = useState<"today" | "week" | "month" | "custom">("month");

  // Custom date inputs
  const [dates, setDates] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  // Export Loading States
  const [exportSummaryXlsxLoading, setExportSummaryXlsxLoading] = useState(false);
  const [exportSummaryPdfLoading, setExportSummaryPdfLoading] = useState(false);
  const [exportBulkXlsxLoading, setExportBulkXlsxLoading] = useState(false);
  const [exportBulkPdfLoading, setExportBulkPdfLoading] = useState(false);

  // Helper to compute dates based on selection
  const getDateRangeForFilter = (
    selectedFilter: "today" | "week" | "month" | "custom",
    customDates: { startDate: string; endDate: string }
  ) => {
    const end = new Date();
    const start = new Date();

    if (selectedFilter === "today") {
      // today to today
    } else if (selectedFilter === "week") {
      start.setDate(end.getDate() - 7);
    } else if (selectedFilter === "month") {
      start.setDate(end.getDate() - 30);
    } else if (selectedFilter === "custom") {
      return { startDate: customDates.startDate, endDate: customDates.endDate };
    }

    const format = (d: Date) => d.toISOString().split("T")[0];
    return { startDate: format(start), endDate: format(end) };
  };

  const fetchMachineAnalytics = async () => {
    if (!productId) return;
    setLoading(true);
    const range = getDateRangeForFilter(filter, dates);

    try {
      const response = await getMachineAnalytics(productId, {
        startDate: range.startDate,
        endDate: range.endDate,
      });

      if (response && (response.testCount !== undefined || response.testsPerDevice)) {
        setData(response);
        setUsingMock(false);
      } else {
        throw new Error("Invalid format received");
      }
    } catch (err) {
      console.warn("⚠️ Machine Analytics API failed. Falling back to sandbox telemetry.");
      // Enhance mock details with correct productId and display range
      setData({
        ...MOCK_DATA,
        machineId: productId,
        dateRange: {
          startDate: range.startDate || "01-01-2025",
          endDate: range.endDate || "31-12-2026",
        },
      });
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachineAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, filter]);

  const handleCustomDateApply = () => {
    if (filter === "custom") {
      fetchMachineAnalytics();
    }
  };

  // Get active query parameters helper for exports
  const getExportParams = () => {
    return getDateRangeForFilter(filter, dates);
  };

  // Excel Summary Export
  const handleExportSummaryXlsx = async () => {
    if (!productId) return;
    setExportSummaryXlsxLoading(true);
    try {
      await exportMachineSummary(productId, "xlsx", getExportParams());
      toast({ title: "Summary Excel downloaded successfully" });
    } catch (err) {
      console.error(err);
      toast({
        title: "Export failed",
        description: "Could not export summary Excel report.",
        variant: "destructive",
      });
    } finally {
      setExportSummaryXlsxLoading(false);
    }
  };

  // PDF Summary Export
  const handleExportSummaryPdf = async () => {
    if (!productId) return;
    setExportSummaryPdfLoading(true);
    try {
      await exportMachineSummary(productId, "pdf", getExportParams());
      toast({ title: "Summary PDF downloaded successfully" });
    } catch (err) {
      console.error(err);
      toast({
        title: "Export failed",
        description: "Could not export summary PDF report.",
        variant: "destructive",
      });
    } finally {
      setExportSummaryPdfLoading(false);
    }
  };

  // Excel Bulk Raw Export
  const handleExportBulkXlsx = async () => {
    if (!productId) return;
    setExportBulkXlsxLoading(true);
    try {
      await exportBulkRawData(productId, "xlsx", getExportParams());
      toast({ title: "Bulk Raw Session Excel downloaded successfully" });
    } catch (err) {
      console.error(err);
      toast({
        title: "Bulk export failed",
        description: "Could not export bulk raw session Excel file.",
        variant: "destructive",
      });
    } finally {
      setExportBulkXlsxLoading(false);
    }
  };

  // PDF Bulk Raw Export
  const handleExportBulkPdf = async () => {
    if (!productId) return;
    setExportBulkPdfLoading(true);
    try {
      await exportBulkRawData(productId, "pdf", getExportParams());
      toast({ title: "Bulk Raw Session PDF downloaded successfully" });
    } catch (err) {
      console.error(err);
      toast({
        title: "Bulk export failed",
        description: "Could not export bulk raw session PDF file.",
        variant: "destructive",
      });
    } finally {
      setExportBulkPdfLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse p-4 md:p-8">
        <div className="flex items-center gap-4">
          <div className="h-10 w-24 bg-gray-200/50 rounded-xl" />
          <div className="h-10 w-64 bg-gray-200/50 rounded-xl" />
        </div>
        <div className="h-6 w-96 bg-gray-200/50 rounded-lg mt-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200/50 rounded-[24px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="h-80 bg-gray-200/50 rounded-[30px]" />
          <div className="h-80 bg-gray-200/50 rounded-[30px]" />
        </div>
      </div>
    );
  }

  // Calculate estimated total revenue
  const totalRevenue = data.testsPerDevice?.reduce((sum, item) => sum + (item.subtotal || 0), 0) || 0;

  // Pie chart mapping
  const devicePieData = data.testsPerDevice?.map((item, index) => ({
    name: item.deviceName,
    value: item.count,
    color: COLORS[index % COLORS.length],
  })) || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 md:p-8">
      {/* Navigation & Title Header */}
      <div className="flex flex-col gap-4">
        <Button
          onClick={() => navigate("/dashboard/executive-admin/devices")}
          variant="ghost"
          className="w-fit text-gray-500 hover:text-gray-900 rounded-xl font-bold flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Devices
        </Button>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#2d3748] flex items-center gap-3">
              <Cpu className="h-10 w-10 text-primary" /> {data.machineNickName}
            </h1>
            <p className="text-lg text-gray-500 font-medium flex items-center gap-2">
              Machine ID: <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded text-gray-600">{data.machineId}</span>
              {usingMock && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#fef7e0] text-[#b06000] border border-[#fce8b2]">
                  <Sparkles className="h-3 w-3 animate-spin" /> Sandbox Demo Mode
                </span>
              )}
            </p>
          </div>

          {/* Date Filter Bar */}
          <div className="flex flex-wrap items-center gap-4 bg-white/40 border border-white/60 p-3 rounded-[24px] shadow-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-bold text-gray-600">Date Range</span>
            </div>

            <Select value={filter} onValueChange={(val: any) => setFilter(val)}>
              <SelectTrigger className="w-[140px] rounded-xl h-10 border-gray-200 font-bold text-gray-700 bg-white">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            {filter === "custom" && (
              <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                <Input
                  type="date"
                  value={dates.startDate}
                  onChange={(e) => setDates({ ...dates, startDate: e.target.value })}
                  className="h-10 w-36 rounded-xl border-gray-200 bg-white text-xs font-bold text-gray-600"
                />
                <span className="text-gray-400 text-xs font-extrabold">to</span>
                <Input
                  type="date"
                  value={dates.endDate}
                  onChange={(e) => setDates({ ...dates, endDate: e.target.value })}
                  className="h-10 w-36 rounded-xl border-gray-200 bg-white text-xs font-bold text-gray-600"
                />
                <Button
                  onClick={handleCustomDateApply}
                  className="h-10 px-4 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-xs shadow-md"
                >
                  Apply
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Overview Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Tests */}
        <Card className="glass-panel border-none shadow-xl rounded-[24px] overflow-hidden hover:scale-[1.02] transition-transform">
          <CardContent className="p-6 relative">
            <div className="absolute right-4 top-4 p-3 rounded-full bg-primary/10 text-primary">
              <Activity className="h-6 w-6" />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Tests Run</p>
            <h3 className="text-4xl font-extrabold text-[#2d3748] mt-2">{data.testCount}</h3>
            <p className="text-xs text-gray-400 mt-4 font-medium">Aggregated across all sub-devices</p>
          </CardContent>
        </Card>

        {/* Unique Patients */}
        <Card className="glass-panel border-none shadow-xl rounded-[24px] overflow-hidden hover:scale-[1.02] transition-transform">
          <CardContent className="p-6 relative">
            <div className="absolute right-4 top-4 p-3 rounded-full bg-blue-500/10 text-blue-500">
              <Users className="h-6 w-6" />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Unique Patients</p>
            <h3 className="text-4xl font-extrabold text-[#2d3748] mt-2">{data.userCount}</h3>
            <p className="text-xs text-gray-400 mt-4 font-medium">Unique accounts serviced by machine</p>
          </CardContent>
        </Card>

        {/* Estimated Revenue */}
        <Card className="glass-panel border-none shadow-xl rounded-[24px] overflow-hidden hover:scale-[1.02] transition-transform">
          <CardContent className="p-6 relative">
            <div className="absolute right-4 top-4 p-3 rounded-full bg-emerald-500/10 text-emerald-500">
              <Coins className="h-6 w-6" />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Estimated Revenue</p>
            <h3 className="text-4xl font-extrabold text-[#2d3748] mt-2">
              ₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-gray-400 mt-4 font-medium">Sum of all sub-device subtotals</p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Tests Count - Bar Chart */}
        <Card className="glass-panel border-none shadow-xl rounded-[30px]">
          <CardHeader className="bg-white/30 border-b border-white/50 pb-4">
            <CardTitle className="text-xl font-bold text-[#2d3748] flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" /> Tests Volume per Sub-Device
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.testsPerDevice} barSize={32}>
                  <XAxis dataKey="deviceName" stroke="#94a3b8" fontSize={11} fontWeight={600} />
                  <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255,255,255,0.9)",
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(260 60% 65%)" radius={[8, 8, 0, 0]}>
                    {data.testsPerDevice?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Device Distribution - Donut Chart */}
        <Card className="glass-panel border-none shadow-xl rounded-[30px]">
          <CardHeader className="bg-white/30 border-b border-white/50 pb-4">
            <CardTitle className="text-xl font-bold text-[#2d3748] flex items-center gap-2">
              <PieIcon className="h-5 w-5 text-primary" /> Share Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80 w-full flex flex-col items-center justify-between">
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={devicePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {devicePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "rgba(255,255,255,0.9)",
                        borderRadius: "16px",
                        border: "none",
                        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends */}
              <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-gray-500">
                {devicePieData.map((g, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
                    <span>{g.name} ({g.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sub-device Breakdown Table */}
      <Card className="glass-panel border-none shadow-xl rounded-[30px] overflow-hidden">
        <CardHeader className="bg-white/30 border-b border-white/50 pb-4">
          <CardTitle className="text-xl font-bold text-[#2d3748] flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" /> Diagnostic Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-3.5 px-4 font-bold text-gray-700">Sub-Device / Test</th>
                  <th className="text-center py-3.5 px-4 font-bold text-gray-700">Test Count</th>
                  <th className="text-right py-3.5 px-4 font-bold text-gray-700">Unit Price</th>
                  <th className="text-right py-3.5 px-4 font-bold text-gray-700">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {data.testsPerDevice?.map((item) => (
                  <tr key={item.deviceId} className="border-b hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-800">{item.deviceName}</td>
                    <td className="py-3 px-4 text-center font-bold text-gray-600">{item.count}</td>
                    <td className="py-3 px-4 text-right text-gray-500">₹{item.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-gray-800">₹{item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
                {(!data.testsPerDevice || data.testsPerDevice.length === 0) && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-muted-foreground">
                      No sub-device usage registered.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Export & Extraction Actions Panel */}
      <Card className="border-none shadow-2xl rounded-[30px] overflow-hidden bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-slate-800 dark:to-indigo-950">
        <CardHeader className="pb-3 border-b border-indigo-200/50 dark:border-indigo-900/50">
          <CardTitle className="text-xl font-bold text-indigo-950 dark:text-indigo-100 flex items-center gap-2">
            <Database className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> Reports & Raw Telemetry Data Extraction
          </CardTitle>
          <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
            Export structured telemetry, summary figures or complete flat session logs containing demographic columns.
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Summary Data Exports */}
            <div className="space-y-4 bg-white/60 dark:bg-slate-900/50 p-5 rounded-2xl border border-white/50">
              <div>
                <h4 className="font-extrabold text-[#2d3748] dark:text-slate-100 text-sm">Dashboard Summary Report</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Generates an report with sub-device volume distributions, price settings, and subtotal metrics.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleExportSummaryXlsx}
                  disabled={exportSummaryXlsxLoading}
                  className="flex-1 bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-200 rounded-xl font-bold text-xs py-5 h-auto shadow-sm"
                  variant="outline"
                >
                  {exportSummaryXlsxLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                  )}
                  Export Excel (.xlsx)
                </Button>
                <Button
                  onClick={handleExportSummaryPdf}
                  disabled={exportSummaryPdfLoading}
                  className="flex-1 bg-white hover:bg-gray-50 text-rose-600 border border-rose-200 rounded-xl font-bold text-xs py-5 h-auto shadow-sm"
                  variant="outline"
                >
                  {exportSummaryPdfLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  Export PDF (.pdf)
                </Button>
              </div>
            </div>

            {/* Flat Row-level Session Exports */}
            <div className="space-y-4 bg-white/60 dark:bg-slate-900/50 p-5 rounded-2xl border border-white/50">
              <div>
                <h4 className="font-extrabold text-[#2d3748] dark:text-slate-100 text-sm">Granular Session Raw Logs</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Extracts raw Patient Demographics combined with detailed clinical measurements. Dynamic columns adapt per test.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleExportBulkXlsx}
                  disabled={exportBulkXlsxLoading}
                  className="flex-1 bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-200 rounded-xl font-bold text-xs py-5 h-auto shadow-sm"
                  variant="outline"
                >
                  {exportBulkXlsxLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                  )}
                  Bulk Raw Excel (.xlsx)
                </Button>
                <Button
                  onClick={handleExportBulkPdf}
                  disabled={exportBulkPdfLoading}
                  className="flex-1 bg-white hover:bg-gray-50 text-rose-600 border border-rose-200 rounded-xl font-bold text-xs py-5 h-auto shadow-sm"
                  variant="outline"
                >
                  {exportBulkPdfLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  Bulk Raw PDF (.pdf)
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EA_MachineAnalytics;


