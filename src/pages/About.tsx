import { useRef, useEffect } from "react";
import { Link } from "react-router";
import { Target, Eye, Shield, Zap, Heart, Globe, Building2, Network, TrendingUp, Users2, BookOpenCheck, Award } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { partnerOrganizations } from "@/data/partnerOrganizations";

const recognitionValues = [
  { icon: Network, title: "Scientific Collaboration", desc: "Connecting institutions across borders to co-author research, share infrastructure, and accelerate discovery together." },
  { icon: TrendingUp, title: "Research Visibility", desc: "Amplifying the reach of affiliated research through our global network, publications, and events." },
  { icon: Users2, title: "Global Networking", desc: "Linking researchers, institutions, and organizations across 52 countries into one collaborative community." },
  { icon: BookOpenCheck, title: "Knowledge Sharing", desc: "Open access to research findings, tools, and methodologies across the entire affiliated network." },
  { icon: Award, title: "International Standards", desc: "Every recognized member and publication is held to internationally recognized research and publication standards." },
];

const milestones = [
  { year: "2008", title: "IBAI Founded", desc: "Established in Zurich with 12 founding institutions" },
  { year: "2012", title: "Global Expansion", desc: "Extended to 50+ institutions across 20 countries" },
  { year: "2016", title: "First Annual Summit", desc: "Inaugural conference in Geneva with 500 attendees" },
  { year: "2019", title: "CRISPR Initiative", desc: "Launched the Global Gene Editing Consortium" },
  { year: "2022", title: "AI Division", desc: "Established AI in Life Sciences research division" },
  { year: "2025", title: "240+ Members", desc: "Reached 240 affiliated institutions in 52 countries" },
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { data: orgData } = trpc.organization.list.useQuery({ page: 1, limit: 12, featured: true }, { retry: false });
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
    if (section) {
      section.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    }
    return () => observer.disconnect();
  }, []);

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
            <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#828c78] mb-4">
              About IBAI
            </p>
            <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-normal text-[#f4f3ef] leading-[1.05] tracking-[-0.02em] mb-6">
              Advancing Science
              <br />
              for Humanity
            </h1>
            <p className="text-[17px] leading-[1.7] text-[#828c78]">
              The International Bioscience Affiliation Initiative is the world&apos;s leading network
              of bioscience institutions, dedicated to accelerating scientific discovery
              and translating research into real-world solutions.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#faf9f6] section-padding">
        <div className="container-iba">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="reveal">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-[#c25e44]" strokeWidth={1.5} />
                <h2 className="text-display text-3xl font-normal text-[#121a1f] tracking-[-0.01em]">Mission</h2>
              </div>
              <p className="text-[15px] leading-[1.8] text-[#363b42]">
                To catalyze breakthrough bioscience research by connecting the world&apos;s
                leading institutions, sharing resources, and fostering collaboration across
                disciplinary and geographic boundaries. We believe that the greatest scientific
                challenges of our time require unprecedented levels of cooperation.
              </p>
            </div>
            <div className="reveal reveal-delay-1">
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-5 h-5 text-[#c25e44]" strokeWidth={1.5} />
                <h2 className="text-display text-3xl font-normal text-[#121a1f] tracking-[-0.01em]">Vision</h2>
              </div>
              <p className="text-[15px] leading-[1.8] text-[#363b42]">
                A world where bioscience innovation knows no borders. By 2035, IBAI aims to be
                the indispensable infrastructure for global life sciences research, enabling
                discoveries that eradicate disease, ensure food security, and protect our planet&apos;s
                biodiversity through the power of collaborative science.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f4f3ef] section-padding">
        <div className="container-iba">
          <div className="reveal text-center mb-16">
            <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#828c78] mb-4">Core Values</p>
            <h2 className="text-display text-3xl md:text-4xl font-normal text-[#121a1f] tracking-[-0.02em]">
              Principles That Guide Us
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Scientific Integrity", desc: "Unwavering commitment to ethical research, transparency, and reproducibility in all affiliated work." },
              { icon: Zap, title: "Innovation", desc: "Embracing emerging technologies and unconventional approaches to solve complex bioscience challenges." },
              { icon: Heart, title: "Human Impact", desc: "Prioritizing research that improves human health, environmental sustainability, and quality of life." },
              { icon: Globe, title: "Global Equity", desc: "Ensuring researchers from all regions and backgrounds have access to IBAI resources and opportunities." },
              { icon: Target, title: "Excellence", desc: "Maintaining the highest standards of peer review, methodology, and scientific rigor." },
              { icon: Eye, title: "Open Science", desc: "Championing open access, data sharing, and collaborative knowledge building." },
            ].map((v, i) => (
              <div key={v.title} className={`reveal reveal-delay-${(i % 3) + 1} bg-[#faf9f6] rounded-xl p-8 border border-[#e8e6e0]`}>
                <v.icon className="w-5 h-5 text-[#c25e44] mb-4" strokeWidth={1.5} />
                <h3 className="text-display text-lg font-medium text-[#121a1f] mb-2">{v.title}</h3>
                <p className="text-[13px] leading-[1.7] text-[#363b42]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="collaborators" className="bg-[#faf9f6] section-padding">
        <div className="container-iba">
          <div className="reveal text-center mb-16 max-w-2xl mx-auto">
            <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#828c78] mb-4">Recognition & Collaboration</p>
            <h2 className="text-display text-3xl md:text-4xl font-normal text-[#121a1f] tracking-[-0.02em] mb-5">
              A Platform Built On Global Recognition
            </h2>
            <p className="text-[15px] leading-[1.8] text-[#363b42]">
              IBAI collaborates with and formally recognizes internationally reputed research institutes,
              scientific organizations, universities, research groups, and professional communities.
              Every affiliated member is held to the same standard of scientific rigor and international
              research and publication standards.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
            {recognitionValues.map((v, i) => (
              <div key={v.title} className={`reveal reveal-delay-${(i % 3) + 1} bg-[#f4f3ef] rounded-xl p-6 border border-[#e8e6e0]`}>
                <v.icon className="w-5 h-5 text-[#c25e44] mb-4" strokeWidth={1.5} />
                <h3 className="text-[14px] font-medium text-[#121a1f] mb-2">{v.title}</h3>
                <p className="text-[12px] leading-[1.6] text-[#828c78]">{v.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-8">
            <h3 className="text-display text-2xl font-normal text-[#121a1f] tracking-[-0.01em]">
              Organizations We Collaborate With
            </h3>
            <Link
              to="/network"
              className="text-[12px] font-medium tracking-[0.1em] uppercase text-[#c25e44] hover:text-[#a84d35] transition-colors"
            >
              View Full Network
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {organizations
              ? organizations.map((org: any, i: number) => (
                  <Link
                    key={org.id}
                    to={`/network/${org.slug}`}
                    className={`reveal reveal-delay-${(i % 3) + 1} bg-[#f4f3ef] rounded-xl p-6 border border-[#e8e6e0] hover:border-[#c25e44]/30 transition-all text-center block`}
                  >
                    {org.logoUrl ? (
                      <img src={org.logoUrl} alt={org.name} className="w-8 h-8 mx-auto mb-3 object-contain" />
                    ) : (
                      <Building2 className="w-5 h-5 text-[#c25e44] mx-auto mb-3" strokeWidth={1.5} />
                    )}
                    <p className="text-[13px] font-medium text-[#363b42]">{org.name}</p>
                  </Link>
                ))
              : partnerOrganizations.map((org, i) => (
                  <div
                    key={org}
                    className={`reveal reveal-delay-${(i % 3) + 1} bg-[#f4f3ef] rounded-xl p-6 border border-[#e8e6e0] hover:border-[#c25e44]/30 transition-all text-center`}
                  >
                    <Building2 className="w-5 h-5 text-[#c25e44] mx-auto mb-3" strokeWidth={1.5} />
                    <p className="text-[13px] font-medium text-[#363b42]">{org}</p>
                  </div>
                ))}
          </div>
        </div>
      </section>

      <section className="bg-[#121a1f] section-padding">
        <div className="container-iba">
          <div className="reveal text-center mb-16">
            <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#828c78] mb-4">Our Journey</p>
            <h2 className="text-display text-3xl md:text-4xl font-normal text-[#f4f3ef] tracking-[-0.02em]">
              Milestones
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {milestones.map((m, i) => (
              <div key={m.year} className={`reveal reveal-delay-${(i % 3) + 1} border-l-2 border-[#c25e44] pl-6`}>
                <p className="text-display text-2xl font-normal text-[#c25e44] mb-2">{m.year}</p>
                <h3 className="text-[15px] font-medium text-[#f4f3ef] mb-1">{m.title}</h3>
                <p className="text-[13px] text-[#828c78]">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
