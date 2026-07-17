import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-[#121a1f] py-20 md:py-28">
      <div className="container-iba text-center">
        <h2 className="text-display text-3xl md:text-4xl lg:text-5xl font-normal text-[#f4f3ef] leading-[1.1] tracking-[-0.02em] mb-6">
          Join the Global Bioscience
          <br />
          Community
        </h2>
        <p className="text-[15px] leading-[1.7] text-[#a8b29f] max-w-xl mx-auto mb-10">
          Whether you are a researcher, institution, or industry partner,
          IBAI provides the network and resources to amplify your impact.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/partnerships"
            className="btn-pill bg-[#f4f3ef] text-[#121a1f] hover:bg-white group"
          >
            Partner with IBAI
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/contact"
            className="btn-pill border border-[#828c78] text-[#a8b29f] hover:border-[#f4f3ef] hover:text-[#f4f3ef] transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
