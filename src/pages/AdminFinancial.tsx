
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { FinancialTitlesTable } from "@/components/admin/financial/FinancialTitlesTable";
import { FinancialHeader } from "@/components/admin/financial/FinancialHeader";
import { FinancialFilters } from "@/components/admin/financial/FinancialFilters";

const AdminFinancial = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <FinancialHeader />
        <FinancialFilters />
        <FinancialTitlesTable />
      </div>
    </AdminLayout>
  );
};

export default AdminFinancial;
