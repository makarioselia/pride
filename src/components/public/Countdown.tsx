import { motion } from "framer-motion";
import { useCountdown } from "../../hooks/useCountdown";

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center px-4 md:px-8">
      <span className="font-heading text-3xl md:text-5xl" style={{ color: "var(--color-primary)" }}>
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-2 text-[10px] md:text-xs uppercase tracking-[0.25em] opacity-70">
        {label}
      </span>
    </div>
  );
}

export default function Countdown({ date }: { date: string }) {
  const { days, hours, minutes, seconds, isPast } = useCountdown(date);

  return (
    <section className="py-16 px-6 text-center" style={{ color: "var(--color-text)" }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        {isPast ? (
          <p className="font-heading text-2xl">Forever begins now</p>
        ) : (
          <>
            <p className="uppercase tracking-[0.3em] text-xs mb-8 opacity-70">Counting down to our big day</p>
            <div className="flex items-center justify-center divide-x" style={{ borderColor: "var(--color-accent)" }}>
              <Unit value={days} label="Days" />
              <Unit value={hours} label="Hours" />
              <Unit value={minutes} label="Minutes" />
              <Unit value={seconds} label="Seconds" />
            </div>
          </>
        )}
      </motion.div>
    </section>
  );
}
