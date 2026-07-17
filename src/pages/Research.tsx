import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { keepPreviousData } from "@tanstack/react-query";
import { trpc } from "@/providers/trpc";
import { BookOpen, Download, Calendar } from "lucide-react";
import { researchAreas } from "@/data/researchAreas";
import { fallbackResearchArticles } from "@/data/fallbackResearchArticles";

const categories = [
  { value: "all", label: "All Disciplines" },
  ...researchAreas.map((a) => ({ value: a.category, label: a.title })),
];

export default function Research() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const initialCategory = categories.some((c) => c.value === categoryParam) ? categoryParam! : "all";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [page, setPage] = useState(1);

  const { data: dbData, isLoading } = trpc.researchArticle.list.useQuery(
    {
      page,
      limit: 12,
      category: selectedCategory === "all" ? undefined : (selectedCategory as any),
    },
    { retry: false, staleTime: 60_000, placeholderData: keepPreviousData }
  );

  const usingFallback = !dbData?.items || dbData.items.length === 0;
  const filteredFallback = fallbackResearchArticles.filter(
    (a) => selectedCategory === "all" || a.category === selectedCategory
  );
  const data = usingFallback
    ? { items: filteredFallback, total: filteredFallback.length, page: 1, limit: filteredFallback.length, totalPages: 1 }
    : dbData;

  const activeArea = researchAreas.find((a) => a.category === selectedCategory);

  return (
    <div className="pt-20">
      <section className="bg-[#1f2a30] py-20 md:py-28">
        <div className="container-iba">
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#828c78] mb-4">Research & Development</p>
          <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-normal text-[#f4f3ef] leading-[1.05] tracking-[-0.02em] mb-6">
            Pushing the Boundaries
            <br />of Discovery
          </h1>
          <p className="text-[17px] leading-[1.7] text-[#828c78] max-w-2xl">
            IBAI coordinates research across eight core disciplines, publishing peer-reviewed articles,
            technical reports, and clinical findings from institutions and researchers around the world.
          </p>
        </div>
      </section>

      <section className="bg-[#faf9f6] section-padding">
        <div className="container-iba">
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => { setSelectedCategory(cat.value); setPage(1); }}
                className={`px-4 py-2 rounded-full text-[12px] font-medium tracking-wide transition-all ${
                  selectedCategory === cat.value
                    ? "bg-[#121a1f] text-[#f4f3ef]"
                    : "bg-[#f4f3ef] text-[#363b42] hover:bg-[#e8e6e0]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {activeArea && (
            <p className="text-[15px] leading-[1.7] text-[#363b42] max-w-2xl mb-12 pb-8 border-b border-[#e8e6e0]">
              {activeArea.desc}
            </p>
          )}

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-[#f4f3ef] rounded-xl p-6 animate-pulse h-48" />
              ))}
            </div>
          ) : data?.items.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-[#e8e6e0] mx-auto mb-4" />
              <p className="text-[#828c78]">No research articles found in this category.</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.items.map((article: any) => (
                  <Link
                    key={article.id}
                    to={`/research/${article.slug}`}
                    className="bg-[#f4f3ef] rounded-xl p-6 border border-[#e8e6e0] hover:border-[#c25e44]/30 transition-all group block"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-semibold tracking-[0.15em] uppercase px-2 py-1 bg-[#121a1f] text-[#f4f3ef] rounded">
                        {article.category}
                      </span>
                      {article.journal && (
                        <span className="text-[11px] text-[#828c78]">{article.journal}</span>
                      )}
                    </div>
                    <h3 className="text-display text-lg font-normal text-[#121a1f] mb-3 group-hover:text-[#c25e44] transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-[12px] text-[#828c78] mb-4 line-clamp-2">{article.authors}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-[#e8e6e0]">
                      <div className="flex items-center gap-3">
                        {article.publishDate && (
                          <span className="flex items-center gap-1 text-[11px] text-[#828c78]">
                            <Calendar className="w-3 h-3" />
                            {new Date(article.publishDate).toLocaleDateString()}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[11px] text-[#828c78]">
                          <Download className="w-3 h-3" />
                          {article.downloadCount}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {data && data.total > data.limit && (
                <div className="flex justify-center mt-12 gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-[13px] border border-[#e8e6e0] rounded-lg disabled:opacity-50 hover:bg-[#f4f3ef]"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-[13px] text-[#828c78]">
                    Page {page} of {Math.ceil(data.total / data.limit)}
                  </span>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= Math.ceil(data.total / data.limit)}
                    className="px-4 py-2 text-[13px] border border-[#e8e6e0] rounded-lg disabled:opacity-50 hover:bg-[#f4f3ef]"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="bg-[#121a1f] section-padding">
        <div className="container-iba text-center max-w-2xl mx-auto">
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#a8b29f] mb-4">Have Research to Share?</p>
          <h2 className="text-display text-3xl md:text-4xl font-normal text-[#f4f3ef] tracking-[-0.02em] mb-6">
            Submit Your Paper for Publication
          </h2>
          <p className="text-[15px] leading-[1.7] text-[#828c78] mb-8">
            IBAI welcomes manuscript submissions from researchers worldwide for review, publication,
            and scientific recognition within our global network.
          </p>
          <Link to="/paper-submission" className="btn-pill-primary inline-flex">
            Submit a Paper
          </Link>
        </div>
      </section>
    </div>
  );
}
