import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Calendar, MapPin, Users, Video } from "lucide-react";
import { fallbackEvents } from "@/data/fallbackEvents";

const typeColors: Record<string, string> = {
  conference: "bg-[#121a1f]",
  workshop: "bg-[#c25e44]",
  webinar: "bg-[#828c78]",
  summit: "bg-[#d9a443]",
  symposium: "bg-[#1f2a30]",
  networking: "bg-[#a8b29f]",
};

export default function Events() {
  const [filter, setFilter] = useState<string>("all");

  const { data: dbEvents } = trpc.event.list.useQuery(
    { page: 1, limit: 20, status: "upcoming" },
    { retry: false }
  );

  const events = dbEvents?.items && dbEvents.items.length > 0 ? dbEvents.items : fallbackEvents;
  const filtered = filter === "all" ? events : events.filter((e: any) => e.eventType === filter);

  return (
    <div className="pt-20">
      <section className="bg-[#1f2a30] py-20 md:py-28">
        <div className="container-iba">
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#828c78] mb-4">Events & Conferences</p>
          <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-normal text-[#f4f3ef] leading-[1.05] tracking-[-0.02em] mb-6">
            Gatherings That
            <br />Shape Science
          </h1>
          <p className="text-[17px] leading-[1.7] text-[#828c78] max-w-2xl">
            From intimate workshops to global summits, IBAI events bring the bioscience community together.
          </p>
        </div>
      </section>

      <section className="bg-[#faf9f6] section-padding">
        <div className="container-iba">
          <div className="flex flex-wrap gap-2 mb-12">
            {["all", "conference", "workshop", "webinar", "summit", "symposium", "networking"].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2 rounded-full text-[12px] font-medium tracking-wide transition-all capitalize ${
                  filter === t ? "bg-[#121a1f] text-[#f4f3ef]" : "bg-[#f4f3ef] text-[#363b42] hover:bg-[#e8e6e0]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {filtered.map((event: any) => (
              <Link
                to={`/events/${event.id}`}
                key={event.id}
                className="block bg-[#f4f3ef] rounded-xl overflow-hidden border border-[#e8e6e0] hover:border-[#c25e44]/30 transition-all group"
              >
                <div className="grid md:grid-cols-[240px_1fr]">
                  <div className="aspect-[16/10] md:aspect-auto">
                    <img src={event.coverImage || "/images/event-cover.jpg"} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className={`text-[10px] font-semibold tracking-[0.15em] uppercase px-2 py-1 text-white rounded ${typeColors[event.eventType] || "bg-[#121a1f]"}`}>
                        {event.eventType}
                      </span>
                      {event.isVirtual && (
                        <span className="flex items-center gap-1 text-[11px] text-[#828c78]">
                          <Video className="w-3 h-3" /> Virtual
                        </span>
                      )}
                    </div>
                    <h3 className="text-display text-xl md:text-2xl font-normal text-[#121a1f] mb-3 group-hover:text-[#c25e44] transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-[13px] leading-[1.7] text-[#363b42] mb-4">{event.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#828c78]">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(event.startDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>
                      {event.maxAttendees && <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {event.maxAttendees} max</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
