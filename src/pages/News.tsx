import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Calendar } from "lucide-react";
import { fallbackNews } from "@/data/fallbackNews";

const categories = [
  { value: "all", label: "All" },
  { value: "research", label: "Research" },
  { value: "industry", label: "Industry" },
  { value: "events", label: "Events" },
  { value: "policy", label: "Policy" },
  { value: "funding", label: "Funding" },
  { value: "announcement", label: "Announcements" },
];

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: dbNews } = trpc.news.list.useQuery(
    { page: 1, limit: 20, category: selectedCategory === "all" ? undefined : selectedCategory as any },
    { retry: false }
  );

  const newsItems = dbNews?.items && dbNews.items.length > 0 ? dbNews.items : fallbackNews.filter(
    (n) => selectedCategory === "all" || n.category === selectedCategory
  );

  return (
    <div className="pt-20">
      <section className="bg-[#1f2a30] py-20 md:py-28">
        <div className="container-iba">
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#828c78] mb-4">News & Insights</p>
          <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-normal text-[#f4f3ef] leading-[1.05] tracking-[-0.02em] mb-6">
            The Catalyst
          </h1>
          <p className="text-[17px] leading-[1.7] text-[#828c78] max-w-2xl">
            Latest updates, breakthroughs, and announcements from the IBAI global network.
          </p>
        </div>
      </section>

      <section className="bg-[#faf9f6] section-padding">
        <div className="container-iba">
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((item: any) => (
              <Link to={`/news/${item.slug}`} key={item.id} className="group cursor-pointer block">
                <article>
                <div className="relative overflow-hidden rounded-xl mb-5 aspect-[16/10]">
                  <img
                    src={item.coverImage || "/images/news-01.jpg"}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#828c78]">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </span>
                  <span className="text-[10px] font-semibold tracking-[0.15em] uppercase px-2 py-0.5 bg-[#c25e44]/10 text-[#c25e44] rounded">
                    {item.category}
                  </span>
                </div>
                <h3 className="text-display text-lg font-normal text-[#121a1f] mb-2 group-hover:text-[#c25e44] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-[13px] leading-[1.7] text-[#363b42] mb-3">{item.excerpt}</p>
                <span className="text-[11px] text-[#828c78]">By {item.author}</span>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
