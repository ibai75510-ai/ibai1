import { useRef, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, Building2 } from "lucide-react";
import { partnerOrganizations } from "@/data/partnerOrganizations";

export default function PartnersSection() {
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
      { threshold: 0.15 }
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
      `}</style>
      <div className="container-iba">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div className="reveal">
            <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#828c78] mb-4">
              Our Network
            </p>
            <h2 className="text-display text-4xl md:text-5xl lg:text-[56px] font-normal text-[#121a1f] leading-[1.05] tracking-[-0.02em]">
              Organizations We
              <br />
              Collaborate With
            </h2>
          </div>
          <Link
            to="/network"
            className="reveal reveal-delay-1 inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.1em] uppercase text-[#363b42] hover:text-[#c25e44] transition-colors group w-fit"
          >
            View Full Network
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {partnerOrganizations.map((org, i) => (
            <div
              key={org}
              className={`reveal reveal-delay-${(i % 3) + 1} bg-white rounded-xl p-6 border border-[#e8e6e0] hover:border-[#c25e44]/30 transition-all text-center`}
            >
              <Building2 className="w-5 h-5 text-[#c25e44] mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-[13px] font-medium text-[#363b42]">{org}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
