import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { listLinkedAccounts, createLinkedAccount, onboardStart, updateLinkedAccountBank, LinkedAccount } from "@/services/linkedAccounts.service";
import { PlusCircle, Link, RefreshCcw, Building } from "lucide-react";

const CH_LinkedAccounts = () => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pan: "",
    street: "",
    street2: "",
    city: "",
    state: "",
    postalCode: "",
    accountNumber: "",
    ifsc: "",
    beneficiaryName: "",
    existingRazorpayAccountId: ""
  });

  const [bankUpdateAccount, setBankUpdateAccount] = useState<LinkedAccount | null>(null);
  const [bankUpdateData, setBankUpdateData] = useState({
    accountNumber: "",
    ifsc: "",
    beneficiaryName: ""
  });

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await listLinkedAccounts();
      setAccounts(data?.linkedAccounts || data?.data || []);
    } catch (error: any) {
      toast({
        title: "Failed to fetch linked accounts",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        pan: formData.pan,
        address: {
          street: formData.street,
          street2: formData.street2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode
        },
        bankAccount: {
          accountNumber: formData.accountNumber,
          ifsc: formData.ifsc,
          beneficiaryName: formData.beneficiaryName
        }
      };
      
      if (formData.existingRazorpayAccountId) {
        payload.existingRazorpayAccountId = formData.existingRazorpayAccountId;
      }
      
      await createLinkedAccount(payload);
      toast({ title: "Account created successfully" });
      setShowForm(false);
      fetchAccounts();
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOnboard = async () => {
    try {
      setLoading(true);
      const clusterId = localStorage.getItem("userId");
      if (!clusterId) throw new Error("Cluster ID missing");
      const data = await onboardStart(clusterId);
      if (data?.url) {
        window.location.href = data.url; // Redirect to Razorpay
      }
    } catch (error: any) {
      toast({
        title: "Onboarding Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankUpdateAccount) return;
    try {
      setLoading(true);
      await updateLinkedAccountBank(bankUpdateAccount._id, {
        bankAccount: bankUpdateData
      });
      toast({ title: "Bank details updated successfully" });
      setBankUpdateAccount(null);
      fetchAccounts();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Linked Accounts</h1>
          <p className="text-muted-foreground mt-1">Manage Razorpay linked accounts for your cluster</p>
        </div>
        <div className="space-x-3">
          <Button variant="outline" onClick={handleOnboard} disabled={loading}>
            <Link className="h-4 w-4 mr-2" />
            Connect Razorpay
          </Button>
          <Button onClick={() => setShowForm(!showForm)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            {showForm ? "Cancel" : "New Account"}
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Linked Account</CardTitle>
            <CardDescription>Enter details to create a new linked account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label>PAN Number</Label>
                  <Input name="pan" value={formData.pan} onChange={handleChange} required />
                </div>
              </div>
              <h3 className="font-semibold mt-6 mb-2">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Street</Label>
                  <Input name="street" value={formData.street} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label>Street 2 (Optional)</Label>
                  <Input name="street2" value={formData.street2} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input name="city" value={formData.city} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input name="state" value={formData.state} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label>Postal Code</Label>
                  <Input name="postalCode" value={formData.postalCode} onChange={handleChange} required />
                </div>
              </div>
              <h3 className="font-semibold mt-6 mb-2">Bank Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input name="accountNumber" value={formData.accountNumber} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label>IFSC</Label>
                  <Input name="ifsc" value={formData.ifsc} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label>Beneficiary Name</Label>
                  <Input name="beneficiaryName" value={formData.beneficiaryName} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label>Existing Razorpay Account ID (Optional)</Label>
                  <Input name="existingRazorpayAccountId" value={formData.existingRazorpayAccountId} onChange={handleChange} placeholder="acc_..." />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? <RefreshCcw className="h-4 w-4 animate-spin mr-2" /> : null}
                  Create Account
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Existing Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && !showForm ? (
            <p className="text-muted-foreground text-center py-6">Loading accounts...</p>
          ) : accounts.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">No linked accounts found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((acc) => (
                    <tr key={acc._id} className="border-b">
                      <td className="px-4 py-3">{acc.name}</td>
                      <td className="px-4 py-3">{acc.email}</td>
                      <td className="px-4 py-3">{acc.phone}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${acc.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {acc.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setBankUpdateAccount(acc);
                            setBankUpdateData({
                              accountNumber: "",
                              ifsc: "",
                              beneficiaryName: ""
                            });
                          }}
                        >
                          <Building className="h-4 w-4 mr-2" />
                          Update Bank
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!bankUpdateAccount} onOpenChange={(open) => !open && setBankUpdateAccount(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Bank Details</DialogTitle>
            <DialogDescription>Update the bank details for {bankUpdateAccount?.name}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateBank} className="space-y-4">
            <div className="space-y-2">
              <Label>Account Number</Label>
              <Input value={bankUpdateData.accountNumber} onChange={(e) => setBankUpdateData({...bankUpdateData, accountNumber: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>IFSC</Label>
              <Input value={bankUpdateData.ifsc} onChange={(e) => setBankUpdateData({...bankUpdateData, ifsc: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Beneficiary Name</Label>
              <Input value={bankUpdateData.beneficiaryName} onChange={(e) => setBankUpdateData({...bankUpdateData, beneficiaryName: e.target.value})} required />
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? <RefreshCcw className="h-4 w-4 animate-spin mr-2" /> : null}
                Update Bank
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CH_LinkedAccounts;
