import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [searchParams] = useSearchParams();

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("local_auth_token", data.token);
      toast.success("Login successful!");
      const redirect = searchParams.get("redirect");
      window.location.href = redirect && redirect.startsWith("/") ? redirect : "/";
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center bg-[#f4f3ef]">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-10">
          <img src="/images/logo.png" alt="IBAI" className="w-12 h-12 object-contain mx-auto mb-4" />
          <h1 className="text-display text-3xl font-normal text-[#121a1f] tracking-[-0.02em] mb-2">
            Account Access
          </h1>
          <p className="text-[14px] text-[#828c78]">Sign in to your IBAI account</p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-[#e8e6e0] shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#e8e6e0] bg-[#faf9f6] text-[14px] focus:outline-none focus:border-[#c25e44]"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium tracking-wide uppercase text-[#363b42] mb-2 block">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#e8e6e0] bg-[#faf9f6] text-[14px] focus:outline-none focus:border-[#c25e44]"
              />
            </div>
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full btn-pill-primary disabled:opacity-50"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-[13px] text-[#828c78]">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-[#c25e44] hover:text-[#a84d35] font-medium">
            Get Started
          </Link>
        </p>
      </div>
    </div>
  );
}
