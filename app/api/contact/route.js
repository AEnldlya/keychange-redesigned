import { NextResponse } from 'next/server'
import { createAirtableRecord } from '@/lib/airtableSubmit'
import { airtableFieldNames } from '@/lib/airtableFieldNames'

export async function POST(req) {
  try {
    const { first_name, last_name, email, newsletter, message } =
      await req.json()

    const { submittedAt, message: messageField } = airtableFieldNames()

    const fields = {
      'First Name': first_name,
      'Last Name': last_name,
      Email: email,
      Newsletter: Boolean(newsletter),
      [messageField]: message || '',
      [submittedAt]: new Date().toISOString(),
    }

    const res = await createAirtableRecord(fields)

    if (!res.ok) {
      const err = await res.text()
      console.error('Airtable error:', err)
      const status = res.status === 503 ? 503 : 500
      const messageErr =
        res.status === 503
          ? 'Server missing Airtable/Maton credentials'
          : 'Airtable error'
      return NextResponse.json({ error: messageErr }, { status })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
