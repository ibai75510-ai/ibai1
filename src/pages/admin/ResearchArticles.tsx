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

const categories = ["genomics", "bioinformatics", "biotechnology", "clinical_trials", "ai_life_sciences", "synthetic_biology", "cell_biology", "structural_biology", "other"];

const emptyForm = {
  id: undefined as number | undefined,
  title: "",
  authors: "",
  abstract: "",
  content: "",
  references: "",
  journal: "",
  doi: "",
  publishDate: "",
  category: "genomics",
  status: "draft" as "draft" | "published",
  pdfUrl: "",
  coverImage: "",
  isFeatured: false,
};

export default function ResearchArticles() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.researchArticle.adminList.useQuery({
    page: 1,
    limit: 100,
    search: search || undefined,
    status: statusFilter ? (statusFilter as "draft" | "published") : undefined,
  });

  const createMutation = trpc.researchArticle.create.useMutation({
    onSuccess: () => { toast.success("Article created"); utils.researchArticle.adminList.invalidate(); setDialogOpen(false); },
    onError: (err) => toast.error(err.message),
  });
  const updateMutation = trpc.researchArticle.update.useMutation({
    onSuccess: () => { toast.success("Article updated"); utils.researchArticle.adminList.invalidate(); setDialogOpen(false); },
    onError: (err) => toast.error(err.message),
  });
  const deleteMutation = trpc.researchArticle.delete.useMutation({
    onSuccess: () => { toast.success("Article deleted"); utils.researchArticle.adminList.invalidate(); },
    onError: (err) => toast.error(err.message),
  });

  const openCreate = () => { setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (item: any) => {
    setForm({
      id: item.id,
      title: item.title,
      authors: item.authors,
      abstract: item.abstract || "",
      content: item.content || "",
      references: item.references || "",
      journal: item.journal || "",
      doi: item.doi || "",
      publishDate: item.publishDate || "",
      category: item.category,
      status: item.status,
      pdfUrl: item.pdfUrl || "",
      coverImage: item.coverImage || "",
      isFeatured: item.isFeatured,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      authors: form.authors,
      abstract: form.abstract || undefined,
      content: form.content || undefined,
      references: form.references || undefined,
      journal: form.journal || undefined,
      doi: form.doi || undefined,
      publishDate: form.publishDate || undefined,
      category: form.category as any,
      status: form.status,
      pdfUrl: form.pdfUrl || undefined,
      coverImage: form.coverImage || undefined,
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
        <h1 className="text-2xl font-semibold tracking-tight">Research Articles</h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-1" /> New Article
        </Button>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} pl-9`}
          />
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
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : data?.items.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No articles yet.</TableCell></TableRow>
            ) : (
              data?.items.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium max-w-xs truncate">{item.title}</TableCell>
                  <TableCell className="capitalize">{item.category.replace(/_/g, " ")}</TableCell>
                  <TableCell>
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${item.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.publishDate || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { if (confirm("Delete this article?")) deleteMutation.mutate({ id: item.id }); }}
                    >
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
            <DialogTitle>{form.id ? "Edit Article" : "New Article"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Title *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Authors *</label>
              <input required value={form.authors} onChange={(e) => setForm({ ...form, authors: e.target.value })} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                  {categories.map((c) => <option key={c} value={c}>{c.replace(/_/g, " ")}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className={inputClass}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Journal</label>
                <input value={form.journal} onChange={(e) => setForm({ ...form, journal: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">DOI</label>
                <input value={form.doi} onChange={(e) => setForm({ ...form, doi: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Publish Date</label>
              <input type="date" value={form.publishDate} onChange={(e) => setForm({ ...form, publishDate: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Abstract</label>
              <textarea rows={3} value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Full Content</label>
              <textarea rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className={inputClass} placeholder="Separate paragraphs with a blank line" />
            </div>
            <div>
              <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">References</label>
              <textarea rows={3} value={form.references} onChange={(e) => setForm({ ...form, references: e.target.value })} className={inputClass} placeholder="One reference per line" />
            </div>
            <div>
              <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">PDF URL</label>
              <input value={form.pdfUrl} onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })} className={inputClass} />
            </div>
            <ImageUploadField label="Cover Image" value={form.coverImage} onChange={(url) => setForm({ ...form, coverImage: url })} />
            <label className="flex items-center gap-2 text-[13px]">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
              Featured
            </label>
            <DialogFooter>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {form.id ? "Save Changes" : "Create Article"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
