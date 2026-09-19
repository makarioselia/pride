import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ivory text-charcoal px-6 text-center">
      <p className="font-heading text-3xl mb-3">404</p>
      <p className="text-sm opacity-60 mb-8">This page doesn't exist.</p>
      <Link to="/" className="text-xs uppercase tracking-widest underline text-gold">
        Go home
      </Link>
    </div>
  );
}
