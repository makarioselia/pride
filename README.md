# Wedding Invitation Web App

A premium, romantic digital wedding invitation + guestbook, built with React,
TypeScript, Vite, Tailwind CSS, Framer Motion, Firebase (Auth + Firestore),
and Cloudinary (image hosting).

## Features

- **Public invitation page** (`/wedding/:slug`) — hero, live countdown,
  timeline of events, photo gallery with lightbox, guest message form,
  and a swipeable digital guestbook with a printable PDF export.
- **Admin dashboard** (`/admin`) — protected by Firebase Email/Password
  auth. Manage wedding settings, CRUD events, moderate guest messages
  (approve/reject/delete), manage the photo gallery (upload, caption,
  reorder, set cover), and a live theme editor with 5 style presets.
- Realtime updates via Firestore listeners (new guest messages, gallery
  changes, etc. reflect live).
- Firestore security rules that only allow public read of *published*
  weddings and *approved* messages, restrict all writes to the wedding
  owner (except guest message submission, which is locked to
  `status: pending`).
- Cloudinary unsigned upload — no API secret ever touches the frontend.

## 1. Setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` with your Firebase project's web config (from
Firebase Console → Project settings → General → Your apps) and your
Cloudinary cloud name + an **unsigned** upload preset (Cloudinary
Console → Settings → Upload → Upload presets → Add preset → Signing
mode: Unsigned).

## 2. Firebase setup

1. Create a Firebase project (or use the one matching the IDs already
   filled into `.env.example`).
2. Enable **Authentication → Email/Password**.
3. Enable **Firestore Database** (production mode).
4. Deploy the included security rules:

   ```bash
   firebase deploy --only firestore:rules
   ```

   (or paste the contents of `firestore.rules` into the Firestore Rules
   tab in the console).
5. Create your admin user in Firebase Console → Authentication → Users
   → Add user (email + password). This is the account you'll sign in
   with at `/admin/login`.

On first sign-in, the admin dashboard automatically creates a wedding
document for that user with sensible demo content — nothing is
hardcoded into the UI, everything is editable from **Settings**.

## 3. Cloudinary setup

1. Create a free Cloudinary account.
2. Settings → Upload → Add upload preset → set **Signing Mode** to
   **Unsigned** → copy the preset name into
   `VITE_CLOUDINARY_UPLOAD_PRESET`.
3. Copy your **Cloud name** into `VITE_CLOUDINARY_CLOUD_NAME`.

No API secret is needed or used anywhere in this app.

## 4. Run locally

```bash
npm run dev
```

- Public page: `http://localhost:5173/wedding/<your-slug>`
- Admin: `http://localhost:5173/admin/login`

## 5. Build

```bash
npm run build
npm run preview
```

## 6. Deploy

Any static host works (Vercel, Netlify, Firebase Hosting). Remember to
set the same environment variables in your hosting provider's
dashboard, and to configure SPA rewrites so all routes fall back to
`index.html`.

Firebase Hosting example (`firebase.json`):

```json
{
  "hosting": {
    "public": "dist",
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

## Project structure

```
src/
  components/
    public/     - Hero, Countdown, Timeline, Gallery, GuestMessageForm, Guestbook, GuestbookPdf
    admin/      - ProtectedRoute
    ui/         - shared loading/empty/error states, SEO
  pages/
    public/     - WeddingPage, HomeRedirect, NotFound
    admin/      - AdminLogin, AdminOverview, AdminEvents, AdminMessages, AdminGallery, AdminTheme, AdminSettings
  layouts/      - AdminLayout
  hooks/        - useCountdown, useApplyTheme, useOwnedWedding
  services/
    firebase/   - Firebase app/auth/firestore init
    cloudinary/ - unsigned upload + optimized URL helper
  firestore/    - typed Firestore data-access functions (weddings, events, messages, gallery)
  types/        - shared TypeScript types + theme presets
  contexts/     - AuthContext
```

## Notes

- This MVP supports one wedding per authenticated owner. The Firestore
  schema (`weddings/{weddingId}`) is already structured to support
  multiple weddings later.
- The theme editor writes directly to the wedding document's `theme`
  field; the public page applies it as CSS custom properties at
  runtime, so no rebuild is needed to reskin an invitation.
