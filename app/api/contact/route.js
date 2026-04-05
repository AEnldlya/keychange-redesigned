import { NextResponse } from 'next/server'
import { createAirtableRecord } from '@/lib/airtableSubmit'
import { airtableFieldNames } from '@/lib/airtableFieldNames'
import { nextJsonFromAirtableResponse } from '@/lib/airtableHttpError'

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

    if (!res.ok) return nextJsonFromAirtableResponse(res)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
