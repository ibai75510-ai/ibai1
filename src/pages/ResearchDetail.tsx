import { useState } from "react";
import { Link, useParams, Navigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { ArrowLeft, Calendar, Download, ExternalLink, FileText, Link2, Mail, Linkedin, Twitter, Check } from "lucide-react";
import { fallbackResearchArticles } from "@/data/fallbackResearchArticles";

const categoryLabels: Record<string, string> = {
  genomics: "Genomics",
  bioinformatics: "Bioinformatics",
  biotechnology: "Biotechnology",
  clinical_trials: "Clinical Trials",
  ai_life_sciences: "AI in Life Sciences",
  synthetic_biology: "Synthetic Biology",
  cell_biology: "Cell Biology",
  structural_biology: "Structural Biology",
  other: "Other",
};

export default function ResearchDetail() {
  const { slug } = useParams();
  const [copied, setCopied] = useState(false);

  const { data: dbArticle, isLoading } = trpc.researchArticle.getBySlug.useQuery(
    { slug: slug || "" },
    { retry: false, enabled: !!slug }
  );

  const fallback = fallbackResearchArticles.find((a) => a.slug === slug);
  const article = dbArticle || fallback;

  const { data: dbRelated } = trpc.researchArticle.getRelated.useQuery(
    { id: article?.id ?? 0, category: (article?.category as any) ?? "other", limit: 3 },
    { retry: false, enabled: !!dbArticle }
  );

  const related =
    dbRelated && dbRelated.length > 0
      ? dbRelated
      : fallbackResearchArticles
          .filter((a) => article && a.category === article.category && a.id !== article.id)
          .slice(0, 3);

  if (!slug) return <Navigate to="/research" replace />;

  if (isLoading && !fallback) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <p className="text-[#828c78]">Loading...</p>
      </div>
    );
  }

  if (!article) return <Navigate to="/research" replace />;

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = article.title;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-20">
      <section className="bg-[#f4f3ef] py-20 md:py-28">
        <div className="container-iba max-w-3xl">
          <Link
            to="/research"
            className="inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.1em] uppercase text-[#828c78] hover:text-[#121a1f] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Research
          </Link>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-semibold tracking-[0.15em] uppercase px-2 py-1 bg-[#121a1f] text-[#f4f3ef] rounded">
              {categoryLabels[article.category] || article.category}
            </span>
            {article.journal && (
              <span className="text-[13px] text-[#828c78]">{article.journal}</span>
            )}
          </div>
          <h1 className="text-display text-3xl md:text-4xl lg:text-5xl font-normal text-[#121a1f] leading-[1.15] tracking-[-0.02em] mb-6">
            {article.title}
          </h1>
          <p className="text-[15px] text-[#363b42] mb-6">{article.authors}</p>
          <div className="flex flex-wrap items-center gap-5 text-[13px] text-[#828c78]">
            {article.publishDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(article.publishDate).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Download className="w-4 h-4" />
              {article.downloadCount} downloads
            </span>
            {article.doi && (
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                DOI: {article.doi}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#faf9f6] section-padding">
        <div className="container-iba">
          <div className="grid lg:grid-cols-[1fr_280px] gap-16">
            <div className="max-w-3xl">
              <h2 className="text-[12px] font-medium tracking-[0.15em] uppercase text-[#828c78] mb-4">Abstract</h2>
              <p className="text-[16px] leading-[1.8] text-[#363b42] mb-10">
                {article.abstract || "No abstract available for this article."}
              </p>

              {article.content && (
                <>
                  <h2 className="text-[12px] font-medium tracking-[0.15em] uppercase text-[#828c78] mb-4">Full Article</h2>
                  <div className="space-y-5 mb-10">
                    {article.content.split("\n\n").filter(Boolean).map((para, i) => (
                      <p key={i} className="text-[15px] leading-[1.8] text-[#363b42]">
                        {para}
                      </p>
                    ))}
                  </div>
                </>
              )}

              {article.references && (
                <>
                  <h2 className="text-[12px] font-medium tracking-[0.15em] uppercase text-[#828c78] mb-4">References</h2>
                  <div className="space-y-2 mb-10">
                    {article.references.split("\n").filter(Boolean).map((ref, i) => (
                      <p key={i} className="text-[13px] leading-[1.7] text-[#828c78]">
                        {ref}
                      </p>
                    ))}
                  </div>
                </>
              )}

              {article.pdfUrl && (
                <a
                  href={article.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 btn-pill-primary"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Full PDF
                </a>
              )}
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-xl p-6 border border-[#e8e6e0]">
                <h3 className="text-[12px] font-medium tracking-[0.15em] uppercase text-[#828c78] mb-5">Share</h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={copyLink}
                    className="flex items-center gap-2 text-[13px] text-[#363b42] hover:text-[#c25e44] transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                    {copied ? "Link copied" : "Copy link"}
                  </button>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[13px] text-[#363b42] hover:text-[#c25e44] transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    Share on X
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[13px] text-[#363b42] hover:text-[#c25e44] transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    Share on LinkedIn
                  </a>
                  <a
                    href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`}
                    className="flex items-center gap-2 text-[13px] text-[#363b42] hover:text-[#c25e44] transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Share via Email
                  </a>
                </div>
              </div>

              {related.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-[#e8e6e0]">
                  <h3 className="text-[12px] font-medium tracking-[0.15em] uppercase text-[#828c78] mb-5">Related Articles</h3>
                  <div className="space-y-5">
                    {related.map((r: any) => (
                      <Link key={r.id} to={`/research/${r.slug}`} className="block group">
                        <p className="text-[13px] font-medium text-[#121a1f] group-hover:text-[#c25e44] transition-colors leading-snug mb-1">
                          {r.title}
                        </p>
                        <p className="text-[11px] text-[#828c78]">
                          {r.publishDate && new Date(r.publishDate).toLocaleDateString()}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
