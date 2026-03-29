# Key Change Site — Project Guide

## What This Is

A password-protected marketing/info site for **The Key Change Project**, a student-led nonprofit music access initiative. Collects instrument donations and funds, redistributes them to students and programs lacking resources.

Password to unlock: `0nestepatatime` (hardcoded in [components/PasswordGate.jsx](components/PasswordGate.jsx))

## Tech Stack

- **Next.js 14** App Router
- **React 18**
- **@vercel/blob** — image uploads (store must be set to **public** access)
- **Resend** — transactional email
- **Airtable** — form submission storage (Donations, Volunteers, Contacts tables)

## Dev Commands

```bash
npm run dev       # local dev server
npm run build     # production build
npm start         # start production server
```

## Project Structure

```
app/
  page.jsx                  # Home
  about/page.jsx
  donate/page.jsx           # Instrument donation form
  get-involved/page.jsx     # Volunteer form
  contact/page.jsx
  layout.jsx
  api/
    donate/route.js         # Blob upload + Airtable write
    contact/route.js
    volunteer/route.js
    daily-digest/route.js
components/
  Nav.jsx
  Footer.jsx
  PasswordGate.jsx
  AutocompleteInput.jsx
  ScrollToTop.jsx
```

## Environment Variables

| Variable | Purpose |
|---|---|
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob store token (store must have public access) |
| `AIRTABLE_BASE_ID` | Airtable base ID |
| `AIRTABLE_API_KEY` | Airtable personal access token |
| `RESEND_API_KEY` | Resend email API key |

## Key Notes

- **Vercel Blob store must be public** — the donate route uploads instrument photos with `access: 'public'` so Airtable can fetch the URL as an attachment
- `PasswordGate` locks the entire site; unlock state persisted in `localStorage` (`kc_unlocked`)
- `AutocompleteInput` is used for city/state fields with local suggestions (Hanover, Norwich / NH, VT)
- Donate form sends image as base64 from the client; the API route converts it to a Buffer before uploading to Blob
