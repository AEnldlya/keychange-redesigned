import { NextResponse } from 'next/server'

const BASE_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Contacts`

export async function POST(req) {
  try {
    const { first_name, last_name, email, newsletter, message, source } = await req.json()

    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          'First Name': first_name,
          'Last Name': last_name,
          'Email': email,
          'Newsletter': Boolean(newsletter),
          'Message': message,
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
