import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getWeddingBySlug } from "../../firestore/weddings";
import { subscribeEvents } from "../../firestore/events";
import { subscribeApprovedMessages } from "../../firestore/messages";
import { subscribeGallery } from "../../firestore/gallery";
import type { Wedding, WeddingEvent, GuestMessage, GalleryImage } from "../../types";
import { useApplyTheme } from "../../hooks/useApplyTheme";
import { Seo } from "../../components/ui/Seo";
import { LoadingScreen, EmptyState } from "../../components/ui/States";
import Hero from "../../components/public/Hero";
import Countdown from "../../components/public/Countdown";
import Timeline from "../../components/public/Timeline";
import Gallery from "../../components/public/Gallery";
import GuestMessageForm from "../../components/public/GuestMessageForm";
import Guestbook from "../../components/public/Guestbook";
import { exportGuestbookPdf } from "../../components/public/GuestbookPdf";

export default function WeddingPage() {
  const { slug } = useParams<{ slug: string }>();
  const [wedding, setWedding] = useState<Wedding | null | undefined>(undefined);
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);

  useApplyTheme(wedding?.theme);

  useEffect(() => {
    if (!slug) return;
    getWeddingBySlug(slug).then(setWedding);
  }, [slug]);

  useEffect(() => {
    if (!wedding) return;
    const unsub1 = subscribeEvents(wedding.id, setEvents);
    const unsub2 = subscribeApprovedMessages(wedding.id, setMessages);
    const unsub3 = subscribeGallery(wedding.id, setGallery);
    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, [wedding]);

  if (wedding === undefined) return <LoadingScreen label="Loading invitation..." />;
  if (wedding === null)
    return <EmptyState title="Invitation not found" subtitle="This wedding page doesn't exist or isn't published yet." />;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      <Seo
        title={`${wedding.brideName} & ${wedding.groomName} — Wedding Invitation`}
        description={wedding.heroText || wedding.description}
        image={wedding.coverImage}
      />
      <Hero wedding={wedding} />
      <Countdown date={wedding.weddingDate} />
      <Timeline events={events} />
      <Gallery images={gallery} />
      <GuestMessageForm weddingId={wedding.id} />
      <Guestbook messages={messages} />

      {messages.length > 0 && (
        <div className="text-center pb-16">
          <button
            onClick={() => exportGuestbookPdf(wedding, messages)}
            className="text-xs uppercase tracking-widest underline"
            style={{ color: "var(--color-primary)" }}
          >
            Export Guestbook PDF
          </button>
        </div>
      )}

      <footer className="text-center py-10 text-xs opacity-50">
        Made with love · {wedding.brideName} &amp; {wedding.groomName}
      </footer>
    </div>
  );
}
