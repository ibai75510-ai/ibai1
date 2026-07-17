import { useRef, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
    const particleCount = 90;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1,
      });
    }

    // Two gently drifting DNA double-helix strands, rendered behind the
    // particle network to reinforce the bioscience theme without competing
    // visually with the foreground text.
    const helices = [
      { baseX: 0.14, amplitude: 46, speed: 0.00035, phase: 0 },
      { baseX: 0.88, amplitude: 38, speed: 0.00028, phase: Math.PI },
    ];
    let t = 0;

    const drawHelix = (baseXRatio: number, amplitude: number, speed: number, phase: number) => {
      const baseX = w * baseXRatio;
      const rungGap = 26;
      const colorA = "rgba(130, 140, 120, 0.34)";
      const colorB = "rgba(194, 94, 68, 0.26)";

      const strandA: { x: number; y: number }[] = [];
      const strandB: { x: number; y: number }[] = [];

      for (let y = -rungGap; y <= h + rungGap; y += 4) {
        const angle = y * 0.02 + t * speed + phase;
        strandA.push({ x: baseX + Math.sin(angle) * amplitude, y });
        strandB.push({ x: baseX + Math.sin(angle + Math.PI) * amplitude, y });
      }

      ctx.beginPath();
      strandA.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.strokeStyle = colorA;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.beginPath();
      strandB.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.strokeStyle = colorB;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      for (let y = 0; y < strandA.length; y += Math.round(rungGap / 4)) {
        const a = strandA[y];
        const b = strandB[y];
        if (!a || !b) continue;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = "rgba(18, 26, 31, 0.11)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      t += 1;

      for (const helix of helices) {
        drawHelix(helix.baseX, helix.amplitude, helix.speed, helix.phase);
      }

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          p.vx -= dx * 0.00005;
          p.vy -= dy * 0.00005;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(18, 26, 31, 0.24)";
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(18, 26, 31, ${0.13 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleResize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    canvas.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#f4f3ef] to-[#faf9f6]">
      <style>{`
        @keyframes drift-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -40px) scale(1.08); }
        }
        @keyframes drift-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, 30px) scale(1.1); }
        }
        @keyframes drift-c {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, 20px) scale(0.95); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .hero-blob-a { animation: drift-a 22s ease-in-out infinite; }
        .hero-blob-b { animation: drift-b 26s ease-in-out infinite; }
        .hero-blob-c { animation: drift-c 18s ease-in-out infinite; }
        .hero-spin-slow { animation: spin-slow 60s linear infinite; }
      `}</style>

      <div
        className="hero-blob-a absolute top-[8%] left-[6%] w-72 h-72 rounded-full bg-[#828c78]/16 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="hero-blob-b absolute bottom-[10%] right-[8%] w-96 h-96 rounded-full bg-[#c25e44]/14 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="hero-blob-c absolute top-[35%] right-[20%] w-52 h-52 rounded-full bg-[#d9a443]/14 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <svg
        className="hero-spin-slow absolute top-[12%] right-[10%] w-40 h-40 opacity-[0.18] pointer-events-none hidden md:block"
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
      >
        <polygon
          points="50,3 90,25 90,75 50,97 10,75 10,25"
          stroke="#121a1f"
          strokeWidth="1"
        />
        <polygon
          points="50,20 75,35 75,65 50,80 25,65 25,35"
          stroke="#c25e44"
          strokeWidth="1"
        />
        <circle cx="50" cy="50" r="4" fill="#828c78" />
      </svg>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto"
      />

      <div className="relative z-10 container-iba text-center pt-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#828c78] mb-6">
            International Bioscience Affiliation Initiative
          </p>
          <h1 className="text-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-[#121a1f] leading-[1.0] tracking-[-0.03em] mb-8">
            Advancing
            <br />
            Bioscience
          </h1>
          <p className="text-[17px] md:text-[19px] text-[#363b42] leading-relaxed max-w-xl mx-auto mb-10 font-light">
            A global affiliation of 240+ institutions driving cellular innovation,
            research collaboration, and scientific excellence worldwide.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/about"
              className="btn-pill-primary group"
            >
              Explore the 2026 Impact Report
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/partnerships"
              className="btn-pill-outline"
            >
              Become an Affiliate
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
