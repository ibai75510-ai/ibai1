import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Check, X, Building2 } from "lucide-react";

const statuses = ["pending", "approved", "rejected", "active"];
const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
  active: "bg-green-100 text-green-700",
};

export default function RecognitionRequests() {
  const [statusFilter, setStatusFilter] = useState("");

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.partnership.list.useQuery({
    page: 1,
    limit: 100,
    status: statusFilter ? (statusFilter as any) : undefined,
  });

  const updateStatusMutation = trpc.partnership.updateStatus.useMutation({
    onSuccess: () => { toast.success("Status updated"); utils.partnership.list.invalidate(); },
    onError: (err) => toast.error(err.message),
  });

  const promoteMutation = trpc.partnership.promoteToNetwork.useMutation({
    onSuccess: () => {
      toast.success("Added to Network directory");
      utils.partnership.list.invalidate();
      utils.organization.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const inputClass = "w-full px-3 py-2 rounded-md border text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Recognition Requests</h1>
      </div>

      <div className="flex gap-3 mb-4">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputClass + " w-48"}>
          <option value="">All Statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : data?.items.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No requests yet.</TableCell></TableRow>
            ) : (
              data?.items.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.organizationName}</TableCell>
                  <TableCell className="capitalize">{item.partnershipType}</TableCell>
                  <TableCell className="text-muted-foreground">{item.email}</TableCell>
                  <TableCell>
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${statusColors[item.status]}`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.status === "pending" && (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => updateStatusMutation.mutate({ id: item.id, status: "approved" })}>
                          <Check className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => updateStatusMutation.mutate({ id: item.id, status: "rejected" })}>
                          <X className="w-4 h-4 text-destructive" />
                        </Button>
                      </>
                    )}
                    {(item.status === "approved" || item.status === "pending") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => promoteMutation.mutate({ id: item.id })}
                        disabled={promoteMutation.isPending}
                      >
                        <Building2 className="w-4 h-4 mr-1" /> Add to Network
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
