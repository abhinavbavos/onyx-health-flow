import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { Building2, Users, CreditCard, TrendingUp } from "lucide-react";

const ClusterHeadDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Cluster Head Dashboard</h1>
          <p className="text-muted-foreground mt-1">Regional healthcare oversight</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Organizations"
            value="12"
            icon={Building2}
            variant="primary"
          />
          <StatCard
            title="Team Members"
            value="45"
            icon={Users}
            variant="secondary"
          />
          <StatCard
            title="Total Revenue"
            value="$84,250"
            icon={CreditCard}
            variant="success"
            trend={{ value: "15% from last month", isPositive: true }}
          />
          <StatCard
            title="Growth Rate"
            value="23%"
            icon={TrendingUp}
            variant="default"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg shadow-card p-6">
            <h3 className="text-xl font-semibold mb-4">Payment Summary</h3>
            <div className="space-y-4">
              {[
                { month: "January", amount: "$28,450", status: "Paid" },
                { month: "February", amount: "$31,200", status: "Paid" },
                { month: "March", amount: "$24,600", status: "Pending" },
              ].map((payment, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{payment.month}</p>
                    <p className="text-2xl font-bold text-primary">{payment.amount}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    payment.status === "Paid" 
                      ? "bg-success/10 text-success" 
                      : "bg-warning/10 text-warning"
                  }`}>
                    {payment.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-card p-6">
            <h3 className="text-xl font-semibold mb-4">Regional Performance</h3>
            <div className="space-y-4">
              {[
                { region: "North Zone", patients: 450, percentage: 85 },
                { region: "South Zone", patients: 380, percentage: 72 },
                { region: "East Zone", patients: 320, percentage: 65 },
                { region: "West Zone", patients: 290, percentage: 58 },
              ].map((region, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{region.region}</span>
                    <span className="text-sm text-muted-foreground">{region.patients} patients</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full gradient-primary" 
                      style={{ width: `${region.percentage}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClusterHeadDashboard;
