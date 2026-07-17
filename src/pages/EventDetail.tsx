import { Link, useParams, Navigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { ArrowLeft, Calendar, MapPin, Users, Video, ExternalLink } from "lucide-react";
import { fallbackEvents } from "@/data/fallbackEvents";

const typeColors: Record<string, string> = {
  conference: "bg-[#121a1f]",
  workshop: "bg-[#c25e44]",
  webinar: "bg-[#828c78]",
  summit: "bg-[#d9a443]",
  symposium: "bg-[#1f2a30]",
  networking: "bg-[#a8b29f]",
};

export default function EventDetail() {
  const { id } = useParams();
  const numericId = Number(id);

  const { data: dbEvent, isLoading } = trpc.event.getById.useQuery(
    { id: numericId },
    { retry: false, enabled: Number.isFinite(numericId) }
  );

  const fallback = fallbackEvents.find((e) => e.id === numericId);
  const event = dbEvent || fallback;

  if (!Number.isFinite(numericId)) return <Navigate to="/events" replace />;

  if (isLoading && !fallback) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <p className="text-[#828c78]">Loading...</p>
      </div>
    );
  }

  if (!event) return <Navigate to="/events" replace />;

  return (
    <div className="pt-20">
      <section className="relative">
        <div className="aspect-[21/9] md:aspect-[3/1] overflow-hidden">
          <img
            src={event.coverImage || "/images/event-cover.jpg"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="bg-[#faf9f6] section-padding">
        <div className="container-iba max-w-3xl">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.1em] uppercase text-[#828c78] hover:text-[#121a1f] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`text-[10px] font-semibold tracking-[0.15em] uppercase px-2 py-1 text-white rounded ${typeColors[event.eventType] || "bg-[#121a1f]"}`}>
              {event.eventType}
            </span>
            {event.isVirtual && (
              <span className="flex items-center gap-1 text-[12px] text-[#828c78]">
                <Video className="w-3.5 h-3.5" /> Virtual
              </span>
            )}
          </div>

          <h1 className="text-display text-3xl md:text-4xl lg:text-5xl font-normal text-[#121a1f] leading-[1.15] tracking-[-0.02em] mb-8">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-[13px] text-[#828c78] mb-10 pb-8 border-b border-[#e8e6e0]">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(event.startDate).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
              {event.endDate ? ` – ${new Date(event.endDate).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}` : ""}
            </span>
            {event.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {event.location}
              </span>
            )}
            {event.maxAttendees && (
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {event.maxAttendees} max attendees
              </span>
            )}
          </div>

          <p className="text-[16px] leading-[1.8] text-[#363b42] mb-10">
            {event.description || "No description available for this event."}
          </p>

          {event.registrationUrl && (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 btn-pill-primary"
            >
              <ExternalLink className="w-4 h-4" />
              Register Now
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
