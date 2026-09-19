import { Link } from "react-router-dom";

export default function HomeRedirect() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ivory text-charcoal px-6 text-center">
      <p className="font-heading text-2xl mb-3">Wedding Invitation Platform</p>
      <p className="text-sm opacity-60 mb-8 max-w-md">
        Visit your personal invitation link at <code>/wedding/your-slug</code>, or sign in to manage your wedding.
      </p>
      <Link
        to="/admin/login"
        className="bg-gold text-white px-6 py-2.5 rounded-md text-xs uppercase tracking-widest"
      >
        Admin sign in
      </Link>
    </div>
  );
}
