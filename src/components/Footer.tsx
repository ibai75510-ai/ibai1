import { Link } from "react-router";
import { MapPin } from "lucide-react";

const footerLinks = {
  organization: [
    { label: "About IBAI", href: "/about" },
    { label: "Collaborators", href: "/about#collaborators" },
    { label: "Global Network", href: "/network" },
    { label: "Careers", href: "/contact" },
  ],
  research: [
    { label: "Research Articles", href: "/research" },
    { label: "Clinical Trials", href: "/research?category=clinical_trials" },
    { label: "AI in Life Sciences", href: "/research?category=ai_life_sciences" },
    { label: "Submit a Paper", href: "/paper-submission" },
  ],
  engage: [
    { label: "Events", href: "/events" },
    { label: "News & Insights", href: "/news" },
    { label: "Partnerships", href: "/partnerships" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Accessibility", href: "/accessibility" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#121a1f] text-[#f4f3ef]">
      <div className="container-iba py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-8">
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-6 lg:mb-0">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <img src="/images/logo.png" alt="IBAI" className="w-10 h-10 object-contain rounded-full bg-[#f4f3ef]" />
              <span className="text-[#f4f3ef] text-sm font-medium tracking-[0.2em] uppercase">
                IBAI
              </span>
            </Link>
            <p className="text-[13px] leading-relaxed text-[#a8b29f] max-w-[240px] mb-5">
              Advancing bioscience through global collaboration, research excellence, and innovation.
            </p>
            <div className="flex items-start gap-2 max-w-[240px]">
              <MapPin className="w-4 h-4 text-[#828c78] shrink-0 mt-0.5" strokeWidth={1.5} />
              <p className="text-[12px] leading-relaxed text-[#828c78]">
                Office 19937, 182-184 High Street North,
                <br />
                East Ham, London, E6 2JA
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#828c78] mb-5">
              Organization
            </h4>
            <ul className="space-y-3">
              {footerLinks.organization.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-[13px] text-[#d4d0c8] hover:text-[#f4f3ef] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#828c78] mb-5">
              Research
            </h4>
            <ul className="space-y-3">
              {footerLinks.research.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-[13px] text-[#d4d0c8] hover:text-[#f4f3ef] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#828c78] mb-5">
              Engage
            </h4>
            <ul className="space-y-3">
              {footerLinks.engage.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-[13px] text-[#d4d0c8] hover:text-[#f4f3ef] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#828c78] mb-5">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-[13px] text-[#d4d0c8] hover:text-[#f4f3ef] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2a353c] mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[12px] text-[#828c78]">
            &copy; {new Date().getFullYear()} International Bioscience Affiliation Initiative. All rights reserved.
          </p>
          <p className="text-[12px] text-[#828c78]">
            A global affiliation of 240+ institutions driving bioscience innovation.
          </p>
        </div>
      </div>
    </footer>
  );
}
