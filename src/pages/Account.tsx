import { Navigate, Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { FileText, ExternalLink, User } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  under_review: "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  published: "bg-emerald-100 text-emerald-700",
};

export default function Account() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { data: submissions, isLoading: isLoadingSubmissions } = trpc.paperSubmission.getMine.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <p className="text-[#828c78]">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="pt-20">
      <section className="bg-[#f4f3ef] py-16 md:py-20">
        <div className="container-iba">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#121a1f] flex items-center justify-center">
              <User className="w-6 h-6 text-[#f4f3ef]" />
            </div>
            <div>
              <h1 className="text-display text-2xl md:text-3xl font-normal text-[#121a1f] tracking-[-0.01em]">
                {user?.name}
              </h1>
              <p className="text-[13px] text-[#828c78]">{user?.email || `@${user?.username}`}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#faf9f6] section-padding">
        <div className="container-iba max-w-3xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-display text-2xl font-normal text-[#121a1f] tracking-[-0.01em]">
              My Paper Submissions
            </h2>
            <Link to="/paper-submission" className="text-[12px] font-medium tracking-[0.1em] uppercase text-[#c25e44] hover:text-[#a84d35] transition-colors">
              Submit New Paper
            </Link>
          </div>

          {isLoadingSubmissions ? (
            <p className="text-[13px] text-[#828c78]">Loading...</p>
          ) : !submissions || submissions.length === 0 ? (
            <div className="bg-[#f4f3ef] rounded-xl border border-[#e8e6e0] p-10 text-center">
              <FileText className="w-8 h-8 text-[#c9c4b8] mx-auto mb-3" />
              <p className="text-[13px] text-[#828c78] mb-4">You haven't submitted any papers yet.</p>
              <Link to="/paper-submission" className="btn-pill-primary inline-flex">
                Submit Your First Paper
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub) => (
                <div key={sub.id} className="bg-[#f4f3ef] rounded-xl border border-[#e8e6e0] p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-[15px] font-medium text-[#121a1f]">{sub.title}</h3>
                    <span className={`shrink-0 text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${statusColors[sub.status]}`}>
                      {sub.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#363b42] mb-3 line-clamp-2">{sub.abstract}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#828c78]">
                      Submitted {new Date(sub.submittedAt).toLocaleDateString()}
                    </span>
                    <a
                      href={sub.manuscriptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] text-[#c25e44] hover:text-[#a84d35]"
                    >
                      <ExternalLink className="w-3 h-3" /> View Manuscript
                    </a>
                  </div>
                  {sub.adminNotes && (
                    <div className="mt-3 pt-3 border-t border-[#e8e6e0]">
                      <p className="text-[11px] font-medium uppercase text-[#828c78] mb-1">Editorial Notes</p>
                      <p className="text-[12px] text-[#363b42]">{sub.adminNotes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
