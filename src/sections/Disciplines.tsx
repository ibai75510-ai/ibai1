import { useRef, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, Dna, Brain, FlaskConical, Pill, Cpu, Leaf } from "lucide-react";

const disciplines = [
  {
    icon: Dna,
    title: "Genomics",
    description: "Advancing genome sequencing, functional genomics, and personalized medicine through large-scale collaborative projects.",
    stats: "340+ Active Projects",
  },
  {
    icon: Brain,
    title: "Bioinformatics",
    description: "Developing computational tools and algorithms for biological data analysis, from sequence alignment to systems biology.",
    stats: "120+ Software Tools",
  },
  {
    icon: FlaskConical,
    title: "Biotechnology",
    description: "Translating laboratory discoveries into commercial products, from biopharmaceuticals to sustainable biomaterials.",
    stats: "85+ Patents Filed",
  },
  {
    icon: Pill,
    title: "Clinical Trials",
    description: "Coordinating multi-center Phase I-IV trials with standardized protocols and shared patient data infrastructure.",
    stats: "67 Active Trials",
  },
  {
    icon: Cpu,
    title: "AI in Life Sciences",
    description: "Applying machine learning and neural networks to drug discovery, protein folding, and predictive diagnostics.",
    stats: "50+ AI Models",
  },
  {
    icon: Leaf,
    title: "Synthetic Biology",
    description: "Engineering biological systems for novel functions, from biosensors to sustainable biofuels and food production.",
    stats: "90+ Research Groups",
  },
];

export default function Disciplines() {
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
    <section ref={sectionRef} className="bg-[#121a1f] section-padding">
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
              Research Areas
            </p>
            <h2 className="text-display text-4xl md:text-5xl lg:text-[56px] font-normal text-[#f4f3ef] leading-[1.05] tracking-[-0.02em]">
              Our Core
              <br />
              Disciplines
            </h2>
          </div>
          <Link
            to="/research"
            className="reveal reveal-delay-1 inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.1em] uppercase text-[#a8b29f] hover:text-[#f4f3ef] transition-colors group w-fit"
          >
            View All Research
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2a353c]">
          {disciplines.map((d, i) => (
            <div
              key={d.title}
              className={`reveal reveal-delay-${(i % 3) + 1} bg-[#121a1f] p-8 md:p-10 group hover:bg-[#1a2429] transition-colors duration-500`}
            >
              <d.icon className="w-7 h-7 text-[#c25e44] mb-6" strokeWidth={1.5} />
              <h3 className="text-display text-2xl font-normal text-[#f4f3ef] mb-3 tracking-[-0.01em]">
                {d.title}
              </h3>
              <p className="text-[14px] leading-[1.7] text-[#a8b29f] mb-6">
                {d.description}
              </p>
              <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#828c78]">
                {d.stats}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
