import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryImage } from "../../types";
import { optimizedUrl } from "../../services/cloudinary/upload";

export default function Gallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<number | null>(null);

  if (!images.length) return null;

  return (
    <section className="py-20 px-6" style={{ color: "var(--color-text)" }}>
      <h2 className="section-heading text-center text-2xl md:text-3xl mb-14">Our Moments</h2>

      <div className="max-w-5xl mx-auto columns-2 md:columns-3 gap-3 space-y-3">
        {images.map((img, i) => (
          <motion.button
            key={img.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
            onClick={() => setActive(i)}
            className="block w-full break-inside-avoid overflow-hidden rounded-md"
          >
            <img
              src={optimizedUrl(img.imageUrl, 500)}
              alt={img.caption ?? "Wedding photo"}
              loading="lazy"
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
            />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
            onClick={() => setActive(null)}
          >
            <button
              className="absolute top-6 right-6 text-white text-3xl leading-none"
              onClick={() => setActive(null)}
              aria-label="Close"
            >
              &times;
            </button>
            {active > 0 && (
              <button
                className="absolute left-4 md:left-10 text-white text-4xl"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((a) => (a! > 0 ? a! - 1 : a));
                }}
                aria-label="Previous"
              >
                ‹
              </button>
            )}
            {active < images.length - 1 && (
              <button
                className="absolute right-4 md:right-10 text-white text-4xl"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((a) => (a! < images.length - 1 ? a! + 1 : a));
                }}
                aria-label="Next"
              >
                ›
              </button>
            )}
            <motion.img
              key={images[active].id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={optimizedUrl(images[active].imageUrl, 1200)}
              alt={images[active].caption ?? "Wedding photo"}
              className="max-h-[85vh] max-w-full rounded-md"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
