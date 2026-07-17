import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

const eventTypes = ["conference", "workshop", "webinar", "summit", "symposium", "networking"];
const statuses = ["upcoming", "ongoing", "past", "cancelled"];

function toLocalInput(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const emptyForm = {
  id: undefined as number | undefined,
  title: "",
  description: "",
  eventType: "conference",
  startDate: "",
  endDate: "",
  location: "",
  isVirtual: false,
  registrationUrl: "",
  coverImage: "",
  status: "upcoming",
  publishStatus: "draft" as "draft" | "published",
  maxAttendees: "",
};

export default function EventsAdmin() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.event.adminList.useQuery({
    page: 1,
    limit: 100,
    search: search || undefined,
    publishStatus: statusFilter ? (statusFilter as "draft" | "published") : undefined,
  });

  const createMutation = trpc.event.create.useMutation({
    onSuccess: () => { toast.success("Event created"); utils.event.adminList.invalidate(); setDialogOpen(false); },
    onError: (err) => toast.error(err.message),
  });
  const updateMutation = trpc.event.update.useMutation({
    onSuccess: () => { toast.success("Event updated"); utils.event.adminList.invalidate(); setDialogOpen(false); },
    onError: (err) => toast.error(err.message),
  });
  const deleteMutation = trpc.event.delete.useMutation({
    onSuccess: () => { toast.success("Event deleted"); utils.event.adminList.invalidate(); },
    onError: (err) => toast.error(err.message),
  });

  const openCreate = () => { setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (item: any) => {
    setForm({
      id: item.id,
      title: item.title,
      description: item.description || "",
      eventType: item.eventType,
      startDate: toLocalInput(item.startDate),
      endDate: toLocalInput(item.endDate),
      location: item.location || "",
      isVirtual: item.isVirtual,
      registrationUrl: item.registrationUrl || "",
      coverImage: item.coverImage || "",
      status: item.status,
      publishStatus: item.publishStatus,
      maxAttendees: item.maxAttendees?.toString() || "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description || undefined,
      eventType: form.eventType as any,
      startDate: form.startDate,
      endDate: form.endDate || undefined,
      location: form.location || undefined,
      isVirtual: form.isVirtual,
      registrationUrl: form.registrationUrl || undefined,
      coverImage: form.coverImage || undefined,
      status: form.status as any,
      publishStatus: form.publishStatus,
      maxAttendees: form.maxAttendees ? Number(form.maxAttendees) : undefined,
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
        <h1 className="text-2xl font-semibold tracking-tight">Events</h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-1" /> New Event
        </Button>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input placeholder="Search by title..." value={search} onChange={(e) => setSearch(e.target.value)} className={`${inputClass} pl-9`} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputClass + " w-40"}>
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : data?.items.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No events yet.</TableCell></TableRow>
            ) : (
              data?.items.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium max-w-xs truncate">{item.title}</TableCell>
                  <TableCell className="capitalize">{item.eventType}</TableCell>
                  <TableCell className="text-muted-foreground">{new Date(item.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${item.publishStatus === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {item.publishStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete this event?")) deleteMutation.mutate({ id: item.id }); }}>
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
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit Event" : "New Event"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Title *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Type</label>
                <select value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} className={inputClass}>
                  {eventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Event Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Start Date *</label>
                <input required type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">End Date</label>
                <input type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Location</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Registration URL</label>
                <input value={form.registrationUrl} onChange={(e) => setForm({ ...form, registrationUrl: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Max Attendees</label>
                <input type="number" value={form.maxAttendees} onChange={(e) => setForm({ ...form, maxAttendees: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Description</label>
              <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} />
            </div>
            <ImageUploadField label="Cover Image" value={form.coverImage} onChange={(url) => setForm({ ...form, coverImage: url })} />
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-[13px]">
                <input type="checkbox" checked={form.isVirtual} onChange={(e) => setForm({ ...form, isVirtual: e.target.checked })} />
                Virtual
              </label>
              <div className="flex-1">
                <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Publish Status</label>
                <select value={form.publishStatus} onChange={(e) => setForm({ ...form, publishStatus: e.target.value as any })} className={inputClass}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {form.id ? "Save Changes" : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
