/**
 * Writes one row to the Key Change Submissions table.
 * Prefers direct Airtable API when AIRTABLE_PAT or AIRTABLE_API_KEY is set;
 * otherwise uses Maton gateway if MATON_API_KEY is set.
 */

const DEFAULT_BASE_ID = 'appS0Nfve0Di8jeKp'
const DEFAULT_TABLE_ID = 'tblcpqpSso2IeAr6p'

export async function createAirtableRecord(fields) {
  const baseId = process.env.AIRTABLE_BASE_ID || DEFAULT_BASE_ID
  const tableId = process.env.AIRTABLE_TABLE_ID || DEFAULT_TABLE_ID
  const pat = process.env.AIRTABLE_PAT || process.env.AIRTABLE_API_KEY
  const matonKey = process.env.MATON_API_KEY

  if (!pat && !matonKey) {
    return {
      ok: false,
      status: 503,
      text: async () =>
        'Missing Airtable or Maton credentials (set AIRTABLE_PAT or MATON_API_KEY)',
    }
  }

  if (pat) {
    return fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableId)}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pat}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ records: [{ fields }] }),
      }
    )
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
    body: JSON.stringify({ fields }),
  })
}
