import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useOwnedWedding } from "../../hooks/useOwnedWedding";
import { updateWedding, isSlugTaken } from "../../firestore/weddings";
import { uploadImageToCloudinary } from "../../services/cloudinary/upload";
import { LoadingScreen } from "../../components/ui/States";
import { WEDDING_ILLUSTRATIONS } from "../../types";

export default function AdminSettings() {
  const { wedding, reload } = useOwnedWedding();
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savedUrl, setSavedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (wedding) setForm(wedding);
  }, [wedding]);

  if (wedding === undefined || !form) return <LoadingScreen />;

  const handleChange = (key: string, value: any) => setForm((f: any) => ({ ...f, [key]: value }));

  const handleCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImageToCloudinary(file);
      handleChange("coverImage", res.secure_url);
      toast.success("Cover image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!wedding) return;
    if (!form.brideName?.trim() || !form.groomName?.trim() || !form.slug?.trim()) {
      toast.error("Bride name, groom name, and slug are required");
      return;
    }
    setSaving(true);
    try {
      const slug = form.slug.trim().toLowerCase().replace(/\s+/g, "-");
      const taken = await isSlugTaken(slug, wedding.id);
      if (taken) {
        toast.error("This slug is already in use, choose another");
        setSaving(false);
        return;
      }
      const weddingUpdates = {
        brideName: form.brideName,
        groomName: form.groomName,
        weddingDate: form.weddingDate,
        slug,
        description: form.description,
        heroText: form.heroText,
        published: form.published,
        illustration: form.illustration ?? "hearts",
        ...(form.coverImage !== undefined ? { coverImage: form.coverImage } : {}),
      };
      await updateWedding(wedding.id, weddingUpdates);
      setSavedUrl(`${window.location.origin}/wedding/${slug}`);
      toast.success("Saved");
      reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="font-heading text-2xl mb-8">Wedding Settings</h1>

      <div className="space-y-5">
        <Field label="Bride name">
          <input className="input" value={form.brideName} onChange={(e) => handleChange("brideName", e.target.value)} />
        </Field>
        <Field label="Groom name">
          <input className="input" value={form.groomName} onChange={(e) => handleChange("groomName", e.target.value)} />
        </Field>
        <Field label="Wedding date & time">
          <input
            type="datetime-local"
            className="input"
            value={form.weddingDate ? form.weddingDate.slice(0, 16) : ""}
            onChange={(e) => handleChange("weddingDate", new Date(e.target.value).toISOString())}
          />
        </Field>
        <Field label="Slug (public URL)">
          <div className="flex items-center gap-2 text-sm">
            <span className="opacity-50">/wedding/</span>
            <input className="input" value={form.slug} onChange={(e) => handleChange("slug", e.target.value)} />
          </div>
        </Field>
        <Field label="Hero text">
          <textarea className="input" rows={2} value={form.heroText} onChange={(e) => handleChange("heroText", e.target.value)} />
        </Field>
        <Field label="Main description">
          <textarea className="input" rows={3} value={form.description} onChange={(e) => handleChange("description", e.target.value)} />
        </Field>
        <Field label="Cover image">
          <input type="file" accept="image/*" onChange={handleCover} disabled={uploading} />
          {form.coverImage && <img src={form.coverImage} className="w-32 mt-2 rounded" />}
        </Field>
        <Field label="Love and happiness card">
          <div className="grid grid-cols-3 gap-2">
            {WEDDING_ILLUSTRATIONS.map((illustration) => {
              const selected = (form.illustration ?? "hearts") === illustration.id;
              return (
                <button
                  type="button"
                  key={illustration.id}
                  onClick={() => handleChange("illustration", illustration.id)}
                  className={`border rounded-md p-3 text-center transition ${selected ? "border-gold bg-champagne/30" : "border-champagne/60"}`}
                  aria-label={illustration.label}
                >
                  <span className="block text-3xl mb-1">{illustration.emoji}</span>
                  <span className="text-[10px] uppercase tracking-wide">{illustration.label}</span>
                </button>
              );
            })}
          </div>
        </Field>
        <Field label="Published">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => handleChange("published", e.target.checked)} />
            Make this invitation publicly visible
          </label>
        </Field>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-gold text-white px-6 py-2.5 rounded-md text-sm uppercase tracking-widest disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>

        {savedUrl && (
          <div className="border border-champagne/60 rounded-md bg-white p-4">
            <p className="text-xs uppercase tracking-widest opacity-60 mb-2">Your invitation link</p>
            <a href={savedUrl} target="_blank" rel="noreferrer" className="block text-sm text-gold underline break-all mb-3">
              {savedUrl}
            </a>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(savedUrl)}
              className="text-xs uppercase tracking-widest opacity-70 hover:opacity-100"
            >
              Copy link
            </button>
            {!form.published && <p className="text-xs text-orange-700 mt-3">Enable Published above and save again to make this link public.</p>}
          </div>
        )}
      </div>

      <style>{`.input { width: 100%; border: 1px solid #E9DCC3; border-radius: 6px; padding: 10px 12px; font-size: 14px; outline: none; } .input:focus { border-color: #C9A66B; }`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest opacity-60 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
