import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useOwnedWedding } from "../../hooks/useOwnedWedding";
import { subscribeEvents, addEvent, updateEvent, deleteEvent } from "../../firestore/events";
import type { WeddingEvent } from "../../types";
import { LoadingScreen, EmptyState } from "../../components/ui/States";

const emptyForm = {
  title: "",
  date: "",
  time: "",
  location: "",
  address: "",
  mapsUrl: "",
  description: "",
  icon: "default",
};

const ICON_OPTIONS = ["church", "hall", "photo", "reception", "default"];

export default function AdminEvents() {
  const { wedding } = useOwnedWedding();
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [form, setForm] = useState<any>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!wedding) return;
    return subscribeEvents(wedding.id, setEvents);
  }, [wedding]);

  if (wedding === undefined) return <LoadingScreen />;
  if (!wedding) return null;

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date) {
      toast.error("Title and date are required");
      return;
    }
    try {
      if (editingId) {
        await updateEvent(wedding.id, editingId, form);
        toast.success("Event updated");
      } else {
        await addEvent(wedding.id, { ...form, order: events.length });
        toast.success("Event added");
      }
      resetForm();
    } catch {
      toast.error("Failed to save event");
    }
  };

  const handleEdit = (ev: WeddingEvent) => {
    setForm(ev);
    setEditingId(ev.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    await deleteEvent(wedding.id, id);
    toast.success("Event deleted");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-2xl">Timeline Events</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-gold text-white px-4 py-2 rounded-md text-xs uppercase tracking-widest"
        >
          + Add event
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-champagne/60 rounded-lg p-5 mb-8 space-y-3 max-w-xl">
          <input className="input" placeholder="Title (e.g. Church Ceremony)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <div className="flex gap-3">
            <input type="date" className="input" value={form.date?.slice(0, 10) ?? ""} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <input type="time" className="input" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          </div>
          <input className="input" placeholder="Location name" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <input className="input" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <input className="input" placeholder="Google Maps URL" value={form.mapsUrl} onChange={(e) => setForm({ ...form, mapsUrl: e.target.value })} />
          <textarea className="input" placeholder="Description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <select className="input" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
            {ICON_OPTIONS.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          <div className="flex gap-3">
            <button type="submit" className="bg-gold text-white px-5 py-2 rounded-md text-xs uppercase tracking-widest">
              {editingId ? "Update" : "Add"}
            </button>
            <button type="button" onClick={resetForm} className="text-xs uppercase tracking-widest opacity-60">
              Cancel
            </button>
          </div>
        </form>
      )}

      {events.length === 0 ? (
        <EmptyState title="No events yet" subtitle="Add your first timeline event above." />
      ) : (
        <div className="space-y-3">
          {events.map((ev) => (
            <div key={ev.id} className="bg-white border border-champagne/60 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{ev.title}</p>
                <p className="text-xs opacity-60">
                  {ev.date?.slice(0, 10)} · {ev.time} · {ev.location}
                </p>
              </div>
              <div className="flex gap-3 text-xs uppercase tracking-widest">
                <button onClick={() => handleEdit(ev)} className="opacity-70 hover:opacity-100">Edit</button>
                <button onClick={() => handleDelete(ev.id)} className="text-red-600 opacity-70 hover:opacity-100">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`.input { width: 100%; border: 1px solid #E9DCC3; border-radius: 6px; padding: 10px 12px; font-size: 14px; outline: none; } .input:focus { border-color: #C9A66B; }`}</style>
    </div>
  );
}
