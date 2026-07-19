import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Plus, Pencil, Trash2 } from "lucide-react";

const types = ["institute", "university", "organization", "lab", "research_group", "journal", "partner"];
const recognitionStatuses = ["recognized", "partner", "affiliated"];

const emptyForm = {
  id: undefined as number | undefined,
  recognitionCode: "",
  name: "",
  logoUrl: "",
  description: "",
  website: "",
  type: "organization",
  collaborationDetails: "",
  recognitionStatus: "affiliated",
  isFeatured: false,
};

export default function Organizations() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.organization.list.useQuery({ page: 1, limit: 100 });

  const createMutation = trpc.organization.create.useMutation({
    onSuccess: () => { toast.success("Organization created"); utils.organization.list.invalidate(); setDialogOpen(false); },
    onError: (err) => toast.error(err.message),
  });
  const updateMutation = trpc.organization.update.useMutation({
    onSuccess: () => { toast.success("Organization updated"); utils.organization.list.invalidate(); setDialogOpen(false); },
    onError: (err) => toast.error(err.message),
  });
  const deleteMutation = trpc.organization.delete.useMutation({
    onSuccess: () => { toast.success("Organization deleted"); utils.organization.list.invalidate(); },
    onError: (err) => toast.error(err.message),
  });

  const openCreate = () => { setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (item: any) => {
    setForm({
      id: item.id,
      recognitionCode: item.recognitionCode || "",
      name: item.name,
      logoUrl: item.logoUrl || "",
      description: item.description || "",
      website: item.website || "",
      type: item.type,
      collaborationDetails: item.collaborationDetails || "",
      recognitionStatus: item.recognitionStatus,
      isFeatured: item.isFeatured,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      logoUrl: form.logoUrl || undefined,
      description: form.description || undefined,
      website: form.website || undefined,
      type: form.type as any,
      collaborationDetails: form.collaborationDetails || undefined,
      recognitionStatus: form.recognitionStatus as any,
      isFeatured: form.isFeatured,
    };
    if (form.id) {
      updateMutation.mutate({ id: form.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const inputClass = "w-full px-3 py-2 rounded-md border text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Organizations (Network)</h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-1" /> New Organization
        </Button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Recognition ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Recognition</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : data?.items.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No organizations yet.</TableCell></TableRow>
            ) : (
              data?.items.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{item.recognitionCode || "—"}</TableCell>
                  <TableCell className="capitalize">{item.type.replace(/_/g, " ")}</TableCell>
                  <TableCell className="capitalize">{item.recognitionStatus}</TableCell>
                  <TableCell>{item.isFeatured ? "Yes" : "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete this organization?")) deleteMutation.mutate({ id: item.id }); }}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit Organization" : "New Organization"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {form.id && (
              <div>
                <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Recognition ID</label>
                <input readOnly disabled value={form.recognitionCode || "Generated on save"} className={`${inputClass} bg-muted font-mono text-xs cursor-not-allowed`} />
              </div>
            )}
            <div>
              <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputClass}>
                  {types.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Recognition Status</label>
                <select value={form.recognitionStatus} onChange={(e) => setForm({ ...form, recognitionStatus: e.target.value })} className={inputClass}>
                  {recognitionStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Website</label>
              <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Collaboration Details</label>
              <textarea rows={3} value={form.collaborationDetails} onChange={(e) => setForm({ ...form, collaborationDetails: e.target.value })} className={inputClass} />
            </div>
            <ImageUploadField label="Logo" value={form.logoUrl} onChange={(url) => setForm({ ...form, logoUrl: url })} />
            <label className="flex items-center gap-2 text-[13px]">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
              Featured
            </label>
            <DialogFooter>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {form.id ? "Save Changes" : "Create Organization"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
