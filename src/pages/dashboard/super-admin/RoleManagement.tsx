import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, UserPlus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

const RoleManagement = () => {
  const [roles] = useState([
    { id: 1, name: "Executive Admin", users: 5, permissions: "Full organization access" },
    { id: 2, name: "Cluster Head", users: 12, permissions: "Regional management" },
    { id: 3, name: "User Head", users: 8, permissions: "Nurse & device management" },
    { id: 4, name: "Nurse", users: 45, permissions: "Device & report management" },
    { id: 5, name: "Doctor", users: 23, permissions: "Consultation & prescriptions" },
  ]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Role Management</h1>
            <p className="text-muted-foreground mt-1">Manage system roles and permissions</p>
          </div>
          <Button className="gradient-primary text-white">
            <UserPlus className="h-4 w-4 mr-2" />
            Create Role
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Active Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Role Name</th>
                      <th className="text-left py-3 px-4 font-semibold">Users</th>
                      <th className="text-left py-3 px-4 font-semibold">Permissions</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((role) => (
                      <tr key={role.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 font-medium">{role.name}</td>
                        <td className="py-3 px-4">{role.users}</td>
                        <td className="py-3 px-4 text-muted-foreground">{role.permissions}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create New Role</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="roleName">Role Name</Label>
                <Input id="roleName" placeholder="Enter role name" />
              </div>
              <div>
                <Label htmlFor="roleType">Role Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="medical">Medical Staff</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full gradient-primary text-white">
                <Shield className="h-4 w-4 mr-2" />
                Create Role
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RoleManagement;
