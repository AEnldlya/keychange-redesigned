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

Create a `.env.local` file in the project root (see `.env.example`):

```env
AIRTABLE_PAT=              # Airtable personal access token (recommended; or use AIRTABLE_API_KEY)
AIRTABLE_BASE_ID=appS0Nfve0Di8jeKp
AIRTABLE_TABLE_ID=tblcpqpSso2IeAr6p
BLOB_READ_WRITE_TOKEN=    # Vercel Blob — donate form photos (public access on the store)
RESEND_API_KEY=            # Resend API key (if you send email from API routes)
```

Form submissions go to Airtable via `lib/airtableSubmit.js`. If `AIRTABLE_PAT` is unset, the app falls back to `MATON_API_KEY` + Maton gateway (legacy).

### Airtable table setup

Use **one table** with columns that match what the API sends (names are **case-sensitive**).

**Contact** sends: `First Name`, `Last Name`, `Email`, `Newsletter` (checkbox), `Message`, `Submitted At` (use a **Date** or **Date and time** field, or single line text — not a read-only “Created time” field unless you omit writes to it).

**Donate** adds: `Organization`, `Phone`, `City`, `State`, `Donation Description` (long text), `Condition` (single select), `Can Drop Off` (single select), `Alt Location`, `Drop-off Time`, `Other Info` (long text), `Instrument Photo` (attachments). Add these **exact** single-select options in Airtable:

- **Condition:** `Excellent - Like new`, `Good - Minor wear, fully playable`, `Fair - Needs some repair`, `Poor - Significant repair needed`, `Unknown - Not sure`
- **Can Drop Off:** `Yes, I can drop off`, `No, I need pickup`, `Not sure yet`

**Volunteer** sends the same core fields as contact plus `Phone`, `City`, `State`, and puts details in `Message`.

Do **not** include a `Source` column unless you add it yourself and extend the API — it was removed because it caused “unknown field” errors.

If your `Message` or `Submitted At` column is named differently, set `AIRTABLE_FIELD_MESSAGE` / `AIRTABLE_FIELD_SUBMITTED_AT` in Vercel.

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
