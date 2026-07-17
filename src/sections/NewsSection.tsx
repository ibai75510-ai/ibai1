import { useRef, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, Calendar } from "lucide-react";

const newsItems = [
  {
    date: "15.03.2026",
    category: "Research",
    title: "New CRISPR Phase 3 Trials Show 94% Efficacy in Sickle Cell Treatment",
    excerpt: "Multi-center study across 12 IBAI-affiliated institutions demonstrates groundbreaking results in gene therapy.",
    image: "/images/research-01.jpg",
  },
  {
    date: "12.03.2026",
    category: "Industry",
    title: "IBAI Partners with Global Pharma Consortium on AI Drug Discovery Platform",
    excerpt: "A $240M initiative to develop next-generation pharmaceutical compounds using machine learning.",
    image: "/images/team-collab.jpg",
  },
  {
    date: "08.03.2026",
    category: "Policy",
    title: "New Bioscience Ethics Framework Adopted by 38 Member Countries",
    excerpt: "Comprehensive guidelines for responsible AI in life sciences and genetic research published.",
    image: "/images/news-01.jpg",
  },
  {
    date: "01.03.2026",
    category: "Funding",
    title: "IBAI Announces $50M Grant Program for Early-Career Researchers",
    excerpt: "Open call for proposals in genomics, synthetic biology, and environmental bioscience.",
    image: "/images/news-02.jpg",
  },
];

export default function NewsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const section = sectionRef.current;
    if (section) {
      section.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#faf9f6] section-padding">
      <style>{`
        .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .reveal.animate-in { opacity: 1; transform: translateY(0); }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }
        .reveal-delay-4 { transition-delay: 0.4s; }
      `}</style>
      <div className="container-iba">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div className="reveal">
            <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#828c78] mb-4">
              News & Insights
            </p>
            <h2 className="text-display text-4xl md:text-5xl lg:text-[56px] font-normal text-[#121a1f] leading-[1.05] tracking-[-0.02em]">
              The Catalyst
            </h2>
          </div>
          <Link
            to="/news"
            className="reveal reveal-delay-1 inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.1em] uppercase text-[#363b42] hover:text-[#c25e44] transition-colors group w-fit"
          >
            View All News
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {newsItems.map((item, i) => (
            <article
              key={item.title}
              className={`reveal reveal-delay-${i + 1} group cursor-pointer`}
            >
              <div className="relative overflow-hidden rounded-xl mb-5 aspect-[16/10]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121a1f]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="flex items-center gap-4 mb-3">
                <span className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.1em] uppercase text-[#828c78]">
                  <Calendar className="w-3 h-3" />
                  {item.date}
                </span>
                <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#c25e44]">
                  {item.category}
                </span>
              </div>
              <h3 className="text-display text-xl md:text-2xl font-normal text-[#121a1f] leading-[1.2] tracking-[-0.01em] mb-3 group-hover:text-[#c25e44] transition-colors">
                {item.title}
              </h3>
              <p className="text-[14px] leading-[1.7] text-[#363b42]">
                {item.excerpt}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
