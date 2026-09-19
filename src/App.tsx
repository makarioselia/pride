import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";

import HomeRedirect from "./pages/public/HomeRedirect";
import WeddingPage from "./pages/public/WeddingPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminTheme from "./pages/admin/AdminTheme";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/public/NotFound";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" toastOptions={{ style: { fontSize: "14px" } }} />
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/wedding/:slug" element={<WeddingPage />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="theme" element={<AdminTheme />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
