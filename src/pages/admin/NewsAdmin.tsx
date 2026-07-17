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

const categories = ["research", "industry", "events", "policy", "funding", "announcement"];

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const emptyForm = {
  id: undefined as number | undefined,
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "announcement",
  status: "draft" as "draft" | "published",
  author: "",
  isFeatured: false,
};

export default function NewsAdmin() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.news.adminList.useQuery({
    page: 1,
    limit: 100,
    search: search || undefined,
    status: statusFilter ? (statusFilter as "draft" | "published") : undefined,
  });

  const createMutation = trpc.news.create.useMutation({
    onSuccess: () => { toast.success("Article created"); utils.news.adminList.invalidate(); setDialogOpen(false); },
    onError: (err) => toast.error(err.message),
  });
  const updateMutation = trpc.news.update.useMutation({
    onSuccess: () => { toast.success("Article updated"); utils.news.adminList.invalidate(); setDialogOpen(false); },
    onError: (err) => toast.error(err.message),
  });
  const deleteMutation = trpc.news.delete.useMutation({
    onSuccess: () => { toast.success("Article deleted"); utils.news.adminList.invalidate(); },
    onError: (err) => toast.error(err.message),
  });

  const openCreate = () => { setForm(emptyForm); setSlugTouched(false); setDialogOpen(true); };
  const openEdit = (item: any) => {
    setForm({
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt || "",
      content: item.content,
      coverImage: item.coverImage || "",
      category: item.category,
      status: item.status,
      author: item.author || "",
      isFeatured: item.isFeatured,
    });
    setSlugTouched(true);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || undefined,
      content: form.content,
      coverImage: form.coverImage || undefined,
      category: form.category as any,
      status: form.status,
      author: form.author || undefined,
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
        <h1 className="text-2xl font-semibold tracking-tight">News</h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-1" /> New Article
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
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Author</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : data?.items.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No news articles yet.</TableCell></TableRow>
            ) : (
              data?.items.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium max-w-xs truncate">{item.title}</TableCell>
                  <TableCell className="capitalize">{item.category}</TableCell>
                  <TableCell>
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${item.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.author || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete this article?")) deleteMutation.mutate({ id: item.id }); }}>
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
              <input
                required
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
                }}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Slug *</label>
              <input required value={form.slug} onChange={(e) => { setSlugTouched(true); setForm({ ...form, slug: e.target.value }); }} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
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
            <div>
              <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Author</label>
              <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Excerpt</label>
              <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-[12px] font-medium uppercase text-muted-foreground mb-1 block">Content *</label>
              <textarea required rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className={inputClass} placeholder="Separate paragraphs with a blank line" />
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
