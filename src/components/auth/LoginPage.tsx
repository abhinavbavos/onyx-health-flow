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
import { Eye, EyeOff, Shield, Phone, Lock, CheckCircle2, BarChart3, Users, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  userAuth,
  userAuthVerify,
  signinNonUser,
  verifyNonUser,
  requestPasswordResetOtp,
  resetPassword,
} from "@/services/auth.service";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unexpected error occurred.";
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [mode] = useState<"admin" | "patient">("admin");
  const [step, setStep] = useState<"phone" | "verify">("phone");
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  // Forgot password state
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<"phone" | "reset">("phone");
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotTimer, setForgotTimer] = useState(0);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    if (forgotTimer > 0) {
      const interval = setInterval(() => setForgotTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [forgotTimer]);

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

      // ✅ Normalize role: convert underscores to hyphens
      const normalizedRole = (response.role || mode).replace(/_/g, "-");

      // ✅ Store tokens and user info
      localStorage.setItem("authToken", response.accessToken || response.token);
      localStorage.setItem("refreshToken", response.refreshToken || "");
      localStorage.setItem("userRole", normalizedRole);
      localStorage.setItem("userPhone", phone);

      // ✅ Store organization info if available
      if (response.organization) {
        localStorage.setItem(
          "organizationId",
          response.organization._id || response.organization.id
        );
        localStorage.setItem(
          "organizationName",
          response.organization.organizationName || ""
        );
        localStorage.setItem(
          "organizationCode",
          response.organization.organizationCode || ""
        );
        localStorage.setItem(
          "userOrganization",
          JSON.stringify(response.organization)
        );
      }

      toast({
        title: "Success",
        description: "Login successful, redirecting to your dashboard...",
      });

      navigate(`/dashboard/${normalizedRole}`, { replace: true });
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
  // Forgot Password Flow
  // ============================
  const handleForgotRequestOtp = async () => {
    if (!forgotPhone) {
      toast({ title: "Error", description: "Please enter your phone number", variant: "destructive" });
      return;
    }
    setForgotLoading(true);
    try {
      const response = await requestPasswordResetOtp(["91", forgotPhone]);
      toast({ title: "OTP Sent", description: response?.message || "Check your phone for the reset OTP." });
      setForgotPasswordStep("reset");
      setForgotTimer(30);
    } catch (error: any) {
      toast({ title: "Failed to send OTP", description: getErrorMessage(error), variant: "destructive" });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotResetPassword = async () => {
    if (!forgotOtp || !newPassword) {
      toast({ title: "Error", description: "Please enter OTP and new password", variant: "destructive" });
      return;
    }
    if (newPassword.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters long", variant: "destructive" });
      return;
    }
    setForgotLoading(true);
    try {
      const response = await resetPassword({
        phone_number: ["91", forgotPhone],
        otp: forgotOtp,
        new_password: newPassword,
      });
      toast({ title: "Password Reset Successful", description: response?.message || "You can now login with your new password." });
      setForgotPasswordOpen(false);
      
      // reset states
      setTimeout(() => {
        setForgotPasswordStep("phone");
        setForgotPhone("");
        setForgotOtp("");
        setNewPassword("");
      }, 500);
    } catch (error: any) {
      toast({ title: "Reset Failed", description: getErrorMessage(error), variant: "destructive" });
    } finally {
      setForgotLoading(false);
    }
  };

  // ============================
  // UI Layout
  // ============================
  return (
    <div 
      className="min-h-screen lg:h-screen w-full flex flex-col justify-between p-6 md:p-8 lg:p-8 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #FFF5F6 0%, #FFE8EB 50%, #FFF7F8 100%)",
      }}
    >
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-[#F2052C]/5 blur-3xl translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#35B7C9]/5 blur-3xl pointer-events-none"></div>

      {/* Top Header Row with Logo */}
      <div className="w-full max-w-7xl mx-auto flex justify-start items-center z-10">
        <div className="flex items-center gap-3">
          <img
            src="/ONYXHPLOGO.png"
            alt="Onyx Health+"
            className="h-10 w-auto object-contain"
          />
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl w-full mx-auto my-4 lg:my-0 z-10">
        
        {/* Left Side: Marketing & Illustration */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left">
          
          {/* Badge */}
          <div className="flex justify-start">
            <span 
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider transition-all"
              style={{
                backgroundColor: "rgba(242, 5, 44, 0.08)",
                borderColor: "#F2052C",
                color: "#F2052C",
              }}
            >
              <Shield className="h-4 w-4" />
              ADMIN PORTAL
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl md:text-4xl lg:text-[44px] font-black text-[#14213D] tracking-tight leading-[1.1] mt-4 mb-2">
            Manage.<br />
            Monitor.<br />
            <span className="text-[#F2052C]">Deliver Excellence.</span>
          </h1>

          {/* Description */}
          <p className="text-[#475569] text-sm md:text-base max-w-lg mb-4 leading-relaxed">
            Manage patients, appointments, providers and healthcare operations.
          </p>

          {/* 3D Dashboard Illustration Mockup */}
          <div className="w-full max-w-[340px] p-4 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl shadow-lg shadow-[#F2052C]/5 flex justify-center items-center">
            <svg className="w-full h-auto" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="20" width="360" height="200" rx="16" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
              
              {/* Header Bar */}
              <path d="M20 52 H380" stroke="#f1f5f9" strokeWidth="2"/>
              <circle cx="42" cy="36" r="4" fill="#F2052C"/>
              <circle cx="54" cy="36" r="4" fill="#35B7C9"/>
              <circle cx="66" cy="36" r="4" fill="#cbd5e1"/>
              
              {/* Main Content Layout */}
              <rect x="40" y="70" width="160" height="130" rx="8" fill="#F8FAFC"/>
              
              {/* Charts inside main area */}
              <rect x="60" y="130" width="16" height="50" rx="3" fill="#35B7C9" />
              <rect x="84" y="100" width="16" height="80" rx="3" fill="#F2052C" />
              <rect x="108" y="115" width="16" height="65" rx="3" fill="#35B7C9" />
              <rect x="132" y="90" width="16" height="90" rx="3" fill="#F2052C" />
              <rect x="156" y="125" width="16" height="55" rx="3" fill="#cbd5e1" />
              
              {/* KPI Widgets */}
              <rect x="220" y="70" width="140" height="55" rx="8" fill="#F8FAFC"/>
              <circle cx="245" cy="98" r="16" fill="#F2052C" fillOpacity="0.08"/>
              <path d="M245 92 L249 96 L253 92" stroke="#F2052C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="272" y="90" width="65" height="6" rx="3" fill="#14213D"/>
              <rect x="272" y="102" width="45" height="4" rx="2" fill="#cbd5e1"/>
              
              <rect x="220" y="135" width="140" height="65" rx="8" fill="#F8FAFC"/>
              <circle cx="245" cy="168" r="16" fill="#35B7C9" fillOpacity="0.08"/>
              <path d="M241 168 H249 M245 164 V172" stroke="#35B7C9" strokeWidth="2" strokeLinecap="round"/>
              <rect x="272" y="160" width="70" height="6" rx="3" fill="#14213D"/>
              <rect x="272" y="172" width="50" height="4" rx="2" fill="#cbd5e1"/>
            </svg>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
          
          <div className="w-full max-w-[420px] relative">
            {/* Top Red Shield Circular Icon Container */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-16 rounded-full bg-white shadow-lg flex items-center justify-center border border-slate-50 z-20">
              <div className="h-11 w-11 rounded-full bg-[#F2052C]/10 flex items-center justify-center text-[#F2052C]">
                <Shield className="h-5 w-5" />
              </div>
            </div>

            <Card className="border-none bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] rounded-[24px] overflow-hidden p-6 pt-10 text-center">
              
              <CardHeader className="space-y-2 p-0">
                <div className="flex justify-center items-center mb-2">
                  <img
                    src="/ONYXHPLOGO.png"
                    alt="Onyx Health+"
                    className="h-8 w-auto object-contain"
                  />
                </div>
                <CardTitle className="text-2xl font-black text-[#14213D]">Admin Portal</CardTitle>
                <CardDescription className="text-slate-500 text-sm">
                  Manage patients, appointments, providers and healthcare operations.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 mt-6 p-0">
                
                {/* Step 1: Phone Input */}
                {step === "phone" && (
                  <div className="space-y-4">
                    <div className="space-y-2 text-left">
                      <Label className="text-sm font-bold text-[#14213D] ml-1">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <Input
                          type="tel"
                          placeholder="Enter Phone Number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          disabled={loading || sendingOtp}
                          className="rounded-xl border border-[#DCE5EF] bg-slate-50/50 h-[48px] pl-12 pr-5 text-sm placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#F2052C] focus-visible:border-[#F2052C] transition-all"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleSendOtp}
                      className="w-full bg-gradient-to-r from-[#F2052C] to-[#FF4B66] text-white font-bold h-[48px] rounded-xl transition-all shadow-md shadow-[#F2052C]/15 text-sm hover:opacity-95"
                      disabled={sendingOtp || !phone}
                    >
                      {sendingOtp ? "Sending OTP..." : "Get Verification Code"}
                    </Button>


                  </div>
                )}

                {/* Step 2: Verify */}
                {step === "verify" && (
                  <div className="space-y-4">
                    <div className="space-y-2 text-left">
                      <Label className="text-sm font-bold text-[#14213D] ml-1">Verification Code (OTP)</Label>
                      <Input
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        disabled={loading}
                        className="rounded-xl border border-[#DCE5EF] bg-slate-50/50 h-[48px] px-5 text-sm placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#F2052C] focus-visible:border-[#F2052C] transition-all"
                      />
                    </div>

                    {mode === "admin" && (
                      <>
                        <div className="space-y-2 text-left">
                          <Label className="text-sm font-bold text-[#14213D] ml-1">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              disabled={loading}
                              className="rounded-xl border border-[#DCE5EF] bg-slate-50/50 h-[48px] pl-12 pr-12 text-sm placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#F2052C] focus-visible:border-[#F2052C] transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                              disabled={loading}
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-1">
                          <button
                            type="button"
                            onClick={() => setForgotPasswordOpen(true)}
                            className="text-xs font-bold text-[#F2052C] hover:text-[#F2052C]/80 transition-colors mr-1"
                          >
                            Forgot password?
                          </button>
                        </div>
                      </>
                    )}

                    <Button
                      onClick={handleVerify}
                      className="w-full bg-gradient-to-r from-[#F2052C] to-[#FF4B66] text-white font-bold h-[48px] rounded-xl transition-all shadow-md shadow-[#F2052C]/15 text-sm hover:opacity-95"
                      disabled={loading}
                    >
                      {loading ? "Verifying..." : "Confirm Login"}
                    </Button>

                    <button
                      type="button"
                      className="w-full text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mt-2"
                      onClick={() => {
                        setStep("phone");
                        setOtp("");
                        setPassword("");
                        setShowPassword(false);
                      }}
                    >
                      ← Back to Phone Number
                    </button>

                    <div className="mt-4 text-center">
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={timer > 0 || sendingOtp}
                        className={cn(
                          "text-xs font-bold transition-all",
                          timer > 0 ? "text-slate-400 cursor-not-allowed" : "text-[#F2052C] hover:underline"
                        )}
                      >
                        {timer > 0 ? `Resend OTP in ${timer}s` : "Didn't receive code? Resend OTP"}
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Features Section */}
      <div className="w-full max-w-7xl mx-auto border-t border-slate-200/60 pt-4 mt-4 lg:mt-0 flex flex-col lg:flex-row items-center justify-between gap-6 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full lg:w-auto">
          {/* Feature 1 */}
          <div className="flex items-center gap-3 text-left">
            <div className="h-10 w-10 rounded-full bg-[#F2052C]/8 flex items-center justify-center text-[#F2052C] shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#14213D]">User Management</h4>
              <p className="text-xs text-slate-500">Add, manage and coordinate users</p>
            </div>
          </div>
          {/* Feature 2 */}
          <div className="flex items-center gap-3 text-left">
            <div className="h-10 w-10 rounded-full bg-[#F2052C]/8 flex items-center justify-center text-[#F2052C] shrink-0">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#14213D]">Real-time Analytics</h4>
              <p className="text-xs text-slate-500">Track performance in real time</p>
            </div>
          </div>
          {/* Feature 3 */}
          <div className="flex items-center gap-3 text-left">
            <div className="h-10 w-10 rounded-full bg-[#F2052C]/8 flex items-center justify-center text-[#F2052C] shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#14213D]">Secure & Compliant</h4>
              <p className="text-xs text-slate-500">Enterprise-grade security</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-xs text-slate-400 text-center lg:text-right">
          <span>© 2026 ONYX HEALTH+. All rights reserved.</span>
          <span className="hidden sm:inline">|</span>
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
            </svg>
            Secure & HIPAA Compliant
          </span>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-md rounded-[24px] p-6 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#F2052C] font-bold text-xl flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" /> Reset Password
            </DialogTitle>
            <DialogDescription className="text-slate-600 text-sm">
              {forgotPasswordStep === "phone"
                ? "Enter your mobile number to receive a reset OTP."
                : "Enter the OTP sent to your phone and your new password."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {forgotPasswordStep === "phone" ? (
              <div className="space-y-4">
                <div className="space-y-2 text-left">
                  <Label className="text-xs font-bold text-slate-700 ml-1">Mobile Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <Input
                      type="tel"
                      placeholder="Enter mobile number"
                      value={forgotPhone}
                      onChange={(e) => setForgotPhone(e.target.value)}
                      disabled={forgotLoading}
                      className="rounded-xl border border-slate-200 bg-slate-50 h-12 pl-12 pr-5 text-sm focus-visible:ring-2 focus-visible:ring-[#F2052C] focus-visible:border-[#F2052C]"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleForgotRequestOtp}
                  className="w-full bg-[#F2052C] hover:bg-[#F2052C]/90 text-white font-bold h-12 rounded-xl transition-all shadow-md shadow-[#F2052C]/15"
                  disabled={forgotLoading || !forgotPhone}
                >
                  {forgotLoading ? "Sending OTP..." : "Send Reset Code"}
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-2 text-left">
                  <Label className="text-xs font-bold text-slate-700 ml-1">OTP</Label>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    disabled={forgotLoading}
                    className="rounded-xl border border-slate-200 bg-slate-50 h-12 px-5 text-sm focus-visible:ring-2 focus-visible:ring-[#F2052C] focus-visible:border-[#F2052C]"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <Label className="text-xs font-bold text-slate-700 ml-1">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <Input
                      type="password"
                      placeholder="Enter new password (min 8 chars)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={forgotLoading}
                      className="rounded-xl border border-slate-200 bg-slate-50 h-12 pl-12 pr-5 text-sm focus-visible:ring-2 focus-visible:ring-[#F2052C] focus-visible:border-[#F2052C]"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleForgotResetPassword}
                  className="w-full bg-[#F2052C] hover:bg-[#F2052C]/90 text-white font-bold h-12 rounded-xl transition-all shadow-md shadow-[#F2052C]/15"
                  disabled={forgotLoading || !forgotOtp || !newPassword}
                >
                  {forgotLoading ? "Resetting..." : "Reset Password"}
                </Button>
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={handleForgotRequestOtp}
                    disabled={forgotTimer > 0 || forgotLoading}
                    className={cn(
                      "text-xs font-bold transition-all",
                      forgotTimer > 0 ? "text-slate-400 cursor-not-allowed" : "text-[#F2052C] hover:underline"
                    )}
                  >
                    {forgotTimer > 0 ? `Resend OTP in ${forgotTimer}s` : "Didn't receive code? Resend OTP"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoginPage;
