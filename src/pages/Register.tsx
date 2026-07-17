import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { MailCheck, ArrowRight, AlertCircle } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startRegistrationMutation = trpc.auth.startRegistration.useMutation({
    onSuccess: (data) => {
      setErrorMessage(null);
      setSubmittedEmail(data.email);
    },
    onError: (err) => {
      setErrorMessage(err.message);
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    startRegistrationMutation.mutate({ email });
  };

  if (submittedEmail) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-[#f4f3ef]">
        <div className="w-full max-w-md px-6 text-center">
          <div className="bg-white rounded-2xl p-8 border border-[#e8e6e0] shadow-sm">
            <div className="w-12 h-12 bg-[#c25e44]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MailCheck className="w-5 h-5 text-[#c25e44]" />
            </div>
            <h1 className="text-display text-2xl font-normal text-[#121a1f] tracking-[-0.02em] mb-3">
              Check your inbox
            </h1>
            <p className="text-[14px] text-[#828c78] leading-[1.7]">
              We sent a confirmation link to <span className="text-[#121a1f] font-medium">{submittedEmail}</span>.
              Click it to finish creating your account.
            </p>
          </div>
          <p className="text-center mt-6 text-[13px] text-[#828c78]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#c25e44] hover:text-[#a84d35] font-medium">
              Account Access
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center bg-[#f4f3ef]">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-10">
          <img src="/images/logo.png" alt="IBAI" className="w-12 h-12 object-contain mx-auto mb-4" />
          <h1 className="text-display text-3xl font-normal text-[#121a1f] tracking-[-0.02em] mb-2">
            Get Started
          </h1>
          <p className="text-[14px] text-[#828c78]">Enter your email to create your IBAI account</p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-[#e8e6e0] shadow-sm">
          {errorMessage && (
            <div className="flex items-start gap-3 mb-5 p-4 rounded-lg border border-red-200 bg-red-50">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-[13px] text-red-700 leading-[1.6]">{errorMessage}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#e8e6e0] bg-[#faf9f6] text-[14px] focus:outline-none focus:border-[#c25e44]"
                placeholder="your@email.com"
              />
            </div>
            <p className="text-[12px] text-[#828c78]">
              We'll send a confirmation link to this address. Click it to set your username and password.
            </p>
            <button
              type="submit"
              disabled={startRegistrationMutation.isPending}
              className="w-full btn-pill-primary disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {startRegistrationMutation.isPending ? "Sending..." : "Continue"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-[13px] text-[#828c78]">
          Already have an account?{" "}
          <Link to="/login" className="text-[#c25e44] hover:text-[#a84d35] font-medium">
            Account Access
          </Link>
        </p>
      </div>
    </div>
  );
}
