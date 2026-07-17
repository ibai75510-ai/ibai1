import { useRef, useEffect, useState } from "react";
import { Quote, ChevronLeft, ChevronRight, Building2 } from "lucide-react";

const testimonials = [
  {
    quote: "IBAI transformed how our institution approaches collaborative research. The network, funding mechanisms, and peer connections have accelerated our genomics program by years.",
    organization: "Meridian Institute of Genomic Sciences",
  },
  {
    quote: "The IBAI Annual Summit is where the future of bioscience takes shape. Every connection made there has led to a meaningful research collaboration or breakthrough.",
    organization: "Aurelius Life Sciences Institute",
  },
  {
    quote: "IBAI's grant program and mentorship network gave our team access to resources we never thought possible. Our work on CRISPR diagnostics is now deployed in 12 countries.",
    organization: "Vantage Genomics Consortium",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
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

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const t = testimonials[current];

  return (
    <section ref={sectionRef} className="bg-[#faf9f6] section-padding">
      <style>{`
        .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .reveal.animate-in { opacity: 1; transform: translateY(0); }
      `}</style>
      <div className="container-iba">
        <div className="reveal max-w-4xl mx-auto text-center">
          <Quote className="w-10 h-10 text-[#c25e44]/30 mx-auto mb-8" strokeWidth={1} />

          <blockquote className="text-display text-2xl md:text-3xl lg:text-4xl font-normal text-[#121a1f] leading-[1.3] tracking-[-0.01em] mb-10 transition-all duration-500">
            &ldquo;{t.quote}&rdquo;
          </blockquote>

          <div className="flex flex-col items-center gap-4 transition-all duration-500">
            <div className="w-12 h-12 rounded-full bg-[#f4f3ef] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#c25e44]" strokeWidth={1.5} />
            </div>
            <p className="text-[14px] font-medium text-[#121a1f]">{t.organization}</p>
          </div>

          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-[#e8e6e0] flex items-center justify-center text-[#363b42] hover:border-[#121a1f] hover:text-[#121a1f] transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === current ? "bg-[#121a1f]" : "bg-[#e8e6e0]"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-[#e8e6e0] flex items-center justify-center text-[#363b42] hover:border-[#121a1f] hover:text-[#121a1f] transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
