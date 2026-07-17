import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import {
  Users, Mail, Newspaper, BookOpen, CalendarDays, FlaskConical,
  Handshake, Building2, FileText, ChevronRight, Shield
} from "lucide-react";

const statCards = [
  { key: "totalUsers", label: "Total Users", icon: Users, color: "#121a1f" },
  { key: "researchArticles", label: "Research Articles", icon: BookOpen, color: "#d9a443" },
  { key: "news", label: "News Articles", icon: Newspaper, color: "#1f2a30" },
  { key: "events", label: "Events", icon: CalendarDays, color: "#a8b29f" },
  { key: "paperSubmissions", label: "Paper Submissions", icon: FileText, color: "#c25e44" },
  { key: "organizations", label: "Organizations", icon: Building2, color: "#828c78" },
  { key: "partnerships", label: "Recognition Requests", icon: Handshake, color: "#121a1f" },
  { key: "contacts", label: "Contacts", icon: Mail, color: "#c25e44" },
  { key: "researchers", label: "Researchers", icon: FlaskConical, color: "#828c78" },
];

const quickActions = [
  { label: "Manage Research Articles", desc: "Publish, edit, or unpublish research articles", href: "/dashboard/research" },
  { label: "Manage News Articles", desc: "Create and edit news content", href: "/dashboard/news" },
  { label: "Manage Events", desc: "Add upcoming events and conferences", href: "/dashboard/events" },
  { label: "Review Paper Submissions", desc: "Review submitted manuscripts for publication", href: "/dashboard/submissions" },
  { label: "Recognition Requests", desc: "Review and approve organization applications", href: "/dashboard/recognition" },
  { label: "Manage Organizations", desc: "Network & Recognition directory", href: "/dashboard/organizations" },
];

export default function Overview() {
  const { data: stats } = trpc.admin.stats.useQuery();
  const { data: contactsData } = trpc.contact.list.useQuery({ page: 1, limit: 5 });

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-5 h-5 text-[#c25e44]" />
        <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
        {statCards.map((card) => {
          const value = stats ? (stats as any)[card.key] : 0;
          return (
            <div key={card.key} className="bg-white rounded-xl p-5 border">
              <div className="flex items-center justify-between mb-3">
                <card.icon className="w-5 h-5" style={{ color: card.color }} strokeWidth={1.5} />
                <span className="text-[11px] font-medium tracking-wide uppercase text-muted-foreground">
                  {card.label}
                </span>
              </div>
              <p className="text-3xl font-semibold tracking-tight">{value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="text-[14px] font-medium">Recent Contact Submissions</h2>
            <Link to="/dashboard/contacts" className="text-[12px] text-[#c25e44] hover:text-[#a84d35]">
              View All
            </Link>
          </div>
          <div className="divide-y">
            {contactsData?.items.length === 0 ? (
              <p className="px-6 py-8 text-[13px] text-muted-foreground text-center">No contact submissions yet.</p>
            ) : (
              contactsData?.items.map((contact) => (
                <div key={contact.id} className="px-6 py-4 hover:bg-[#f4f3ef] transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[13px] font-medium">{contact.firstName} {contact.lastName}</p>
                    <span className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded ${
                      contact.status === "new" ? "bg-[#c25e44]/10 text-[#c25e44]" :
                      contact.status === "read" ? "bg-[#d9a443]/10 text-[#d9a443]" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {contact.status}
                    </span>
                  </div>
                  <p className="text-[12px] mb-1">{contact.subject}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-muted-foreground">{contact.email}</span>
                    <span className="text-[11px] text-muted-foreground">{contact.type}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-[14px] font-medium">Quick Actions</h2>
          </div>
          <div className="divide-y">
            {quickActions.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#f4f3ef] transition-colors text-left"
              >
                <div>
                  <p className="text-[13px] font-medium">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
