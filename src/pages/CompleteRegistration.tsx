import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { UserPlus, XCircle, Loader2, AlertCircle } from "lucide-react";

function extractToken(searchParams: URLSearchParams): string {
  // Supabase's confirmation link appends the access_token as a URL hash
  // fragment (e.g. #access_token=...&type=invite), not a query param —
  // fall back to a `token` query param too, in case that ever changes.
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return hashParams.get("access_token") || searchParams.get("token") || "";
}

export default function CompleteRegistration() {
  const [searchParams] = useSearchParams();
  const [token] = useState(() => extractToken(searchParams));

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const checkQuery = trpc.auth.checkRegistrationToken.useQuery(
    { token },
    { enabled: !!token, retry: false }
  );

  const completeMutation = trpc.auth.completeRegistration.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("local_auth_token", data.token);
      toast.success("Account created successfully!");
      window.location.href = "/";
    },
    onError: (err) => {
      setErrorMessage(err.message);
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }
    completeMutation.mutate({ token, username, password, displayName: displayName || undefined });
  };

  if (!token || checkQuery.isError) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-[#f4f3ef]">
        <div className="w-full max-w-md px-6 text-center">
          <div className="bg-white rounded-2xl p-8 border border-[#e8e6e0] shadow-sm">
            <XCircle className="w-8 h-8 text-[#828c78] mx-auto mb-4" />
            <h1 className="text-display text-2xl font-normal text-[#121a1f] mb-2">Link Invalid or Expired</h1>
            <p className="text-[14px] text-[#828c78] mb-6">
              {checkQuery.error?.message || "This registration link is invalid. Please start again."}
            </p>
            <Link to="/register" className="btn-pill-primary inline-flex">
              Start Over
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (checkQuery.isLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-[#f4f3ef]">
        <Loader2 className="w-6 h-6 text-[#c25e44] animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center bg-[#f4f3ef]">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-10">
          <img src="/images/logo.png" alt="IBAI" className="w-12 h-12 object-contain mx-auto mb-4" />
          <h1 className="text-display text-3xl font-normal text-[#121a1f] tracking-[-0.02em] mb-2">
            Almost There
          </h1>
          <p className="text-[14px] text-[#828c78]">
            {checkQuery.data?.email} — choose a username and password to finish.
          </p>
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
              <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Username *</label>
              <input
                type="text"
                required
                minLength={3}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#e8e6e0] bg-[#faf9f6] text-[14px] focus:outline-none focus:border-[#c25e44]"
                placeholder="Choose a username"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#e8e6e0] bg-[#faf9f6] text-[14px] focus:outline-none focus:border-[#c25e44]"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Password *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#e8e6e0] bg-[#faf9f6] text-[14px] focus:outline-none focus:border-[#c25e44]"
                placeholder="Min. 6 characters"
              />
            </div>
            <button
              type="submit"
              disabled={completeMutation.isPending}
              className="w-full btn-pill-primary disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {completeMutation.isPending ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
