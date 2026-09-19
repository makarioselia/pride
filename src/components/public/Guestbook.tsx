import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { PanInfo } from "framer-motion";
import type { GuestMessage } from "../../types";

export default function Guestbook({ messages }: { messages: GuestMessage[] }) {
  const [page, setPage] = useState(0);

  if (!messages.length) return null;

  const total = messages.length;
  const current = messages[page];

  const goNext = () => setPage((p) => Math.min(p + 1, total - 1));
  const goPrev = () => setPage((p) => Math.max(p - 1, 0));

  const onDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -80) goNext();
    else if (info.offset.x > 80) goPrev();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
  };

  return (
    <section className="py-20 px-6" style={{ color: "var(--color-text)" }}>
      <h2 className="section-heading text-center text-2xl md:text-3xl mb-4">Guestbook</h2>
      <p className="text-center text-sm opacity-70 mb-10">
        {total} {total === 1 ? "message" : "messages"} from our loved ones
      </p>

      <div
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative max-w-md mx-auto h-72 [perspective:1200px] focus:outline-none"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={onDragEnd}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 rounded-lg border p-8 flex flex-col justify-between cursor-grab active:cursor-grabbing shadow-sm print:shadow-none"
            style={{
              borderColor: "var(--color-accent)",
              backgroundColor: "var(--color-bg)",
              transformStyle: "preserve-3d",
            }}
          >
            <div className="overflow-y-auto">
              <p className="font-heading text-lg leading-relaxed">&ldquo;{current.message}&rdquo;</p>
            </div>
            <div>
              <p className="text-sm font-semibold mt-4" style={{ color: "var(--color-primary)" }}>
                — {current.name}
              </p>
              <p className="text-xs opacity-50 mt-4">
                Page {page + 1} of {total}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-6 mt-8">
        <button
          onClick={goPrev}
          disabled={page === 0}
          className="text-xs uppercase tracking-widest disabled:opacity-30"
          style={{ color: "var(--color-primary)" }}
        >
          ← Previous
        </button>
        <button
          onClick={goNext}
          disabled={page === total - 1}
          className="text-xs uppercase tracking-widest disabled:opacity-30"
          style={{ color: "var(--color-primary)" }}
        >
          Next →
        </button>
      </div>
    </section>
  );
}
