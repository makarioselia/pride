import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { submitMessage } from "../../firestore/messages";
import type { AttendanceStatus } from "../../types";

export default function GuestMessageForm({ weddingId }: { weddingId: string }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState<AttendanceStatus>("unspecified");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error("Please fill in your name and message");
      return;
    }
    setSubmitting(true);
    try {
      await submitMessage(weddingId, { name: name.trim(), message: message.trim(), attendanceStatus: attendance });
      setSubmitted(true);
      setName("");
      setMessage("");
      setAttendance("unspecified");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-6" style={{ color: "var(--color-text)" }}>
      <h2 className="section-heading text-center text-2xl md:text-3xl mb-4">Leave a Blessing</h2>
      <p className="text-center text-sm opacity-70 mb-10">
        Share your wishes for the happy couple
      </p>

      <div className="max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-10"
            >
              <div className="text-5xl mb-4">💌</div>
              <p className="font-heading text-xl mb-2">Thank you!</p>
              <p className="text-sm opacity-70 mb-6">
                Your message has been received and will appear once reviewed.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs uppercase tracking-widest underline"
                style={{ color: "var(--color-primary)" }}
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-b py-2 outline-none"
                style={{ borderColor: "var(--color-accent)" }}
              />
              <textarea
                placeholder="Your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full bg-transparent border-b py-2 outline-none resize-none"
                style={{ borderColor: "var(--color-accent)" }}
              />
              <div className="flex gap-3 justify-center text-xs">
                {(["attending", "maybe", "not_attending"] as AttendanceStatus[]).map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setAttendance(opt)}
                    className={`px-3 py-1.5 rounded-full border uppercase tracking-wide transition ${
                      attendance === opt ? "text-white" : "opacity-60"
                    }`}
                    style={{
                      borderColor: "var(--color-primary)",
                      backgroundColor: attendance === opt ? "var(--color-primary)" : "transparent",
                    }}
                  >
                    {opt.replace("_", " ")}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 mt-4 uppercase tracking-widest text-xs text-white rounded-full disabled:opacity-50"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {submitting ? "Sending..." : "Send Blessing"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
