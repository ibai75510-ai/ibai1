import { useRef, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, MapPin, Calendar, Users } from "lucide-react";

export default function SummitSection() {
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
    <section ref={sectionRef} className="bg-[#f4f3ef] section-padding">
      <style>{`
        .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .reveal.animate-in { opacity: 1; transform: translateY(0); }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
      `}</style>
      <div className="container-iba">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="reveal">
            <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#828c78] mb-4">
              Annual Summit 2026
            </p>
            <h2 className="text-display text-4xl md:text-5xl lg:text-[56px] font-normal text-[#121a1f] leading-[1.05] tracking-[-0.02em] mb-6">
              Where Global
              <br />
              Minds Converge
            </h2>
            <p className="text-[15px] leading-[1.7] text-[#363b42] mb-8 max-w-lg">
              Join 2,000+ researchers, industry leaders, and policymakers at the
              IBAI Annual Summit in Geneva. Three days of keynotes, workshops, and
              unparalleled networking opportunities.
            </p>

            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#c25e44]" strokeWidth={1.5} />
                <span className="text-[14px] text-[#363b42]">September 14-17, 2026</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#c25e44]" strokeWidth={1.5} />
                <span className="text-[14px] text-[#363b42]">Palexpo, Geneva, Switzerland</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-[#c25e44]" strokeWidth={1.5} />
                <span className="text-[14px] text-[#363b42]">2,000+ Attendees Expected</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/events"
                className="btn-pill-terracotta group"
              >
                Register for Access
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/events"
                className="btn-pill-outline text-[12px]"
              >
                View Program
              </Link>
            </div>
          </div>

          <div className="reveal reveal-delay-1">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden aspect-[4/3]">
                <img
                  src="/images/summit-venue.jpg"
                  alt="IBAI Annual Summit Venue"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#121a1f] text-[#f4f3ef] rounded-xl p-5 shadow-xl">
                <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#828c78] mb-1">
                  Early Bird Ends
                </p>
                <p className="text-display text-2xl font-normal tracking-[-0.02em]">
                  June 30, 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
