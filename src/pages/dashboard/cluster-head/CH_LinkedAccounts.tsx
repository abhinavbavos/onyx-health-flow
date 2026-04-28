import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { listLinkedAccounts, createLinkedAccount, onboardStart, updateLinkedAccountBank, viewLinkedAccount, LinkedAccount } from "@/services/linkedAccounts.service";
import { PlusCircle, Link, RefreshCcw, Building, Eye } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const CH_LinkedAccounts = () => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [loading, setLoading] = useState(false);
  
  // View Dialog State
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedAccountDetails, setSelectedAccountDetails] = useState<any>(null);
  
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#2d3748]">
            Linked Accounts
          </h1>
          <p className="text-lg text-gray-500 font-medium">
            Manage your Razorpay settlements and financial links
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleOnboard} 
            disabled={loading}
            className="rounded-2xl border-2 border-primary/20 hover:border-primary/50 bg-white/50 backdrop-blur-sm h-12 px-6 font-bold transition-all shadow-sm hover:shadow-md"
          >
            <Link className="h-5 w-5 mr-2 text-primary" />
            Connect Razorpay
          </Button>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className={cn(
              "rounded-2xl h-12 px-6 font-bold shadow-lg transition-all active:scale-95",
              showForm ? "bg-rose-500 hover:bg-rose-600 text-white" : "gradient-primary text-white"
            )}
          >
            {showForm ? (
              <>Cancel</>
            ) : (
              <>
                <PlusCircle className="h-5 w-5 mr-2" />
                New Account
              </>
            )}
          </Button>
        </div>
      </div>

      {/* CREATE FORM */}
      {showForm && (
        <Card className="glass-panel border-none shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
          <CardHeader className="bg-white/40 border-b border-white/50 pb-6">
            <CardTitle className="text-2xl font-bold text-[#2d3748]">Business Profile</CardTitle>
            <CardDescription className="text-gray-600 font-medium">Provide details for your new linked settlement account</CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleCreate} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 ml-1">Full Name</Label>
                  <Input name="name" value={formData.name} onChange={handleChange} required className="rounded-xl border-gray-200 focus:border-primary/50 focus:ring-primary/20 h-11" placeholder="Legal business name" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 ml-1">Email Address</Label>
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} required className="rounded-xl border-gray-200 focus:border-primary/50 focus:ring-primary/20 h-11" placeholder="business@example.com" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 ml-1">Contact Phone</Label>
                  <Input name="phone" value={formData.phone} onChange={handleChange} required className="rounded-xl border-gray-200 focus:border-primary/50 focus:ring-primary/20 h-11" placeholder="10-digit number" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 ml-1">PAN Number</Label>
                  <Input name="pan" value={formData.pan} onChange={handleChange} required className="rounded-xl border-gray-200 focus:border-primary/50 focus:ring-primary/20 h-11 uppercase" placeholder="ABCDE1234F" />
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-start">
                  <span className="bg-transparent pr-3 text-sm font-extrabold text-gray-400 uppercase tracking-widest">Registered Address</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-sm font-bold text-gray-700 ml-1">Street Address</Label>
                  <Input name="street" value={formData.street} onChange={handleChange} required className="rounded-xl border-gray-200 h-11" placeholder="Line 1" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 ml-1">Street 2</Label>
                  <Input name="street2" value={formData.street2} onChange={handleChange} className="rounded-xl border-gray-200 h-11" placeholder="Optional" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 ml-1">City</Label>
                  <Input name="city" value={formData.city} onChange={handleChange} required className="rounded-xl border-gray-200 h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 ml-1">State / Province</Label>
                  <Input name="state" value={formData.state} onChange={handleChange} required className="rounded-xl border-gray-200 h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 ml-1">Postal Code</Label>
                  <Input name="postalCode" value={formData.postalCode} onChange={handleChange} required className="rounded-xl border-gray-200 h-11" />
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-start">
                  <span className="bg-transparent pr-3 text-sm font-extrabold text-gray-400 uppercase tracking-widest">Settlement Bank</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 ml-1">Account Number</Label>
                  <Input name="accountNumber" value={formData.accountNumber} onChange={handleChange} required className="rounded-xl border-gray-200 h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 ml-1">IFSC Code</Label>
                  <Input name="ifsc" value={formData.ifsc} onChange={handleChange} required className="rounded-xl border-gray-200 h-11" placeholder="e.g. SBIN0001234" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 ml-1">Beneficiary Name</Label>
                  <Input name="beneficiaryName" value={formData.beneficiaryName} onChange={handleChange} required className="rounded-xl border-gray-200 h-11" />
                </div>
                <div className="md:col-span-3 space-y-2">
                  <Label className="text-sm font-bold text-gray-700 ml-1">Existing Razorpay Account ID (Optional)</Label>
                  <Input name="existingRazorpayAccountId" value={formData.existingRazorpayAccountId} onChange={handleChange} className="rounded-xl border-gray-200 h-11" placeholder="acc_..." />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading} className="gradient-primary text-white rounded-2xl h-12 px-10 font-bold shadow-lg transition-all active:scale-95">
                  {loading && <RefreshCcw className="h-5 w-5 animate-spin mr-3" />}
                  Register Linked Account
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* LISTING */}
      <Card className="glass-panel border-none shadow-xl overflow-hidden">
        <CardHeader className="bg-white/30 border-b border-white/50 pb-6">
          <CardTitle className="text-2xl font-bold text-[#2d3748]">Connected Accounts</CardTitle>
          <CardDescription className="text-gray-600 font-medium font-medium">Currently active settlement destinations</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading && !showForm ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <RefreshCcw className="h-10 w-10 animate-spin text-primary opacity-50" />
              <p className="text-gray-500 font-bold animate-pulse">Syncing accounts...</p>
            </div>
          ) : accounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                <Building className="h-10 w-10 text-gray-300" />
              </div>
              <p className="text-gray-400 font-bold text-lg">No settlement accounts linked yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#f8fafc] text-gray-500 uppercase text-[11px] font-extrabold tracking-widest border-b">
                  <tr>
                    <th className="px-6 py-4">Account Holder</th>
                    <th className="px-6 py-4">Contact Info</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Settlement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {accounts.map((acc: any) => {
                    const clusterName = acc.clusterId?.name;
                    const clusterPhone = Array.isArray(acc.clusterId?.phone_number) 
                      ? `+${acc.clusterId.phone_number.join(" ")}` 
                      : acc.clusterId?.phone_number;

                    const displayName = acc.name || clusterName || acc.legalName || "Unnamed Account";
                    const displayEmail = acc.email || acc.contactEmail || "No Email";
                    const displayPhone = acc.phone || clusterPhone || acc.contact || "No Phone";

                    return (
                      <tr key={acc._id} className="hover:bg-white/40 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center text-primary font-bold shadow-inner uppercase">
                              {displayName.charAt(0)}
                            </div>
                            <span className="font-bold text-[#2d3748] text-base">{displayName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-700">{displayEmail}</span>
                            <span className="text-xs text-gray-500 font-medium mt-0.5">{displayPhone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={cn(
                            "px-4 py-1 rounded-full text-xs font-extrabold shadow-sm inline-flex items-center gap-1.5 capitalize",
                            acc.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                          )}>
                            <div className={cn("h-1.5 w-1.5 rounded-full", acc.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-amber-500")} />
                            {acc.status || "Pending Verification"}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={async () => {
                                try {
                                  const data = await viewLinkedAccount(acc._id);
                                  const details = data.linkedAccount || data;
                                  setSelectedAccountDetails(details);
                                  setViewDialogOpen(true);
                                } catch (err) {
                                  toast({ title: "Error fetching details", variant: "destructive" });
                                }
                              }}
                              className="rounded-xl font-bold text-primary hover:bg-primary/10 transition-all"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                setBankUpdateAccount(acc);
                                setBankUpdateData({
                                  accountNumber: acc.bankAccount?.accountNumber || "",
                                  ifsc: acc.bankAccount?.ifsc || "",
                                  beneficiaryName: acc.bankAccount?.beneficiaryName || ""
                                });
                              }}
                              className="rounded-xl font-bold text-primary hover:bg-primary/10 transition-all"
                            >
                              <Building className="h-4 w-4 mr-2" />
                              Modify Bank
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[550px] glass-panel border-none shadow-2xl p-0 overflow-hidden">
          {selectedAccountDetails && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-gradient-to-br from-primary/10 to-transparent p-6 border-b border-white/20">
                <DialogHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-white/50 backdrop-blur-md flex items-center justify-center text-primary text-2xl font-black shadow-lg border border-white/50">
                      {(selectedAccountDetails.name || 
                        selectedAccountDetails.legalName || 
                        selectedAccountDetails.clusterId?.name || 
                        selectedAccountDetails.bankAccount?.beneficiaryName || 
                        "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-black text-[#1a202c]">
                        {selectedAccountDetails.name || 
                         selectedAccountDetails.legalName || 
                         selectedAccountDetails.clusterId?.name || 
                         selectedAccountDetails.bankAccount?.beneficiaryName || 
                         "Unnamed Account"}
                      </DialogTitle>
                      <DialogDescription className="text-primary font-bold text-xs uppercase tracking-widest mt-0.5">
                        Linked Account Details
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Status</p>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block",
                      selectedAccountDetails.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    )}>
                      {selectedAccountDetails.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Activation</p>
                    <p className="font-bold text-sm text-[#2d3748] capitalize">{selectedAccountDetails.activationStatus?.replace(/_/g, " ") || "N/A"}</p>
                  </div>
                </div>

                <Separator className="bg-gray-100" />

                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Razorpay Account ID</span>
                      <span className="font-mono font-bold text-primary">{selectedAccountDetails.razorpayAccountId}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Stakeholder ID</span>
                      <span className="font-mono font-bold text-gray-700">{selectedAccountDetails.stakeholderId}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black text-[#1a202c] uppercase tracking-widest flex items-center gap-2">
                    <Building className="h-3.5 w-3.5" /> Settlement Bank
                  </h4>
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
                    <div className="relative z-10">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Beneficiary</p>
                      <p className="text-lg font-black tracking-tight">{selectedAccountDetails.bankAccount?.beneficiaryName || "N/A"}</p>
                      <div className="mt-4 flex justify-between items-end">
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Account Number</p>
                          <p className="font-mono text-sm tracking-widest">{selectedAccountDetails.bankAccount?.accountNumber?.replace(/\d(?=\d{4})/g, "•") || "••••••••••••"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">IFSC</p>
                          <p className="font-mono text-sm font-bold">{selectedAccountDetails.bankAccount?.ifsc || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                <Button onClick={() => setViewDialogOpen(false)} className="rounded-xl font-bold">
                  Close Details
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* UPDATE BANK DIALOG */}
      <Dialog open={!!bankUpdateAccount} onOpenChange={(open) => !open && setBankUpdateAccount(null)}>
        <DialogContent className="glass-panel border-none shadow-2xl sm:max-w-md rounded-[30px] p-0 overflow-hidden">
          <DialogHeader className="p-8 bg-white/40 border-b border-white/50">
            <DialogTitle className="text-2xl font-bold text-[#2d3748]">Update Bank Assets</DialogTitle>
            <DialogDescription className="text-gray-600 font-medium">
              Modifying destination for <span className="text-primary font-bold">{bankUpdateAccount?.name}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="p-8">
            <form onSubmit={handleUpdateBank} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">New Account Number</Label>
                <Input value={bankUpdateData.accountNumber} onChange={(e) => setBankUpdateData({...bankUpdateData, accountNumber: e.target.value})} required className="rounded-xl border-gray-200 h-11" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">New IFSC Code</Label>
                <Input value={bankUpdateData.ifsc} onChange={(e) => setBankUpdateData({...bankUpdateData, ifsc: e.target.value})} required className="rounded-xl border-gray-200 h-11" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">Beneficiary Name</Label>
                <Input value={bankUpdateData.beneficiaryName} onChange={(e) => setBankUpdateData({...bankUpdateData, beneficiaryName: e.target.value})} required className="rounded-xl border-gray-200 h-11" />
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading} className="gradient-primary text-white rounded-2xl h-12 px-8 font-bold shadow-lg transition-all active:scale-95 w-full">
                  {loading && <RefreshCcw className="h-5 w-5 animate-spin mr-3" />}
                  Confirm Asset Update
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CH_LinkedAccounts;
