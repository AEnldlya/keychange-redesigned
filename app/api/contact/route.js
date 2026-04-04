import { NextResponse } from 'next/server'

// Submit to Key Change Submissions table via Maton gateway
const AIRTABLE_BASE_ID = 'appS0Nfve0Di8jeKp'
const AIRTABLE_TABLE_ID = 'tblcpqpSso2IeAr6p'
const MATON_GATEWAY_URL = `https://gateway.maton.ai/airtable/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`

export async function POST(req) {
  try {
    const { first_name, last_name, email, newsletter, message, source } = await req.json()

    const res = await fetch(MATON_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MATON_API_KEY}`,
        'Content-Type': 'application/json',
        'Maton-Connection': 'e2e40838-4a68-4916-94e4-38b4e82f513a',
      },
      body: JSON.stringify({
        fields: {
          'First Name': first_name,
          'Last Name': last_name,
          'Email': email,
          'Newsletter': Boolean(newsletter),
          'Message': message || '',
          'Source': source || 'Contact Page',
          'Submitted At': new Date().toISOString(),
        },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Airtable error:', err)
      return NextResponse.json({ error: 'Airtable error' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
