import { Link, useParams, Navigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { ArrowLeft, Calendar } from "lucide-react";
import { fallbackNews } from "@/data/fallbackNews";

const categoryLabels: Record<string, string> = {
  research: "Research",
  industry: "Industry",
  events: "Events",
  policy: "Policy",
  funding: "Funding",
  announcement: "Announcement",
};

export default function NewsDetail() {
  const { slug } = useParams();

  const { data: dbArticle, isLoading } = trpc.news.getBySlug.useQuery(
    { slug: slug || "" },
    { retry: false, enabled: !!slug }
  );

  const fallback = fallbackNews.find((n) => n.slug === slug);
  const article = dbArticle || fallback;

  if (!slug) return <Navigate to="/news" replace />;

  if (isLoading && !fallback) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <p className="text-[#828c78]">Loading...</p>
      </div>
    );
  }

  if (!article) return <Navigate to="/news" replace />;

  return (
    <div className="pt-20">
      <section className="relative">
        <div className="aspect-[21/9] md:aspect-[3/1] overflow-hidden">
          <img
            src={article.coverImage || "/images/news-01.jpg"}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="bg-[#faf9f6] section-padding">
        <div className="container-iba max-w-3xl">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.1em] uppercase text-[#828c78] hover:text-[#121a1f] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>

          <div className="flex items-center gap-4 mb-5">
            <span className="flex items-center gap-1.5 text-[12px] font-medium tracking-[0.1em] uppercase text-[#828c78]">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(article.publishedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
            </span>
            <span className="text-[10px] font-semibold tracking-[0.15em] uppercase px-2 py-0.5 bg-[#c25e44]/10 text-[#c25e44] rounded">
              {categoryLabels[article.category] || article.category}
            </span>
          </div>

          <h1 className="text-display text-3xl md:text-4xl lg:text-5xl font-normal text-[#121a1f] leading-[1.15] tracking-[-0.02em] mb-6">
            {article.title}
          </h1>

          {article.author && (
            <p className="text-[13px] text-[#828c78] mb-10">By {article.author}</p>
          )}

          <div className="space-y-6">
            {(article.content || article.excerpt || "").split("\n\n").filter(Boolean).map((para, i) => (
              <p key={i} className="text-[16px] leading-[1.8] text-[#363b42]">
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
