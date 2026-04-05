import { NextResponse } from 'next/server'
import { createAirtableRecord, AIRTABLE_TABLES } from '@/lib/airtableSubmit'
import {
  airtableFieldNames,
  volunteerContactMethodLabel,
  volunteerHelpInterestsForAirtable,
} from '@/lib/airtableFieldNames'
import { nextJsonFromAirtableResponse } from '@/lib/airtableHttpError'

export async function POST(req) {
  try {
    const {
      first_name,
      last_name,
      email,
      newsletter,
      phone,
      age_grade_school,
      state,
      city,
      contact_method,
      help_types,
      availability,
      why_volunteer,
      anything_else,
    } = await req.json()

    const { submittedAt } = airtableFieldNames()
    const bestContact = volunteerContactMethodLabel(contact_method)
    const helpInterests = volunteerHelpInterestsForAirtable(help_types)

    const fields = {
      'First Name': first_name,
      'Last Name': last_name,
      Email: email,
      Newsletter: Boolean(newsletter),
      Phone: phone || '',
      'Age/Grade/School': age_grade_school || '',
      State: state || '',
      City: city || '',
      Availability: availability || '',
      'Why Volunteer': why_volunteer || '',
      'Anything Else': anything_else || '',
      [submittedAt]: new Date().toISOString(),
    }

    if (bestContact) {
      fields['Best Contact Method'] = bestContact
    }

    if (helpInterests.length > 0) {
      fields['Help Interests'] = helpInterests
    }

    const res = await createAirtableRecord(fields, AIRTABLE_TABLES.volunteers)

    if (!res.ok) return nextJsonFromAirtableResponse(res)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Volunteer route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
