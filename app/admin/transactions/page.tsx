import AdminTransactionsTable from "@/components/admin/transactions/table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "عمليات الدفع - Admin",
  description: "عمليات الدفع - Admin في موقع صنعة",
};

type Props = {};

async function AdminTranscations({}: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">عمليات الدفع</h1>
      </div>
      <AdminTransactionsTable />
    </div>
  );
}

export default AdminTranscations;
