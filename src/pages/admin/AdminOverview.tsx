import { Link } from "react-router-dom";
import { useOwnedWedding } from "../../hooks/useOwnedWedding";
import { LoadingScreen } from "../../components/ui/States";

export default function AdminOverview() {
  const { wedding } = useOwnedWedding();

  if (wedding === undefined) return <LoadingScreen />;
  if (!wedding) return null;

  const publicUrl = `${window.location.origin}/wedding/${wedding.slug}`;

  return (
    <div>
      <h1 className="font-heading text-2xl mb-1">
        {wedding.brideName} &amp; {wedding.groomName}
      </h1>
      <p className="text-sm opacity-60 mb-8">
        {wedding.published ? "Your invitation is live." : "Your invitation is not published yet."}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/admin/events" className="bg-white border border-champagne/60 rounded-lg p-5 hover:border-gold transition">
          <p className="text-sm font-medium">Events</p>
          <p className="text-xs opacity-60 mt-1">Manage your timeline</p>
        </Link>
        <Link to="/admin/gallery" className="bg-white border border-champagne/60 rounded-lg p-5 hover:border-gold transition">
          <p className="text-sm font-medium">Gallery</p>
          <p className="text-xs opacity-60 mt-1">Upload and organize photos</p>
        </Link>
        <Link to="/admin/messages" className="bg-white border border-champagne/60 rounded-lg p-5 hover:border-gold transition">
          <p className="text-sm font-medium">Messages</p>
          <p className="text-xs opacity-60 mt-1">Review guest messages</p>
        </Link>
      </div>

      <div className="bg-white border border-champagne/60 rounded-lg p-5">
        <p className="text-sm font-medium mb-2">Your public invitation link</p>
        <a href={publicUrl} target="_blank" rel="noreferrer" className="text-sm text-gold underline break-all">
          {publicUrl}
        </a>
        {!wedding.published && (
          <p className="text-xs opacity-60 mt-2">
            Publish your wedding from Settings to make this link live.
          </p>
        )}
      </div>
    </div>
  );
}
