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
import { Activity, Lock, Phone, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  userAuth,
  userAuthVerify,
  signinNonUser,
  verifyNonUser,
} from "@/services/auth.service";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unexpected error occurred.";
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [mode, setMode] = useState<"admin" | "patient">("admin");
  const [step, setStep] = useState<"phone" | "verify">("phone");
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [timer, setTimer] = useState(0);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // ============================
  // Step 1: Send OTP
  // ============================
  const handleSendOtp = async () => {
    if (!phone) {
      toast({
        title: "Missing number",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    setSendingOtp(true);
    try {
      const phonePayload = ["91", phone];
      console.log("📱 Sending OTP request:", { mode, phonePayload });

      let response;
      if (mode === "patient") {
        response = await userAuth(phonePayload);
      } else {
        response = await signinNonUser(phonePayload);
      }

      console.log("✅ OTP Sent response:", response);

      toast({
        title: "OTP Sent",
        description: response?.message || "Check your phone for the OTP.",
      });

      setStep("verify");
      setTimer(30);
    } catch (error: any) {
      console.error("❌ OTP Send Error:", error);
      toast({
        title: "Failed to send OTP",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setSendingOtp(false);
    }
  };

  // ============================
  // Step 2: Verify OTP + Password
  // ============================
  const handleVerify = async () => {
    if (!otp) {
      toast({
        title: "Missing OTP",
        description: "Please enter the OTP",
        variant: "destructive",
      });
      return;
    }
    if (mode === "admin" && !password) {
      toast({
        title: "Missing password",
        description: "Please enter your password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log("🔍 Verifying credentials:", { mode, otp, password });

      let response;
      if (mode === "patient") {
        response = await userAuthVerify({
          phone_number: ["91", phone],
          country: "India",
          otp,
        });
      } else {
        response = await verifyNonUser({
          otp,
          password,
        });
      }

      console.log("✅ Verify response:", response);

      if (!response || (!response.accessToken && !response.token)) {
        throw new Error("Invalid credentials or empty response from server.");
      }

      // ✅ Store tokens
      localStorage.setItem("authToken", response.accessToken || response.token);
      localStorage.setItem("refreshToken", response.refreshToken || "");
      localStorage.setItem("userRole", response.role.replace(/_/g, "-"));
      localStorage.setItem("userPhone", phone);

      toast({
        title: "Login successful",
        description: "Redirecting to dashboard...",
      });

      navigate(`/dashboard/${response.role || "user"}`);
    } catch (error: any) {
      console.error("❌ Verification Error:", error);
      toast({
        title: "Verification failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // UI Layout
  // ============================
  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero">
      <Card className="w-full max-w-md mx-4 shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center">
              <Activity className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Onyx Health+</CardTitle>
          <CardDescription>Login to your dashboard</CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Role Selector */}
          <div className="flex justify-center gap-2">
            <Button
              variant={mode === "admin" ? "default" : "outline"}
              onClick={() => setMode("admin")}
              disabled={loading}
            >
              Admin
            </Button>
            <Button
              variant={mode === "patient" ? "default" : "outline"}
              onClick={() => setMode("patient")}
              disabled={loading}
            >
              Patient
            </Button>
          </div>

          {/* Step 1: Phone Input */}
          {step === "phone" && (
            <div className="space-y-3">
              <Label>Mobile Number</Label>
              <Input
                type="tel"
                placeholder="Enter mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading || sendingOtp}
              />
              <Button
                onClick={handleSendOtp}
                className="w-full gradient-primary"
                disabled={sendingOtp || !phone}
              >
                {sendingOtp ? "Sending OTP..." : "Send OTP"}
              </Button>
            </div>
          )}

          {/* Step 2: Verify */}
          {step === "verify" && (
            <div className="space-y-3">
              <Label>OTP</Label>
              <Input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
              />

              {mode === "admin" && (
                <>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </>
              )}

              <Button
                onClick={handleVerify}
                className="w-full gradient-primary"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Login"}
              </Button>

              <Button
                variant="ghost"
                className="w-full text-sm mt-2"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setPassword("");
                }}
              >
                ← Resend OTP
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
