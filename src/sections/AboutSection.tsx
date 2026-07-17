import { useRef, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, Globe, Microscope, Users, BookOpen } from "lucide-react";

const values = [
  {
    icon: Globe,
    title: "Global Collaboration",
    description: "Bridging institutions across 52 countries to accelerate bioscience breakthroughs through shared knowledge and resources.",
  },
  {
    icon: Microscope,
    title: "Research Excellence",
    description: "Maintaining the highest standards of scientific rigor, peer review, and ethical conduct in all affiliated research programs.",
  },
  {
    icon: Users,
    title: "Inclusive Community",
    description: "Welcoming researchers, startups, and institutions of all sizes to participate in our open scientific network.",
  },
  {
    icon: BookOpen,
    title: "Open Knowledge",
    description: "Championing open-access publications and data sharing to democratize bioscience research worldwide.",
  },
];

export default function AboutSection() {
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
      const elements = section.querySelectorAll(".reveal");
      elements.forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#f4f3ef] section-padding">
      <style>{`
        .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .reveal.animate-in { opacity: 1; transform: translateY(0); }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }
        .reveal-delay-4 { transition-delay: 0.4s; }
      `}</style>
      <div className="container-iba">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div className="reveal">
            <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#828c78] mb-4">
              About IBAI
            </p>
            <h2 className="text-display text-4xl md:text-5xl lg:text-[56px] font-normal text-[#121a1f] leading-[1.05] tracking-[-0.02em] mb-8">
              The Nexus of
              <br />
              Global Bioscience
            </h2>
            <div className="space-y-5 text-[15px] leading-[1.7] text-[#363b42]">
              <p>
                Founded in 2008, the International Bioscience Affiliation Initiative (IBAI) stands as the
                premier global network for bioscience research and collaboration. We unite leading
                universities, research institutes, biotechnology companies, and independent
                laboratories under a shared mission: advancing human health through scientific
                innovation.
              </p>
              <p>
                Our affiliation model enables unprecedented scale of collaboration. From
                CRISPR gene-editing breakthroughs to AI-driven drug discovery, IBAI members are
                at the forefront of transformative bioscience research that shapes the future of
                medicine, agriculture, and environmental sustainability.
              </p>
              <p>
                With dedicated programs in genomics, bioinformatics, clinical trials, and
                emerging technologies, IBAI provides the infrastructure, funding mechanisms, and
                peer networks that turn scientific potential into real-world impact.
              </p>
            </div>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 mt-8 text-[13px] font-medium tracking-[0.1em] uppercase text-[#121a1f] hover:text-[#c25e44] transition-colors group"
            >
              Learn More About IBAI
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <div
                key={value.title}
                className={`reveal reveal-delay-${i + 1} bg-[#faf9f6] rounded-2xl p-6 md:p-8 border border-[#e8e6e0] hover:border-[#c25e44]/30 transition-all duration-500 hover:shadow-lg hover:shadow-[#121a1f]/5`}
              >
                <value.icon className="w-6 h-6 text-[#c25e44] mb-4" strokeWidth={1.5} />
                <h3 className="text-display text-xl font-medium text-[#121a1f] mb-3">
                  {value.title}
                </h3>
                <p className="text-[13px] leading-[1.7] text-[#363b42]">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
