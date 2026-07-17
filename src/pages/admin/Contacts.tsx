import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Trash2 } from "lucide-react";

const statuses = ["new", "read", "replied", "archived"];
const statusColors: Record<string, string> = {
  new: "bg-amber-100 text-amber-700",
  read: "bg-blue-100 text-blue-700",
  replied: "bg-green-100 text-green-700",
  archived: "bg-muted text-muted-foreground",
};

export default function Contacts() {
  const [statusFilter, setStatusFilter] = useState("");

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.contact.list.useQuery({
    page: 1,
    limit: 100,
    status: statusFilter ? (statusFilter as any) : undefined,
  });

  const updateStatusMutation = trpc.contact.updateStatus.useMutation({
    onSuccess: () => utils.contact.list.invalidate(),
    onError: (err) => toast.error(err.message),
  });
  const deleteMutation = trpc.contact.delete.useMutation({
    onSuccess: () => { toast.success("Deleted"); utils.contact.list.invalidate(); },
    onError: (err) => toast.error(err.message),
  });

  const inputClass = "w-full px-3 py-2 rounded-md border text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Contact Submissions</h1>
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
              <TableHead>Name</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : data?.items.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No submissions yet.</TableCell></TableRow>
            ) : (
              data?.items.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.firstName} {item.lastName}<br /><span className="text-[11px] text-muted-foreground font-normal">{item.email}</span></TableCell>
                  <TableCell className="max-w-xs truncate">{item.subject}</TableCell>
                  <TableCell className="capitalize">{item.type.replace(/_/g, " ")}</TableCell>
                  <TableCell>
                    <select
                      value={item.status}
                      onChange={(e) => updateStatusMutation.mutate({ id: item.id, status: e.target.value as any })}
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border-0 ${statusColors[item.status]}`}
                    >
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete this submission?")) deleteMutation.mutate({ id: item.id }); }}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
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
