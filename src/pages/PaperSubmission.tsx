import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { FileText, Upload, X, Loader2, CheckCircle2 } from "lucide-react";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PaperSubmission() {
  const [form, setForm] = useState({
    authorName: "",
    affiliation: "",
    email: "",
    title: "",
    abstract: "",
    keywords: "",
    coverLetter: "",
  });
  const [manuscriptFile, setManuscriptFile] = useState<File | null>(null);
  const [supportingFiles, setSupportingFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const uploadMutation = trpc.paperSubmission.uploadFile.useMutation();
  const submitMutation = trpc.paperSubmission.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setForm({ authorName: "", affiliation: "", email: "", title: "", abstract: "", keywords: "", coverLetter: "" });
      setManuscriptFile(null);
      setSupportingFiles([]);
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manuscriptFile) {
      toast.error("Please attach your manuscript file");
      return;
    }

    setIsUploading(true);
    try {
      const manuscriptBase64 = await fileToBase64(manuscriptFile);
      const manuscriptResult = await uploadMutation.mutateAsync({
        filename: manuscriptFile.name,
        mimeType: manuscriptFile.type,
        base64Data: manuscriptBase64,
      });

      const supportingUrls: string[] = [];
      for (const file of supportingFiles) {
        const base64 = await fileToBase64(file);
        const result = await uploadMutation.mutateAsync({
          filename: file.name,
          mimeType: file.type,
          base64Data: base64,
        });
        supportingUrls.push(result.url);
      }

      submitMutation.mutate({
        ...form,
        affiliation: form.affiliation || undefined,
        keywords: form.keywords || undefined,
        coverLetter: form.coverLetter || undefined,
        manuscriptUrl: manuscriptResult.url,
        supportingFileUrls: supportingUrls.length ? supportingUrls : undefined,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const isBusy = isUploading || submitMutation.isPending;
  const inputClass = "w-full px-4 py-3 rounded-lg border border-[#e8e6e0] bg-white text-[14px] focus:outline-none focus:border-[#c25e44] transition-colors";

  return (
    <div className="pt-20">
      <section className="bg-[#1f2a30] py-20 md:py-28">
        <div className="container-iba">
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#828c78] mb-4">Paper Submission</p>
          <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-normal text-[#f4f3ef] leading-[1.05] tracking-[-0.02em] mb-6">
            Submit Your Research
          </h1>
          <p className="text-[17px] leading-[1.7] text-[#828c78] max-w-2xl">
            Submit your manuscript for publication or scientific recognition within the IBAI network.
            Our editorial team reviews every submission for scientific merit and alignment with
            international research and publication standards.
          </p>
        </div>
      </section>

      <section className="bg-[#faf9f6] section-padding">
        <div className="container-iba max-w-2xl">
          {submitted ? (
            <div className="bg-[#f4f3ef] rounded-2xl p-10 border border-[#e8e6e0] text-center">
              <CheckCircle2 className="w-10 h-10 text-[#c25e44] mx-auto mb-4" />
              <h2 className="text-display text-2xl font-normal text-[#121a1f] mb-3">Submission Received</h2>
              <p className="text-[14px] text-[#363b42] mb-6">
                Thank you for your submission. Our editorial team will review your manuscript and
                contact you with an update on its status.
              </p>
              <button onClick={() => setSubmitted(false)} className="btn-pill-primary">
                Submit Another Paper
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-[#f4f3ef] rounded-2xl p-8 border border-[#e8e6e0] space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Author Name *</label>
                  <input required value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Affiliation</label>
                  <input value={form.affiliation} onChange={(e) => setForm({ ...form, affiliation: e.target.value })} className={inputClass} placeholder="University or institution" />
                </div>
              </div>

              <div>
                <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Email *</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
              </div>

              <div>
                <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Paper Title *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
              </div>

              <div>
                <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Abstract *</label>
                <textarea required rows={5} value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} className={inputClass} />
              </div>

              <div>
                <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Keywords</label>
                <input value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} className={inputClass} placeholder="Comma-separated, e.g. genomics, CRISPR, gene therapy" />
              </div>

              <div>
                <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Manuscript File *</label>
                {manuscriptFile ? (
                  <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-[#e8e6e0] bg-white text-[13px]">
                    <span className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-[#c25e44] shrink-0" />
                      {manuscriptFile.name}
                    </span>
                    <button type="button" onClick={() => setManuscriptFile(null)}>
                      <X className="w-4 h-4 text-[#828c78]" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 px-4 py-6 rounded-lg border border-dashed border-[#e8e6e0] bg-white text-[13px] text-[#828c78] cursor-pointer hover:border-[#c25e44] transition-colors">
                    <Upload className="w-4 h-4" />
                    Click to upload manuscript (PDF, DOC, DOCX)
                    <input
                      required
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => setManuscriptFile(e.target.files?.[0] || null)}
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Supporting Files</label>
                <label className="flex items-center justify-center gap-2 px-4 py-4 rounded-lg border border-dashed border-[#e8e6e0] bg-white text-[13px] text-[#828c78] cursor-pointer hover:border-[#c25e44] transition-colors">
                  <Upload className="w-4 h-4" />
                  Add supplementary data, figures, or appendices
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => setSupportingFiles((prev) => [...prev, ...Array.from(e.target.files || [])])}
                  />
                </label>
                {supportingFiles.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {supportingFiles.map((file, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-[#e8e6e0] text-[12px]">
                        <span className="truncate">{file.name}</span>
                        <button type="button" onClick={() => setSupportingFiles((prev) => prev.filter((_, idx) => idx !== i))}>
                          <X className="w-3.5 h-3.5 text-[#828c78]" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Cover Letter</label>
                <textarea rows={4} value={form.coverLetter} onChange={(e) => setForm({ ...form, coverLetter: e.target.value })} className={inputClass} placeholder="Optional note to the editorial team" />
              </div>

              <button type="submit" disabled={isBusy} className="w-full btn-pill-primary disabled:opacity-50 flex items-center justify-center gap-2">
                {isBusy && <Loader2 className="w-4 h-4 animate-spin" />}
                {isBusy ? "Submitting..." : "Submit Paper"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
