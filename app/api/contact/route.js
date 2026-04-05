import { NextResponse } from 'next/server'
import { createAirtableRecord } from '@/lib/airtableSubmit'

export async function POST(req) {
  try {
    const { first_name, last_name, email, newsletter, message, source } =
      await req.json()

    const res = await createAirtableRecord({
      'First Name': first_name,
      'Last Name': last_name,
      Email: email,
      Newsletter: Boolean(newsletter),
      Message: message || '',
      Source: source || 'Contact Page',
      'Submitted At': new Date().toISOString(),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Airtable error:', err)
      const status = res.status === 503 ? 503 : 500
      const message =
        res.status === 503
          ? 'Server missing Airtable/Maton credentials'
          : 'Airtable error'
      return NextResponse.json({ error: message }, { status })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
