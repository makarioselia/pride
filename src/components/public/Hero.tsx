import { motion } from "framer-motion";
import { format } from "date-fns";
import { WEDDING_ILLUSTRATIONS, type Wedding } from "../../types";

export default function Hero({ wedding }: { wedding: Wedding }) {
  const dateLabel = format(new Date(wedding.weddingDate), "EEEE, MMMM d, yyyy");
  const illustration = WEDDING_ILLUSTRATIONS.find((item) => item.id === wedding.illustration) ?? WEDDING_ILLUSTRATIONS[0];

  return (
    <section
      className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden"
      style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
    >
      {wedding.coverImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${wedding.coverImage})` }}
        />
      )}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="relative uppercase tracking-[0.35em] text-xs md:text-sm mb-6"
        style={{ color: "var(--color-primary)" }}
      >
        Together with their families
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative font-heading text-4xl md:text-7xl leading-tight"
      >
        {wedding.brideName}
        <span className="mx-4 md:mx-6" style={{ color: "var(--color-primary)" }}>
          &amp;
        </span>
        {wedding.groomName}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative mt-6 text-lg md:text-xl font-heading"
      >
        {dateLabel}
      </motion.p>

      {wedding.heroText && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="relative mt-6 max-w-xl text-sm md:text-base leading-relaxed opacity-80"
        >
          {wedding.heroText}
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.85 }}
        className="relative mt-8 flex h-20 w-20 items-center justify-center rounded-full border-2 text-5xl shadow-sm"
        style={{ borderColor: "var(--color-accent)", backgroundColor: "var(--color-bg)" }}
        aria-label={illustration.label}
      >
        <span aria-hidden="true">{illustration.emoji}</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="relative mt-10 h-16 w-px"
        style={{ backgroundColor: "var(--color-primary)" }}
      />
    </section>
  );
}
