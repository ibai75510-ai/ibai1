import { useState } from "react";

import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { Building2, Briefcase, Landmark, Rocket, Heart } from "lucide-react";

const partnershipTypes = [
  { icon: Building2, title: "Institutional", desc: "Universities, research institutes, and laboratories seeking collaborative research frameworks and shared funding opportunities." },
  { icon: Briefcase, title: "Industry", desc: "Biotechnology and pharmaceutical companies looking to access cutting-edge research and academic talent pools." },
  { icon: Landmark, title: "Government", desc: "National and regional science agencies interested in policy coordination and large-scale research initiatives." },
  { icon: Heart, title: "NGO", desc: "Non-governmental organizations focused on global health, environmental conservation, and science advocacy." },
  { icon: Rocket, title: "Startup", desc: "Early-stage bioscience ventures seeking mentorship, network access, and technology transfer opportunities." },
];

export default function Partnerships() {
  const [form, setForm] = useState({
    organizationName: "",
    contactName: "",
    email: "",
    partnershipType: "institutional" as "institutional" | "industry" | "government" | "ngo" | "startup",
    description: "",
    website: "",
  });

  const submitMutation = trpc.partnership.submit.useMutation({
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      setForm({ organizationName: "", contactName: "", email: "", partnershipType: "institutional", description: "", website: "" });
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(form);
  };

  return (
    <div className="pt-20">
      <section className="bg-[#1f2a30] py-20 md:py-28">
        <div className="container-iba">
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#828c78] mb-4">Partnerships</p>
          <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-normal text-[#f4f3ef] leading-[1.05] tracking-[-0.02em] mb-6">
            Collaborate With Us
          </h1>
          <p className="text-[17px] leading-[1.7] text-[#828c78] max-w-2xl">
            Join a network of 240+ institutions driving bioscience innovation.
            We offer flexible partnership models for organizations of all types and sizes.
          </p>
        </div>
      </section>

      <section className="bg-[#faf9f6] section-padding">
        <div className="container-iba">
          <h2 className="text-display text-3xl font-normal text-[#121a1f] tracking-[-0.01em] mb-12 text-center">
            Partnership Types
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {partnershipTypes.map((p) => (
              <div key={p.title} className="bg-[#f4f3ef] rounded-xl p-8 border border-[#e8e6e0]">
                <p.icon className="w-6 h-6 text-[#c25e44] mb-4" strokeWidth={1.5} />
                <h3 className="text-display text-lg font-normal text-[#121a1f] mb-3">{p.title}</h3>
                <p className="text-[13px] leading-[1.7] text-[#363b42]">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-display text-3xl font-normal text-[#121a1f] tracking-[-0.01em] mb-6">
                Apply for Partnership
              </h2>
              <p className="text-[15px] leading-[1.7] text-[#363b42] mb-8">
                Tell us about your organization and how you would like to collaborate with IBAI.
                Our partnerships team will review your application and respond within 10 business days.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#c25e44]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#c25e44] text-xs font-semibold">1</span>
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#121a1f]">Submit Application</p>
                    <p className="text-[12px] text-[#828c78]">Complete the form with your organization details.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#c25e44]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#c25e44] text-xs font-semibold">2</span>
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#121a1f]">Review Process</p>
                    <p className="text-[12px] text-[#828c78]">Our team evaluates alignment with IBAI&apos;s mission and goals.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#c25e44]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#c25e44] text-xs font-semibold">3</span>
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#121a1f]">Partnership Agreement</p>
                    <p className="text-[12px] text-[#828c78]">Formalize collaboration with a tailored partnership agreement.</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-[#f4f3ef] rounded-2xl p-8 border border-[#e8e6e0]">
              <div className="space-y-5">
                <div>
                  <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Organization Name *</label>
                  <input
                    type="text"
                    required
                    value={form.organizationName}
                    onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[#e8e6e0] bg-white text-[14px] focus:outline-none focus:border-[#c25e44] transition-colors"
                    placeholder="e.g., Northgate Biosciences Group"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Contact Name</label>
                  <input
                    type="text"
                    value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[#e8e6e0] bg-white text-[14px] focus:outline-none focus:border-[#c25e44] transition-colors"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[#e8e6e0] bg-white text-[14px] focus:outline-none focus:border-[#c25e44] transition-colors"
                    placeholder="contact@organization.edu"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Partnership Type *</label>
                  <select
                    value={form.partnershipType}
                    onChange={(e) => setForm({ ...form, partnershipType: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-lg border border-[#e8e6e0] bg-white text-[14px] focus:outline-none focus:border-[#c25e44] transition-colors"
                  >
                    <option value="institutional">Institutional</option>
                    <option value="industry">Industry</option>
                    <option value="government">Government</option>
                    <option value="ngo">NGO</option>
                    <option value="startup">Startup</option>
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[#e8e6e0] bg-white text-[14px] focus:outline-none focus:border-[#c25e44] transition-colors resize-none"
                    placeholder="Describe your organization and collaboration interests..."
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Website</label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[#e8e6e0] bg-white text-[14px] focus:outline-none focus:border-[#c25e44] transition-colors"
                    placeholder="https://..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="w-full btn-pill-primary disabled:opacity-50"
                >
                  {submitMutation.isPending ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
