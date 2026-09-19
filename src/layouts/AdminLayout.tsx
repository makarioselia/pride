import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const links = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/events", label: "Events" },
  { to: "/admin/messages", label: "Messages" },
  { to: "/admin/gallery", label: "Gallery" },
  { to: "/admin/theme", label: "Theme" },
  { to: "/admin/settings", label: "Settings" },
];

export default function AdminLayout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAF8] text-charcoal">
      <aside className="w-56 shrink-0 border-r border-champagne/60 bg-white flex flex-col">
        <div className="px-5 py-6 border-b border-champagne/60">
          <p className="font-heading text-lg">Wedding Admin</p>
          <p className="text-xs opacity-50 mt-1 truncate">{user?.email}</p>
        </div>
        <nav className="flex-1 py-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `block px-5 py-2.5 text-sm transition ${
                  isActive ? "bg-champagne/40 text-gold font-medium" : "hover:bg-champagne/20 opacity-80"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleSignOut}
          className="m-4 text-xs uppercase tracking-widest text-left px-2 py-2 opacity-60 hover:opacity-100"
        >
          Sign out
        </button>
      </aside>
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
