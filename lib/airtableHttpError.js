import { NextResponse } from 'next/server'

/**
 * Turn an Airtable / Maton fetch Response into a JSON NextResponse for the browser.
 */
export async function nextJsonFromAirtableResponse(upstreamRes) {
  const raw = await upstreamRes.text()
  const status = upstreamRes.status

  if (status === 503) {
    let msg =
      'This form is not configured yet. Please email keychange.team@gmail.com.'
    try {
      const j = JSON.parse(raw)
      if (j?.error?.message) msg = j.error.message
    } catch {
      /* use default */
    }
    return NextResponse.json({ error: msg }, { status: 503 })
  }

  let message = 'Something went wrong. Please try again.'
  try {
    const j = JSON.parse(raw)
    if (j?.error?.message) message = j.error.message
  } catch {
    if (status === 404) {
      message =
        'Table not found — check that the Airtable table names match. Redeploy the site on Vercel with API routes enabled, or email keychange.team@gmail.com.'
    }
  }

  if (status === 422) {
    message = `Airtable rejected the data: ${message}`
  }

  console.error('[Airtable/Maton]', status, raw.slice(0, 800))
  return NextResponse.json({ error: message }, { status: 502 })
}
