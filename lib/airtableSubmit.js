/**
 * Writes one row to the Key Change Submissions table.
 * Prefers direct Airtable API when AIRTABLE_PAT or AIRTABLE_API_KEY is set;
 * otherwise uses Maton gateway if MATON_API_KEY is set.
 */

const DEFAULT_BASE_ID = 'appS0Nfve0Di8jeKp'
const DEFAULT_TABLE_ID = 'tblcpqpSso2IeAr6p'

/** Per-form table IDs — override with env vars if your base differs. */
export const AIRTABLE_TABLES = {
  donations: process.env.AIRTABLE_TABLE_DONATIONS || 'tbleWXaRcWHQw5Lq9',
  volunteers: process.env.AIRTABLE_TABLE_VOLUNTEERS || 'tblMY0bHOcMuNjpxW',
  contacts: process.env.AIRTABLE_TABLE_CONTACTS || 'tblcpqpSso2IeAr6p',
}

/** Drop empty strings / empty arrays so Airtable does not reject single-select blanks. */
export function cleanAirtableFields(fields) {
  const submittedKey =
    process.env.AIRTABLE_FIELD_SUBMITTED_AT || 'Submitted At'
  const copy = { ...fields }

  if (
    process.env.AIRTABLE_OMIT_SUBMITTED_AT === 'true' ||
    process.env.AIRTABLE_OMIT_SUBMITTED_AT === '1'
  ) {
    delete copy[submittedKey]
  }

  const out = {}
  for (const [key, value] of Object.entries(copy)) {
    if (value === undefined || value === null) continue
    if (value === '') continue
    if (Array.isArray(value) && value.length === 0) continue
    out[key] = value
  }
  return out
}

export async function createAirtableRecord(fields, table) {
  const baseId = process.env.AIRTABLE_BASE_ID || DEFAULT_BASE_ID
  const tableId = table || process.env.AIRTABLE_TABLE_ID || DEFAULT_TABLE_ID
  const pat = process.env.AIRTABLE_PAT || process.env.AIRTABLE_API_KEY
  const matonKey = process.env.MATON_API_KEY

  if (!pat && !matonKey) {
    return new Response(
      JSON.stringify({
        error: {
          message:
            'Missing AIRTABLE_PAT or MATON_API_KEY. Add one in Vercel → Environment Variables.',
        },
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const cleaned = cleanAirtableFields(fields)

  if (pat) {
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableId)}`
    console.log('[Airtable] POST', url, JSON.stringify(cleaned))
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${pat}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [{ fields: cleaned }],
        typecast: true,
      }),
    })
    if (!res.ok) {
      const text = await res.text()
      console.error('[Airtable] Error', res.status, text)
      return new Response(text, { status: res.status, headers: { 'Content-Type': 'application/json' } })
    }
    return res
  }

  const matonUrl = `https://gateway.maton.ai/airtable/v0/${baseId}/${tableId}`
  const matonConnection =
    process.env.MATON_CONNECTION_ID || 'e2e40838-4a68-4916-94e4-38b4e82f513a'

  return fetch(matonUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${matonKey}`,
      'Content-Type': 'application/json',
      'Maton-Connection': matonConnection,
    },
    body: JSON.stringify({ fields: cleaned }),
  })
}
