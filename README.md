# Dr. Ishita Katyal

Personal website and content manager for Dr. Ishita Katyal, Plastic, Reconstructive & Aesthetic Surgeon.

A single-page public site backed by a full CMS, so every piece of content — biography, timelines, expertise, awards, publications, gallery, contact details and SEO — is edited in the browser rather than in code.

```
.
├── client/    React 18 · Vite · Tailwind · Framer Motion
└── server/    Node · Express · MongoDB (Mongoose) · JWT · Cloudinary
```

---

## Getting started

### 1. Requirements

- Node 18 or newer
- MongoDB — a local `mongod`, or a free MongoDB Atlas cluster
- A Cloudinary account (only needed for image uploads; everything else works without it)

### 2. Install

```bash
npm run install:all
```

### 3. Configure the server

```bash
cp server/.env.example server/.env
```

Then fill in `server/.env`:

| Variable | What it does |
| --- | --- |
| `MONGO_URI` | Connection string, e.g. `mongodb://127.0.0.1:27017/ishita-katyal` |
| `JWT_SECRET` | A long random string — generate with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | The first administrator account, created by the seed step. The password must be at least 10 characters. |
| `CLIENT_ORIGIN` | Comma-separated list of origins allowed to call the API. `http://localhost:5173` in development. |
| `CLOUDINARY_*` | Cloudinary cloud name, API key and API secret. The secret stays on the server and is never sent to the browser. |

### 4. Seed the content

```bash
npm run seed
```

This creates the administrator account and loads the verified CV content. It is safe to run more than once: existing collections are left alone, and the admin password is never overwritten. Pass `--fresh` to replace the seeded collections:

```bash
npm --prefix server run seed -- --fresh
```

### 5. Run it

Two terminals:

```bash
npm run dev:server   # http://localhost:5000
npm run dev:client   # http://localhost:5173
```

The Vite dev server proxies `/api` to port 5000, so the browser stays on one origin and the session cookie behaves the same as it will in production.

- Website: <http://localhost:5173>
- Content manager: <http://localhost:5173/admin/login>

### 6. Build for production

```bash
npm run build     # builds client/dist
npm start         # serves the API and the built site on one port
```

In production the Express server serves `client/dist` and falls back to `index.html` for client-side routes, so the whole thing runs on a single origin with a strict content security policy.

---

## Before going live

A short checklist of the things that carry placeholder values on purpose:

- [ ] **Contact details.** Admin → Contact. Nothing was supplied, so phone, email, WhatsApp, clinic and booking link are all empty. The public site hides each empty field rather than showing a fake one, and the contact section shows a short "details are being finalised" note until at least one is filled in.
- [ ] **Cosmetic Fellowship.** Admin → Experience. The entry exists with the track set to *Specialist training* and reads "Details to be updated". Add the institution, dates and title when you have them.
- [ ] **The 2024 publication.** Admin → Publications. The supplied source cut the title off mid-sentence, so it is stored exactly as far as it was legible. Complete the title, journal and DOI from the original record.
- [ ] **Domain.** Replace `REPLACE-WITH-YOUR-DOMAIN` in `client/public/robots.txt` and `client/public/sitemap.xml`, and set the canonical URL in Admin → Settings.
- [ ] **Change the seeded admin password** from Admin → Account.
- [ ] **Cloudinary keys**, if you want to upload images. Without them the site runs fine on the bundled portrait; the gallery and upload buttons explain that they are switched off.

---

## The content manager

Sign in at `/admin/login`.

| Screen | What it controls |
| --- | --- |
| Dashboard | Counts for every content type, plus a short list of what is still unfinished |
| Profile | Name, title, hero copy, biography, pull quote, qualifications, portraits |
| Education | The Education & training timeline |
| Experience | Both timelines — a per-entry switch decides whether a role appears under *Professional experience* or *Specialist training* |
| Expertise | Areas of practice. Featured areas appear in the numbered index; the rest are listed as documented areas of interest |
| Awards | Credits & awards |
| Publications | Published work |
| Workshops | Workshops & scientific engagement |
| Gallery | Cloudinary uploads, with replace, reorder, alt text and categories |
| Contact | Every contact detail on the site, in one place |
| Settings | SEO, share image, favicon, disclaimer, privacy policy, and which sections are published |
| Account | Name, email and password |

Every list supports create, edit, delete, drag-to-reorder and a per-entry visibility switch. Hiding an entry removes it from the website without deleting it. Saving anything is reflected on the public page immediately — it reads from the same database on load.

Sections that have no content stay hidden rather than rendering empty. Workshops and Gallery are additionally off by default in Settings, so nothing half-finished is ever published by accident.

---

## Content policy

Everything on the site comes from the supplied CV and professional profile. Nothing was invented to fill space — no patient testimonials, surgical volumes, success rates, affiliations, clinic addresses, phone numbers or social accounts. Where a fact was missing it was left blank and made editable, and where a source was truncated the text stops where the source stopped.

The expertise section is worded as areas of training and professional interest rather than as a menu of procedures on offer at a particular clinic. The medical disclaimer in the footer is editable from Settings.

---

## Architecture notes

**API.** `GET /api/site` returns the whole public payload in one request. Each content type additionally exposes a conventional set of routes:

```
GET    /api/{resource}          public, visible entries only
GET    /api/{resource}/all      admin
POST   /api/{resource}          admin
PATCH  /api/{resource}/reorder  admin
GET    /api/{resource}/:id      admin
PATCH  /api/{resource}/:id      admin
DELETE /api/{resource}/:id      admin
```

`{resource}` is one of `education`, `experience`, `expertise`, `awards`, `publications`, `workshops`, `gallery`. Profile, contact and settings are singletons with `GET` and `PUT`. All of this is generated by one CRUD factory, so the seven resources behave identically.

**Security.** Passwords are bcrypt-hashed at cost 12 and excluded from queries by default. JWTs carry a token version that is bumped on password change, which invalidates every existing session. Login is rate-limited to 8 attempts per 15 minutes and returns the same message for an unknown email as for a wrong password. Helmet sets a content security policy in production, CORS runs on an allowlist, request bodies are capped and sanitised, uploads are validated by MIME type and size, and the Cloudinary secret never leaves the server.

**Resilience.** If the database is unreachable the public site falls back to a bundled copy of the seeded content and still renders in full, so a database outage never shows a blank page. Queries fail in two seconds rather than buffering.

**Performance.** The admin bundle is code-split and only loads at `/admin`. React, Framer Motion and app code are separate chunks. Images go through Cloudinary's `f_auto,q_auto` pipeline with `srcset` across four widths; the hero portrait is preloaded and everything else is lazy-loaded. Animation is limited to `opacity`, `transform` and `clip-path` so it stays on the compositor.

**Accessibility.** One `h1` per page and a checked heading order, a skip link, visible focus rings, `aria-current` on the active navigation item, labelled icon buttons, Escape handling on every overlay, and colour pairings checked against WCAG AA. `prefers-reduced-motion` removes animation rather than shortening it.

---

## Checks

```bash
npm run test:api   # route wiring, auth guards, validation, CORS, error handling
npm run build      # production build of the client
```

The API check runs without a database on purpose — it verifies that every admin route rejects anonymous callers, that login validation works, that unknown routes 404 cleanly and that a disallowed origin is refused.
