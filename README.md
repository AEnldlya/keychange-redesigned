# Key Change Project — Website

Website for **The Key Change Project**, a student-led nonprofit that collects unused musical instruments and redistributes them to students and programs that lack resources.

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) — instrument photo storage
- [Airtable](https://airtable.com/) — form submission storage
- [Resend](https://resend.com/) — transactional email

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
BLOB_READ_WRITE_TOKEN=     # Vercel Blob token (store must have public access enabled)
AIRTABLE_BASE_ID=          # Airtable base ID (found in API docs)
AIRTABLE_API_KEY=          # Airtable personal access token
RESEND_API_KEY=            # Resend API key
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The site is password-protected — the password is set in `components/PasswordGate.jsx`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Build for production |
| `npm start` | Start production server |

## Project Structure

```
app/
  page.jsx                   # Home
  about/page.jsx             # About the project
  donate/page.jsx            # Instrument donation form
  get-involved/page.jsx      # Volunteer sign-up form
  contact/page.jsx           # Contact form
  layout.jsx                 # Root layout (Nav, Footer, PasswordGate)
  api/
    donate/route.js          # Uploads photo to Blob, writes to Airtable
    contact/route.js         # Writes to Airtable, sends email via Resend
    volunteer/route.js       # Writes to Airtable
    daily-digest/route.js    # Sends daily summary email

components/
  Nav.jsx
  Footer.jsx
  PasswordGate.jsx           # Site-wide password lock (persisted in localStorage)
  AutocompleteInput.jsx      # Text input with local suggestion dropdown
  ScrollToTop.jsx
```

## Deployment

Deployed on [Vercel](https://vercel.com/). Add the environment variables above in the Vercel project settings under **Settings → Environment Variables**.

> **Note:** The Vercel Blob store must have **public access** enabled. The donate form uploads instrument photos and passes the public URL to Airtable as an image attachment.
