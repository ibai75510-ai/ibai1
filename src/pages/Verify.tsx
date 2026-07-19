import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { Search, ShieldCheck, Building2, ArrowRight, Copy, Check } from "lucide-react";

const typeLabels: Record<string, string> = {
  institute: "Institute",
  university: "University",
  organization: "Organization",
  lab: "Laboratory",
  research_group: "Research Group",
  journal: "Journal",
  partner: "Partner",
};

const recognitionLabels: Record<string, string> = {
  recognized: "Recognized",
  partner: "Partner",
  affiliated: "Affiliated",
};

export default function Verify() {
  const [searchParams] = useSearchParams();
  const prefill = searchParams.get("code") || searchParams.get("q") || "";
  const [input, setInput] = useState(prefill);
  const [submitted, setSubmitted] = useState(prefill);
  const [copied, setCopied] = useState(false);

  const { data, isLoading, isFetched } = trpc.organization.verify.useQuery(
    { query: submitted },
    { enabled: !!submitted, retry: false }
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setCopied(false);
    setSubmitted(input.trim());
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="pt-20">
      <section className="bg-[#1f2a30] py-20 md:py-28">
        <div className="container-iba">
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#828c78] mb-4">Verification</p>
            <h1 className="text-display text-4xl md:text-5xl font-normal text-[#f4f3ef] leading-[1.1] tracking-[-0.02em] mb-6">
              Verify an Institution
            </h1>
            <p className="text-[16px] text-[#a8b29f] leading-[1.7]">
              Confirm whether an institute, university, lab, or partner is recognized by IBAI. Search by its
              recognition ID or by name.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#faf9f6] section-padding">
        <div className="container-iba max-w-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#828c78]" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter recognition ID (e.g. IBAI-INST-00001) or institution name"
                className="w-full pl-11 pr-4 py-3.5 rounded-lg border border-[#e8e6e0] bg-white text-[14px] text-[#121a1f] focus:outline-none focus:ring-2 focus:ring-[#c25e44]/30"
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim()}
              className="btn-pill-primary text-[13px] py-3.5 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify
            </button>
          </form>

          {isLoading && <p className="text-[#828c78] text-[14px]">Searching...</p>}

          {isFetched && !isLoading && (
            <div className="space-y-8">
              {!data?.exact && !!data?.matches.length && (
                <p className="text-[14px] text-[#828c78]">
                  No exact recognition ID match. Found {data.matches.length === 1 ? "this institution" : "these institutions"} by name:
                </p>
              )}
              {!data?.exact && !data?.matches.length && (
                <p className="text-[14px] text-[#828c78]">
                  No institution found matching &ldquo;{submitted}&rdquo;. Check the spelling, or{" "}
                  <Link to="/contact" className="text-[#c25e44] hover:underline">
                    contact us
                  </Link>{" "}
                  if you believe this is an error.
                </p>
              )}

              {data?.exact && (
                <div className="bg-white rounded-xl border-2 border-[#c25e44]/40 p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-6 text-[#c25e44]">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-[12px] font-semibold tracking-[0.15em] uppercase">Verified Institution</span>
                  </div>
                  <div className="flex items-start gap-4 mb-6">
                    {data.exact.logoUrl ? (
                      <img
                        src={data.exact.logoUrl}
                        alt={data.exact.name}
                        className="w-14 h-14 rounded-lg object-contain bg-[#f4f3ef] border border-[#e8e6e0] p-2"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-[#f4f3ef] border border-[#e8e6e0] flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-[#c25e44]" strokeWidth={1.5} />
                      </div>
                    )}
                    <div>
                      <h2 className="text-[20px] font-medium text-[#121a1f] leading-tight mb-1">{data.exact.name}</h2>
                      <p className="text-[12px] text-[#828c78]">
                        {typeLabels[data.exact.type] || data.exact.type} ·{" "}
                        {recognitionLabels[data.exact.recognitionStatus] || data.exact.recognitionStatus}
                      </p>
                    </div>
                  </div>

                  {data.exact.recognitionCode && (
                    <div className="flex items-center justify-between bg-[#f4f3ef] rounded-lg px-4 py-3 mb-6">
                      <div>
                        <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#828c78] mb-0.5">
                          Recognition ID
                        </p>
                        <p className="text-[15px] font-mono font-medium text-[#121a1f]">{data.exact.recognitionCode}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyCode(data.exact!.recognitionCode!)}
                        className="flex items-center gap-1.5 text-[12px] text-[#828c78] hover:text-[#121a1f] transition-colors"
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                  )}

                  <Link
                    to={`/network/${data.exact.slug}`}
                    className="inline-flex items-center gap-2 text-[13px] font-medium text-[#c25e44] hover:text-[#a84d35] transition-colors"
                  >
                    View Full Profile
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {!!data?.matches.length && (
                <div>
                  {data.exact && (
                    <h3 className="text-[12px] font-medium tracking-[0.15em] uppercase text-[#828c78] mb-4">
                      Other matching institutions
                    </h3>
                  )}
                  <div className="grid gap-3">
                    {data.matches.map((org) => (
                      <Link
                        key={org.id}
                        to={`/network/${org.slug}`}
                        className="flex items-center justify-between bg-white rounded-lg border border-[#e8e6e0] px-5 py-4 hover:border-[#c25e44]/30 transition-all"
                      >
                        <div>
                          <p className="text-[14px] font-medium text-[#363b42]">{org.name}</p>
                          <p className="text-[11px] text-[#828c78] mt-0.5">
                            {typeLabels[org.type] || org.type}
                            {org.recognitionCode ? ` · ${org.recognitionCode}` : ""}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#828c78]" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
