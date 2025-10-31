import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Activity, Lock, Phone, Send } from "lucide-react";
import { UserRole } from "@/types/roles";
import { useToast } from "@/hooks/use-toast";
import {
  userAuth,
  userAuthVerify,
  verifySuperAdmin,
  verifyExecAdmin,
  verifyClusterHead,
  verifyUserHead,
  verifyNurse,
  verifyTechnician,
  verifyNonUser,
} from "@/services/auth.service";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Something went wrong. Please try again.";
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [country] = useState("India");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSendOtp = async () => {
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    setSendingOtp(true);
    try {
      const phonePayload = ["91", phoneNumber];
      const response = await userAuth(phonePayload);

      toast({
        title: "OTP Sent",
        description: response.message || "Check your phone for the OTP.",
      });

      setOtpSent(true);
      setTimer(30);
    } catch (error: unknown) {
      toast({
        title: "Failed to Send OTP",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setSendingOtp(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      toast({
        title: "Error",
        description: "Please enter the OTP",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const phonePayload = ["91", phoneNumber];
      let response;

      switch (role) {
        case "super-admin":
          response = await verifySuperAdmin(phonePayload, country, otp);
          break;
        case "executive-admin":
          response = await verifyExecAdmin(phonePayload, country, otp);
          break;
        case "cluster-head":
          response = await verifyClusterHead(phonePayload, country, otp);
          break;
        case "user-head":
          response = await verifyUserHead(phonePayload, country, otp);
          break;
        case "nurse":
          response = await verifyNurse(phonePayload, country, otp);
          break;
        case "technician":
          response = await verifyTechnician(phonePayload, country, otp);
          break;
        case "doctor":
          response = await verifyNonUser(phonePayload, country, otp);
          break;
        default:
          response = await userAuthVerify(phonePayload, country, otp);
          break;
      }

      if (response.token || response.accessToken) {
        localStorage.setItem(
          "authToken",
          response.token || response.accessToken
        );
      }
      localStorage.setItem("userRole", response.role || role);
      localStorage.setItem("userPhone", phoneNumber);

      toast({
        title: "Login Successful",
        description: "Welcome to Onyx Health+",
      });

      navigate(`/dashboard/${response.role || role}`);
    } catch (error: unknown) {
      toast({
        title: "Login Failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero">
      <Card className="w-full max-w-md mx-4 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center">
              <Activity className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Onyx Health+</CardTitle>
          <CardDescription>
            Sign in to your healthcare dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* PHONE NUMBER */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="text"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-10"
                  disabled={loading || sendingOtp}
                />
              </div>

              <Button
                type="button"
                variant="secondary"
                onClick={handleSendOtp}
                disabled={sendingOtp || !phoneNumber || timer > 0}
                className="w-full flex items-center justify-center gap-2 mt-2"
              >
                {sendingOtp ? (
                  "Sending OTP..."
                ) : timer > 0 ? (
                  `Resend OTP in ${timer}s`
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send OTP
                  </>
                )}
              </Button>
            </div>

            {/* OTP FIELD */}
            {otpSent && (
              <div className="space-y-2">
                <Label htmlFor="otp">OTP</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* ROLE SELECTION */}
            <div className="space-y-2">
              <Label htmlFor="role">Select Role</Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as UserRole)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super-admin">Super Admin</SelectItem>
                  <SelectItem value="executive-admin">
                    Executive Admin
                  </SelectItem>
                  <SelectItem value="cluster-head">Cluster Head</SelectItem>
                  <SelectItem value="user-head">User Head</SelectItem>
                  <SelectItem value="nurse">Nurse</SelectItem>
                  <SelectItem value="technician">Technician</SelectItem>
                  <SelectItem value="user">Patient</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary"
              disabled={loading || !otpSent}
            >
              {loading ? "Verifying..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
