import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useOwnedWedding } from "../../hooks/useOwnedWedding";
import { subscribeAllMessages, setMessageStatus, deleteMessage } from "../../firestore/messages";
import type { GuestMessage, MessageStatus } from "../../types";
import { LoadingScreen, EmptyState } from "../../components/ui/States";
import { exportGuestbookPdf } from "../../components/public/GuestbookPdf";

const FILTERS: (MessageStatus | "all")[] = ["all", "pending", "approved", "rejected"];

export default function AdminMessages() {
  const { wedding } = useOwnedWedding();
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [filter, setFilter] = useState<MessageStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!wedding) return;
    return subscribeAllMessages(wedding.id, setMessages);
  }, [wedding]);

  if (wedding === undefined) return <LoadingScreen />;
  if (!wedding) return null;

  const filtered = messages.filter((m) => {
    if (filter !== "all" && m.status !== filter) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.message.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const handleStatus = async (id: string, status: MessageStatus) => {
    await setMessageStatus(wedding.id, id, status);
    toast.success(`Marked as ${status}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message permanently?")) return;
    await deleteMessage(wedding.id, id);
    toast.success("Message deleted");
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportGuestbookPdf(wedding, messages);
      toast.success("Messages PDF downloaded");
    } catch {
      toast.error("Could not create the PDF");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="font-heading text-2xl">Guest Messages</h1>
        <button
          onClick={handleExport}
          disabled={exporting || messages.length === 0}
          className="bg-gold text-white px-4 py-2 rounded-md text-xs uppercase tracking-widest disabled:opacity-50"
        >
          {exporting ? "Creating PDF..." : "Export all as PDF"}
        </button>
      </div>

      <div className="flex flex-wrap gap-3 items-center mb-6">
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-widest border ${
                filter === f ? "bg-gold text-white border-gold" : "border-champagne opacity-70"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          placeholder="Search name or message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto border border-champagne rounded-md px-3 py-1.5 text-sm outline-none focus:border-gold"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No messages" subtitle="Guest messages will appear here as they come in." />
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => (
            <div key={m.id} className="bg-white border border-champagne/60 rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-sm opacity-80 mt-1">{m.message}</p>
                  <p className="text-xs opacity-50 mt-2 uppercase tracking-widest">
                    {m.status} · {m.attendanceStatus.replace("_", " ")}
                  </p>
                </div>
                <div className="flex gap-2 text-xs uppercase tracking-widest shrink-0">
                  {m.status !== "approved" && (
                    <button onClick={() => handleStatus(m.id, "approved")} className="text-green-700">
                      Approve
                    </button>
                  )}
                  {m.status !== "rejected" && (
                    <button onClick={() => handleStatus(m.id, "rejected")} className="text-orange-600">
                      Reject
                    </button>
                  )}
                  <button onClick={() => handleDelete(m.id)} className="text-red-600">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
