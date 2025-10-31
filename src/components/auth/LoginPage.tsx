import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Lock, Mail } from "lucide-react";
import { UserRole } from "@/types/roles";
import { useToast } from "@/hooks/use-toast";
import { 
  userAuthVerify, 
  verifySuperAdmin, 
  verifyExecAdmin,
  verifyClusterHead,
  verifyUserHead,
  verifyNurse,
  verifyTechnician,
  verifyNonUser
} from "@/services/auth.service";

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !otp) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let response;
      
      // Call appropriate verify endpoint based on role
      switch (role) {
        case "super-admin":
          response = await verifySuperAdmin(email, otp);
          break;
        case "executive-admin":
          response = await verifyExecAdmin(email, otp);
          break;
        case "cluster-head":
          response = await verifyClusterHead(email, otp);
          break;
        case "user-head":
          response = await verifyUserHead(email, otp);
          break;
        case "nurse":
          response = await verifyNurse(email, otp);
          break;
        case "technician":
          response = await verifyTechnician(email, otp);
          break;
        case "doctor":
          response = await verifyNonUser(email, otp);
          break;
        case "user":
        default:
          response = await userAuthVerify(email, otp);
          break;
      }

      // Store user info
      localStorage.setItem("userRole", response.role || role);
      localStorage.setItem("userEmail", email);
      
      toast({
        title: "Login Successful",
        description: `Welcome to Onyx Health+`,
      });

      navigate(`/dashboard/${response.role || role}`);
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
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
          <CardDescription>Sign in to your healthcare dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@onyxhealth.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>
            
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

            <div className="space-y-2">
              <Label htmlFor="role">Select Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super-admin">Super Admin</SelectItem>
                  <SelectItem value="executive-admin">Executive Admin</SelectItem>
                  <SelectItem value="cluster-head">Cluster Head</SelectItem>
                  <SelectItem value="user-head">User Head</SelectItem>
                  <SelectItem value="nurse">Nurse</SelectItem>
                  <SelectItem value="technician">Technician</SelectItem>
                  <SelectItem value="user">Patient</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full gradient-primary" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                Need an OTP? Contact your administrator
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
