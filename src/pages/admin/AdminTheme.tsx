import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useOwnedWedding } from "../../hooks/useOwnedWedding";
import { updateWedding } from "../../firestore/weddings";
import type { ThemePreset, WeddingTheme } from "../../types";
import { THEME_PRESETS } from "../../types";
import { LoadingScreen } from "../../components/ui/States";

const FONT_OPTIONS = ["Marcellus", "Cormorant Garamond", "Jost"];

export default function AdminTheme() {
  const { wedding, reload } = useOwnedWedding();
  const [theme, setTheme] = useState<WeddingTheme | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (wedding) setTheme(wedding.theme ?? THEME_PRESETS.classic);
  }, [wedding]);

  if (wedding === undefined || !theme) return <LoadingScreen />;
  if (!wedding) return null;

  const applyPreset = (preset: ThemePreset) => setTheme(THEME_PRESETS[preset]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateWedding(wedding.id, { theme });
      toast.success("Theme saved");
      reload();
    } catch {
      toast.error("Failed to save theme");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="font-heading text-2xl mb-8">Theme Editor</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-widest opacity-60 mb-2">Style preset</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(THEME_PRESETS).map((p) => (
                <button
                  key={p}
                  onClick={() => applyPreset(p as ThemePreset)}
                  className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-widest border ${
                    theme.preset === p ? "bg-gold text-white border-gold" : "border-champagne opacity-70"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <ColorField label="Primary color" value={theme.primaryColor} onChange={(v) => setTheme({ ...theme, primaryColor: v })} />
          <ColorField label="Secondary color" value={theme.secondaryColor} onChange={(v) => setTheme({ ...theme, secondaryColor: v })} />
          <ColorField label="Background" value={theme.backgroundColor} onChange={(v) => setTheme({ ...theme, backgroundColor: v })} />
          <ColorField label="Text color" value={theme.textColor} onChange={(v) => setTheme({ ...theme, textColor: v })} />
          <ColorField label="Accent" value={theme.accentColor} onChange={(v) => setTheme({ ...theme, accentColor: v })} />

          <div>
            <p className="text-xs uppercase tracking-widest opacity-60 mb-1.5">Heading font</p>
            <select className="input" value={theme.headingFont} onChange={(e) => setTheme({ ...theme, headingFont: e.target.value })}>
              {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest opacity-60 mb-1.5">Body font</p>
            <select className="input" value={theme.bodyFont} onChange={(e) => setTheme({ ...theme, bodyFont: e.target.value })}>
              {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gold text-white px-6 py-2.5 rounded-md text-sm uppercase tracking-widest disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save theme"}
          </button>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest opacity-60 mb-2">Live preview</p>
          <div
            className="rounded-lg border border-champagne/60 p-10 text-center"
            style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
          >
            <p className="uppercase tracking-[0.3em] text-xs mb-4" style={{ color: theme.primaryColor }}>
              Together with their families
            </p>
            <p style={{ fontFamily: theme.headingFont }} className="text-3xl mb-3">
              {wedding.brideName} <span style={{ color: theme.primaryColor }}>&amp;</span> {wedding.groomName}
            </p>
            <p style={{ fontFamily: theme.bodyFont }} className="text-sm opacity-80">
              {new Date(wedding.weddingDate).toDateString()}
            </p>
            <button
              className="mt-6 px-5 py-2 rounded-full text-xs uppercase tracking-widest text-white"
              style={{ backgroundColor: theme.primaryColor, fontFamily: theme.bodyFont }}
            >
              Sample button
            </button>
          </div>
        </div>
      </div>

      <style>{`.input { width: 100%; border: 1px solid #E9DCC3; border-radius: 6px; padding: 10px 12px; font-size: 14px; outline: none; }`}</style>
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest opacity-60 mb-1.5">{label}</p>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-10 h-10 rounded border border-champagne" />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="input" />
      </div>
    </div>
  );
}
