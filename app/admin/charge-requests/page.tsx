import ChargeRequestsTable from "@/components/admin/charge-requests/table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "عمليات الشحن - Admin",
  description: "عمليات الشحن - Admin في موقع صنعة",
};

type Props = {};

async function AdminChargeRequests({}: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">عمليات الشحن</h1>
        <div>{/* filter  */}</div>
      </div>
      <ChargeRequestsTable />
    </div>
  );
}

export default AdminChargeRequests;
