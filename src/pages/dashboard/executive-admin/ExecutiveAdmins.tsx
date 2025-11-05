import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, Shield } from "lucide-react";
import { createExecAdmin, verifyExecAdmin, listExecutives } from "@/services/executiveAdmin.service";

const ExecutiveAdmins = () => {
  const { toast } = useToast();
  const [executives, setExecutives] = useState<any[]>([]);
  const [filteredExecutives, setFilteredExecutives] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone_country: "91",
    phone_number: "",
    password: "",
    country: "India",
  });

  // =============================
  // Fetch all Executive Admins
  // =============================
  useEffect(() => {
    const fetchExecutives = async () => {
      setLoading(true);
      try {
        const data = await listExecutives();
        const list = data.executives || data;
        setExecutives(list);
        setFilteredExecutives(list);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error fetching Executive Admins",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchExecutives();
  }, [toast]);

  // =============================
  // Search Filter
  // =============================
  useEffect(() => {
    if (search.trim() === "") setFilteredExecutives(executives);
    else {
      setFilteredExecutives(
        executives.filter((admin) =>
          admin.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, executives]);

  // =============================
  // Create Executive Admin
  // =============================
  const handleCreate = async () => {
    const { name, phone_country, phone_number, password, country } = formData;

    if (!name || !phone_number || !password) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await createExecAdmin({
        phone_number: [phone_country, phone_number],
        password,
        name,
        country,
      });

      toast({
        title: "OTP sent to the provided number",
        description: "Enter the OTP to verify new Executive Admin",
      });

      setDialogOpen(false);
      setOtpDialogOpen(true);
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to create Executive Admin",
        variant: "destructive",
      });
    }
  };

  // =============================
  // Verify OTP
  // =============================
  const handleVerifyOtp = async () => {
    if (!otpCode) {
      toast({ title: "Please enter the OTP", variant: "destructive" });
      return;
    }

    try {
      await verifyExecAdmin({ otp: otpCode });
      toast({ title: "Executive Admin verified successfully" });
      setOtpDialogOpen(false);
      setOtpCode("");

      // Refresh list
      const data = await listExecutives();
      setExecutives(data.executives || data);
      setFilteredExecutives(data.executives || data);
    } catch (err) {
      console.error(err);
      toast({ title: "OTP verification failed", variant: "destructive" });
    }
  };

  // =============================
  // UI
  // =============================
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            Executive Admins
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and add Executive Admins in your network
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Executive Admin
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Executive Admin</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <div className="flex gap-2">
                <Input
                  className="w-20"
                  placeholder="+91"
                  value={formData.phone_country}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_country: e.target.value })
                  }
                />
                <Input
                  placeholder="Phone Number"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_number: e.target.value })
                  }
                />
              </div>
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <Input
                placeholder="Country"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* OTP Dialog */}
      <Dialog open={otpDialogOpen} onOpenChange={setOtpDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Verify OTP</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Enter 6-digit OTP"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              maxLength={6}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOtpDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleVerifyOtp}>Verify</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search Bar */}
      <div className="flex justify-end">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Executive Admins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Executive Admins</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading Executive Admins...
            </div>
          ) : filteredExecutives.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No Executive Admins found
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Phone
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Country
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExecutives.map((admin) => (
                    <tr
                      key={admin._id}
                      className="border-b hover:bg-muted/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">{admin.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        +{admin.phone_number?.join(" ")}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {admin.country}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            admin.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {admin.status || "N/A"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(admin.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveAdmins;
