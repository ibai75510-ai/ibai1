import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { Mail, MapPin, Clock, Send, ArrowRight } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    subject: "",
    message: "",
    type: "general" as
      | "general"
      | "collaboration"
      | "research_partnership"
      | "publication_support"
      | "recognition_request"
      | "technical_support"
      | "paper_submission",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setForm({ firstName: "", lastName: "", email: "", organization: "", subject: "", message: "", type: "general" });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2800);
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(form);
  };

  return (
    <div className="pt-20">
      <style>{`
        @keyframes success-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes success-pop-in {
          from { opacity: 0; transform: scale(0.8) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes success-ring-draw { to { stroke-dashoffset: 0; } }
        @keyframes success-check-draw { to { stroke-dashoffset: 0; } }
        @keyframes success-ring-pulse {
          0% { transform: scale(0.9); opacity: 0.5; }
          70% { transform: scale(1.15); opacity: 0; }
          100% { transform: scale(1.15); opacity: 0; }
        }
        .success-overlay { animation: success-fade-in 0.25s ease-out; }
        .success-card { animation: success-pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .success-pulse {
          animation: success-ring-pulse 1.6s cubic-bezier(0.2, 0.7, 0.3, 1) 0.5s 1;
        }
        .success-ring {
          stroke-dasharray: 151;
          stroke-dashoffset: 151;
          animation: success-ring-draw 0.5s ease-out forwards;
        }
        .success-check {
          stroke-dasharray: 36;
          stroke-dashoffset: 36;
          animation: success-check-draw 0.35s ease-out 0.45s forwards;
        }
      `}</style>

      {showSuccess && (
        <div
          className="success-overlay fixed inset-0 z-50 flex items-center justify-center bg-[#121a1f]/50 backdrop-blur-sm"
          onClick={() => setShowSuccess(false)}
          role="status"
          aria-live="polite"
        >
          <div className="success-card bg-[#faf9f6] rounded-2xl px-10 py-12 flex flex-col items-center text-center shadow-2xl max-w-sm mx-4">
            <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
              <span className="success-pulse absolute inset-0 rounded-full border-2 border-[#c25e44]" />
              <svg viewBox="0 0 52 52" className="w-20 h-20">
                <circle className="success-ring" cx="26" cy="26" r="24" fill="none" stroke="#c25e44" strokeWidth="2" />
                <path className="success-check" fill="none" stroke="#c25e44" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M14 27l7 7 16-16" />
              </svg>
            </div>
            <h3 className="text-display text-2xl font-normal text-[#121a1f] tracking-[-0.01em] mb-2">Message Sent</h3>
            <p className="text-[14px] text-[#828c78] leading-relaxed">
              Thank you for reaching out. We'll get back to you soon.
            </p>
          </div>
        </div>
      )}

      <section className="bg-[#1f2a30] py-20 md:py-28">
        <div className="container-iba">
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#828c78] mb-4">Contact</p>
          <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-normal text-[#f4f3ef] leading-[1.05] tracking-[-0.02em] mb-6">
            Get in Touch
          </h1>
          <p className="text-[17px] leading-[1.7] text-[#828c78] max-w-2xl">
            Whether you have a question about membership, research collaboration,
            or media inquiries, we would love to hear from you.
          </p>
        </div>
      </section>

      <section className="bg-[#faf9f6] section-padding">
        <div className="container-iba">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16">
            <div>
              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#121a1f] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-[#f4f3ef]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#121a1f] mb-1">Headquarters</p>
                    <p className="text-[13px] text-[#363b42] leading-relaxed">
                      IBAI Global Headquarters<br />
                      Bahnhofstrasse 42<br />
                      8001 Zurich, Switzerland
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#121a1f] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-[#f4f3ef]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#121a1f] mb-1">Email</p>
                    <p className="text-[13px] text-[#363b42]">ibai75510@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#121a1f] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-[#f4f3ef]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#121a1f] mb-1">Office Hours</p>
                    <p className="text-[13px] text-[#363b42]">Monday - Friday: 9:00 - 18:00 CET</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#121a1f] rounded-xl p-6">
                <p className="text-[14px] font-medium text-[#f4f3ef] mb-2">Interested in partnership?</p>
                <p className="text-[12px] text-[#828c78] mb-4">
                  Learn about our partnership programs and how your organization can collaborate with IBAI.
                </p>
                <Link
                  to="/partnerships"
                  className="inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.1em] uppercase text-[#c25e44] hover:text-[#f4f3ef] transition-colors group"
                >
                  Partnership Info
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-[#f4f3ef] rounded-2xl p-8 border border-[#e8e6e0]">
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">First Name *</label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[#e8e6e0] bg-white text-[14px] focus:outline-none focus:border-[#c25e44]"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[#e8e6e0] bg-white text-[14px] focus:outline-none focus:border-[#c25e44]"
                  />
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[#e8e6e0] bg-white text-[14px] focus:outline-none focus:border-[#c25e44]"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Organization</label>
                  <input
                    type="text"
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[#e8e6e0] bg-white text-[14px] focus:outline-none focus:border-[#c25e44]"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Inquiry Type *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-lg border border-[#e8e6e0] bg-white text-[14px] focus:outline-none focus:border-[#c25e44]"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="research_partnership">Research Partnership</option>
                    <option value="publication_support">Publication Support</option>
                    <option value="recognition_request">Recognition Request</option>
                    <option value="technical_support">Technical Support</option>
                    <option value="paper_submission">Paper Submission</option>
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Subject *</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[#e8e6e0] bg-white text-[14px] focus:outline-none focus:border-[#c25e44]"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Message *</label>
                  <textarea
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[#e8e6e0] bg-white text-[14px] focus:outline-none focus:border-[#c25e44] resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="w-full btn-pill-primary disabled:opacity-50"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {submitMutation.isPending ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
