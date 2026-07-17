import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
      <div className="text-center px-6">
        <p className="text-display text-8xl md:text-9xl font-normal text-[#e8e6e0] tracking-[-0.05em] mb-4">
          404
        </p>
        <h1 className="text-display text-2xl md:text-3xl font-normal text-[#121a1f] tracking-[-0.01em] mb-4">
          Page Not Found
        </h1>
        <p className="text-[15px] text-[#363b42] mb-8 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
          Please check the URL or return to the homepage.
        </p>
        <Link
          to="/"
          className="btn-pill-primary inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
