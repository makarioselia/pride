import { motion } from "framer-motion";
import { format } from "date-fns";
import type { WeddingEvent } from "../../types";

const ICONS: Record<string, string> = {
  church: "⛪",
  hall: "💍",
  photo: "📷",
  reception: "🥂",
  default: "✦",
};

export default function Timeline({ events }: { events: WeddingEvent[] }) {
  if (!events.length) return null;

  return (
    <section className="py-20 px-6" style={{ color: "var(--color-text)" }}>
      <h2 className="section-heading text-center text-2xl md:text-3xl mb-14">
        The Celebration
      </h2>

      <div className="max-w-2xl mx-auto relative">
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
          style={{ backgroundColor: "var(--color-accent)" }}
        />
        {events.map((ev, i) => (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className={`relative mb-12 md:w-1/2 ${
              i % 2 === 0 ? "md:pr-10 md:text-right md:ml-0" : "md:pl-10 md:ml-auto"
            }`}
          >
            <div
              className="hidden md:block absolute top-1 w-3 h-3 rounded-full"
              style={{
                backgroundColor: "var(--color-primary)",
                [i % 2 === 0 ? "right" : "left"]: "-6px",
              }}
            />
            <div className="text-2xl mb-2">{ICONS[ev.icon] ?? ICONS.default}</div>
            <h3 className="font-heading text-xl mb-1">{ev.title}</h3>
            <p className="text-sm opacity-70 mb-1">
              {format(new Date(ev.date), "EEEE, MMM d, yyyy")} · {ev.time}
            </p>
            <p className="text-sm opacity-80">{ev.location}</p>
            {ev.description && <p className="text-sm mt-2 opacity-70">{ev.description}</p>}
            {ev.mapsUrl && (
              <a
                href={ev.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-3 text-xs uppercase tracking-widest underline"
                style={{ color: "var(--color-primary)" }}
              >
                View on map
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
