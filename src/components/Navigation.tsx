import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X, Shield } from "lucide-react";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Research", href: "/research" },
  { label: "News", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Network", href: "/network" },
  { label: "Contact", href: "/contact" },
];

// Prefetches a route's JS chunk before the user actually clicks, so
// navigation feels instant instead of waiting on the lazy-import download.
const routePrefetch: Record<string, () => Promise<unknown>> = {
  "/about": () => import("@/pages/About"),
  "/research": () => import("@/pages/Research"),
  "/news": () => import("@/pages/News"),
  "/events": () => import("@/pages/Events"),
  "/network": () => import("@/pages/Network"),
  "/contact": () => import("@/pages/Contact"),
};
const prefetchedRoutes = new Set<string>();
function prefetchRoute(href: string) {
  if (prefetchedRoutes.has(href)) return;
  const load = routePrefetch[href];
  if (!load) return;
  prefetchedRoutes.add(href);
  load();
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navClasses = scrolled
    ? "bg-[#faf9f6]/90 backdrop-blur-xl shadow-sm border-b border-[#e8e6e0]"
    : isHome
      ? "bg-transparent"
      : "bg-[#faf9f6]/80 backdrop-blur-md";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navClasses}`}
      >
        <div className="container-iba">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link
              to="/"
              className="flex items-center gap-3 group"
            >
              <img src="/images/logo.png" alt="IBAI" className="w-12 h-12 object-contain" />
              <span className="text-[#121a1f] text-sm font-medium tracking-[0.2em] uppercase hidden sm:block">
                IBAI
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onMouseEnter={() => prefetchRoute(link.href)}
                  onFocus={() => prefetchRoute(link.href)}
                  className="text-[13px] font-medium tracking-[0.08em] uppercase text-[#363b42] hover:text-[#121a1f] transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#121a1f] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              {isAdmin && (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 text-[13px] font-medium tracking-[0.08em] uppercase text-[#c25e44] hover:text-[#a84d35] transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to="/account" className="text-[13px] text-[#363b42] hover:text-[#121a1f] transition-colors">
                    {user.name}
                  </Link>
                  <button
                    onClick={logout}
                    className="text-[13px] font-medium tracking-[0.08em] uppercase text-[#363b42] hover:text-[#121a1f] transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-[13px] font-medium tracking-[0.08em] uppercase text-[#363b42] hover:text-[#121a1f] transition-colors"
                  >
                    Account Access
                  </Link>
                  <Link
                    to="/register"
                    className="btn-pill-primary text-[12px] py-2.5 px-6"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-[#121a1f]"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#faf9f6] pt-20">
          <div className="container-iba py-8">
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-2xl font-light text-[#121a1f] text-display"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-[#e8e6e0] pt-6 mt-4 flex flex-col gap-4">
                {isAdmin && (
                  <Link to="/dashboard" className="flex items-center gap-2 text-[#c25e44]">
                    <Shield className="w-4 h-4" />
                    <span className="text-lg">Admin Dashboard</span>
                  </Link>
                )}
                {user ? (
                  <button onClick={logout} className="text-left text-lg text-[#363b42]">
                    Sign Out ({user.name})
                  </button>
                ) : (
                  <>
                    <Link to="/login" className="text-lg text-[#363b42]">Account Access</Link>
                    <Link to="/register" className="btn-pill-primary w-fit">Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
