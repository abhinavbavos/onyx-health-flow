import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Technicians = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Technicians</h1>
        <p className="text-muted-foreground mt-1">
          View, add, or remove technicians working under this organization.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Technicians</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Table component placeholder */}
          <p className="text-muted-foreground">
            Technicians list will appear here...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Technicians;
