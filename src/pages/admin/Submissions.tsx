import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Eye, ExternalLink } from "lucide-react";

const statuses = ["pending", "under_review", "accepted", "rejected", "published"];
const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  under_review: "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  published: "bg-emerald-100 text-emerald-700",
};

export default function Submissions() {
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.paperSubmission.list.useQuery({
    page: 1,
    limit: 100,
    status: statusFilter ? (statusFilter as any) : undefined,
  });

  const updateStatusMutation = trpc.paperSubmission.updateStatus.useMutation({
    onSuccess: () => { toast.success("Submission updated"); utils.paperSubmission.list.invalidate(); setSelected(null); },
    onError: (err) => toast.error(err.message),
  });

  const inputClass = "w-full px-3 py-2 rounded-md border text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Paper Submissions</h1>
      </div>

      <div className="flex gap-3 mb-4">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputClass + " w-48"}>
          <option value="">All Statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : data?.items.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No submissions yet.</TableCell></TableRow>
            ) : (
              data?.items.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium max-w-xs truncate">{item.title}</TableCell>
                  <TableCell>{item.authorName}</TableCell>
                  <TableCell className="text-muted-foreground">{item.email}</TableCell>
                  <TableCell>
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${statusColors[item.status]}`}>
                      {item.status.replace(/_/g, " ")}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{new Date(item.submittedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setSelected(item); setAdminNotes(item.adminNotes || ""); }}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-[13px]">
                <div>
                  <p className="text-[11px] uppercase text-muted-foreground">Author</p>
                  <p>{selected.authorName}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-muted-foreground">Affiliation</p>
                  <p>{selected.affiliation || "-"}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-muted-foreground">Email</p>
                  <p>{selected.email}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-muted-foreground">Keywords</p>
                  <p>{selected.keywords || "-"}</p>
                </div>
              </div>
              <div>
                <p className="text-[11px] uppercase text-muted-foreground mb-1">Abstract</p>
                <p className="text-[13px]">{selected.abstract}</p>
              </div>
              {selected.coverLetter && (
                <div>
                  <p className="text-[11px] uppercase text-muted-foreground mb-1">Cover Letter</p>
                  <p className="text-[13px]">{selected.coverLetter}</p>
                </div>
              )}
              <a href={selected.manuscriptUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[13px] text-primary hover:underline">
                <ExternalLink className="w-3.5 h-3.5" /> View Manuscript
              </a>
              {selected.supportingFileUrls && JSON.parse(selected.supportingFileUrls).length > 0 && (
                <div>
                  <p className="text-[11px] uppercase text-muted-foreground mb-1">Supporting Files</p>
                  <div className="space-y-1">
                    {JSON.parse(selected.supportingFileUrls).map((url: string, i: number) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[13px] text-primary hover:underline">
                        <ExternalLink className="w-3.5 h-3.5" /> Supporting file {i + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Status</label>
                <select
                  value={selected.status}
                  onChange={(e) => setSelected({ ...selected, status: e.target.value })}
                  className={inputClass}
                >
                  {statuses.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Admin Notes</label>
                <textarea rows={3} value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} className={inputClass} />
              </div>
              <DialogFooter>
                <Button
                  onClick={() => updateStatusMutation.mutate({ id: selected.id, status: selected.status, adminNotes })}
                  disabled={updateStatusMutation.isPending}
                >
                  Save
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
