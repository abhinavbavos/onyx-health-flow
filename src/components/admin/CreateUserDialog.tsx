import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { UserRole } from "@/types/roles";
import { getAllowedRolesToCreate } from "@/types/permissions";
import { useToast } from "@/hooks/use-toast";
import {
  createSuperAdmin,
  createExecAdmin,
  createClusterHead,
  createUserHead,
  createNurse,
  createTechnician,
} from "@/services/auth.service";

interface CreateUserDialogProps {
  currentUserRole: UserRole;
  onUserCreated?: () => void;
}

const ROLE_LABELS: Record<UserRole, string> = {
  "super-admin": "Super Admin",
  "executive-admin": "Executive Admin",
  "cluster-head": "Cluster Head",
  "user-head": "User Head",
  nurse: "Nurse",
  technician: "Technician",
  doctor: "Doctor",
  user: "Patient",
};

export const CreateUserDialog = ({
  currentUserRole,
  onUserCreated,
}: CreateUserDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [loading, setLoading] = useState(false);

  const allowedRoles = getAllowedRolesToCreate(currentUserRole);

  const handleCreateUser = async () => {
    if (!phoneNumber || !selectedRole) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const phonePayload = ["91", phoneNumber];

      // Call the appropriate create function based on role
      switch (selectedRole) {
        case "super-admin":
          await createSuperAdmin(phonePayload);
          break;
        case "executive-admin":
          await createExecAdmin(phonePayload);
          break;
        case "cluster-head":
          await createClusterHead(phonePayload);
          break;
        case "user-head":
          await createUserHead(phonePayload);
          break;
        case "nurse":
          await createNurse(phonePayload);
          break;
        case "technician":
          await createTechnician(phonePayload);
          break;
        default:
          throw new Error("Invalid role selected");
      }

      toast({
        title: "User Created",
        description: `OTP sent to the user's phone. They can now login.`,
      });

      setOpen(false);
      setPhoneNumber("");
      setSelectedRole("");
      onUserCreated?.();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create user";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (allowedRoles.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary text-white">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Create a new user account. An OTP will be sent to their phone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="text"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as UserRole)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {allowedRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateUser}
            disabled={loading || !phoneNumber || !selectedRole}
          >
            {loading ? "Creating..." : "Create User"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
