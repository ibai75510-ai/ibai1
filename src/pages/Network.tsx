import { useRef, useEffect, useState } from "react";
import { Link } from "react-router";
import { Globe, Users, Award, Building2 } from "lucide-react";
import { trpc } from "@/providers/trpc";

const regions = [
  { name: "North America", institutions: 62, researchers: 4800, countries: 2, color: "#c25e44" },
  { name: "Europe", institutions: 78, researchers: 6200, countries: 24, color: "#d9a443" },
  { name: "Asia-Pacific", institutions: 56, researchers: 4100, countries: 14, color: "#828c78" },
  { name: "Latin America", institutions: 24, researchers: 1800, countries: 8, color: "#1f2a30" },
  { name: "Middle East & Africa", institutions: 20, researchers: 1200, countries: 14, color: "#a8b29f" },
];

const fallbackPartners = [
  "Meridian Institute of Genomic Sciences", "Northgate Biosciences Group",
  "Solvane Research Academy", "Aurelius Life Sciences Institute",
  "Continental Institute of Molecular Biology", "Everline Research Laboratories",
  "Kestrel Biomedical Research Center", "Thornbury Institute of Applied Sciences",
  "Vantage Genomics Consortium", "Halcyon Bioscience Institute",
  "Ridgemont Life Sciences Group", "Cobalt Research Foundation",
  "BioCareer",
];

const orgTypes = [
  { value: "all", label: "All" },
  { value: "institute", label: "Institutes" },
  { value: "university", label: "Universities" },
  { value: "organization", label: "Organizations" },
  { value: "lab", label: "Labs" },
  { value: "research_group", label: "Research Groups" },
  { value: "journal", label: "Journals" },
  { value: "partner", label: "Partners" },
];

export default function Network() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: orgData } = trpc.organization.list.useQuery(
    { page: 1, limit: 100, type: typeFilter === "all" ? undefined : (typeFilter as any) },
    { retry: false }
  );
  const organizations = orgData?.items && orgData.items.length > 0 ? orgData.items : null;

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
    if (section) section.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [organizations]);

  return (
    <div ref={sectionRef} className="pt-20">
      <style>{`
        .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .reveal.animate-in { opacity: 1; transform: translateY(0); }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }
      `}</style>

      <section className="bg-[#1f2a30] py-20 md:py-28">
        <div className="container-iba">
          <div className="reveal max-w-3xl">
            <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#828c78] mb-4">Global Network</p>
            <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-normal text-[#f4f3ef] leading-[1.05] tracking-[-0.02em] mb-6">
              240+ Institutions.
              <br />
              52 Countries.
              <br />
              One Mission.
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-[#faf9f6] section-padding">
        <div className="container-iba">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[
              { icon: Building2, value: "240+", label: "Institutions" },
              { icon: Users, value: "18,000+", label: "Researchers" },
              { icon: Globe, value: "52", label: "Countries" },
              { icon: Award, value: "4,200+", label: "Publications" },
            ].map((stat, i) => (
              <div key={stat.label} className={`reveal reveal-delay-${i + 1} bg-[#f4f3ef] rounded-xl p-8 text-center border border-[#e8e6e0]`}>
                <stat.icon className="w-6 h-6 text-[#c25e44] mx-auto mb-4" strokeWidth={1.5} />
                <p className="text-display text-3xl font-normal text-[#121a1f] tracking-[-0.02em]">{stat.value}</p>
                <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#828c78] mt-2">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="reveal mb-16">
            <h2 className="text-display text-3xl font-normal text-[#121a1f] tracking-[-0.01em] mb-10 text-center">
              Regional Distribution
            </h2>
            <div className="grid md:grid-cols-5 gap-4">
              {regions.map((r, i) => (
                <div key={r.name} className={`reveal reveal-delay-${(i % 3) + 1} bg-[#f4f3ef] rounded-xl p-6 border border-[#e8e6e0] text-center`}>
                  <div className="w-3 h-3 rounded-full mx-auto mb-4" style={{ backgroundColor: r.color }} />
                  <h3 className="text-[14px] font-medium text-[#121a1f] mb-3">{r.name}</h3>
                  <div className="space-y-2">
                    <p className="text-[12px] text-[#828c78]">{r.institutions} Institutions</p>
                    <p className="text-[12px] text-[#828c78]">{r.researchers.toLocaleString()} Researchers</p>
                    <p className="text-[12px] text-[#828c78]">{r.countries} Countries</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal">
            <h2 className="text-display text-3xl font-normal text-[#121a1f] tracking-[-0.01em] mb-8 text-center">
              Member Institutions
            </h2>

            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {orgTypes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTypeFilter(t.value)}
                  className={`px-4 py-2 rounded-full text-[12px] font-medium tracking-wide transition-all ${
                    typeFilter === t.value
                      ? "bg-[#121a1f] text-[#f4f3ef]"
                      : "bg-[#f4f3ef] text-[#363b42] hover:bg-[#e8e6e0]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {organizations
                ? organizations.map((org: any) => (
                    <Link
                      key={org.id}
                      to={`/network/${org.slug}`}
                      className="bg-[#f4f3ef] rounded-lg px-5 py-4 border border-[#e8e6e0] hover:border-[#c25e44]/30 transition-all text-center block"
                    >
                      {org.logoUrl ? (
                        <img src={org.logoUrl} alt={org.name} className="w-6 h-6 mx-auto mb-2 object-contain" />
                      ) : null}
                      <p className="text-[13px] font-medium text-[#363b42]">{org.name}</p>
                    </Link>
                  ))
                : fallbackPartners.map((p) => (
                    <div key={p} className="bg-[#f4f3ef] rounded-lg px-5 py-4 border border-[#e8e6e0] text-center">
                      <p className="text-[13px] font-medium text-[#363b42]">{p}</p>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
