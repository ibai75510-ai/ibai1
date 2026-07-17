import { Link, useParams, Navigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { ArrowLeft, Building2, Globe, ShieldCheck } from "lucide-react";

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

export default function OrganizationDetail() {
  const { slug } = useParams();

  const { data: org, isLoading } = trpc.organization.getBySlug.useQuery(
    { slug: slug || "" },
    { retry: false, enabled: !!slug }
  );

  if (!slug) return <Navigate to="/network" replace />;

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <p className="text-[#828c78]">Loading...</p>
      </div>
    );
  }

  if (!org) return <Navigate to="/network" replace />;

  return (
    <div className="pt-20">
      <section className="bg-[#f4f3ef] py-20 md:py-28">
        <div className="container-iba max-w-3xl">
          <Link
            to="/network"
            className="inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.1em] uppercase text-[#828c78] hover:text-[#121a1f] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Network
          </Link>

          <div className="flex items-center gap-5 mb-6">
            {org.logoUrl ? (
              <img src={org.logoUrl} alt={org.name} className="w-16 h-16 rounded-xl object-contain bg-white border border-[#e8e6e0] p-2" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-white border border-[#e8e6e0] flex items-center justify-center">
                <Building2 className="w-7 h-7 text-[#c25e44]" strokeWidth={1.5} />
              </div>
            )}
            <div>
              <span className="text-[10px] font-semibold tracking-[0.15em] uppercase px-2 py-1 bg-[#121a1f] text-[#f4f3ef] rounded">
                {typeLabels[org.type] || org.type}
              </span>
            </div>
          </div>

          <h1 className="text-display text-3xl md:text-4xl lg:text-5xl font-normal text-[#121a1f] leading-[1.15] tracking-[-0.02em] mb-6">
            {org.name}
          </h1>

          <div className="flex flex-wrap items-center gap-5 text-[13px] text-[#828c78]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#c25e44]" />
              {recognitionLabels[org.recognitionStatus] || org.recognitionStatus}
            </span>
            {org.website && (
              <a
                href={org.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-[#c25e44] transition-colors"
              >
                <Globe className="w-4 h-4" />
                Visit Website
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#faf9f6] section-padding">
        <div className="container-iba max-w-3xl">
          {org.description && (
            <>
              <h2 className="text-[12px] font-medium tracking-[0.15em] uppercase text-[#828c78] mb-4">About</h2>
              <p className="text-[16px] leading-[1.8] text-[#363b42] mb-10">{org.description}</p>
            </>
          )}

          {org.collaborationDetails && (
            <>
              <h2 className="text-[12px] font-medium tracking-[0.15em] uppercase text-[#828c78] mb-4">Collaboration with IBAI</h2>
              <p className="text-[16px] leading-[1.8] text-[#363b42]">{org.collaborationDetails}</p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
