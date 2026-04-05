import { NextResponse } from 'next/server'
import { createAirtableRecord } from '@/lib/airtableSubmit'
import { airtableFieldNames } from '@/lib/airtableFieldNames'

const HELP_LABELS = {
  collection: 'Instrument collection or donation outreach',
  social_media: 'Social media or marketing',
  outreach: 'School/organization outreach',
  events: 'Event support',
  cleaning: 'Instrument cleaning or quality checks',
  delivery: 'Pickup or delivery',
  general: 'General volunteer help',
}

const CONTACT_METHOD_LABELS = {
  email: 'Email',
  phone: 'Phone',
  text: 'Text',
}

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

    const volunteerDetails = [
      age_grade_school && `Age/Grade/School: ${age_grade_school}`,
      city && state && `Location: ${city}, ${state}`,
      contact_method &&
        `Best Contact: ${CONTACT_METHOD_LABELS[contact_method] || contact_method}`,
      help_types?.length &&
        `Interested In: ${help_types.map((v) => HELP_LABELS[v] || v).join(', ')}`,
      availability && `Availability: ${availability}`,
      why_volunteer && `Why Volunteer: ${why_volunteer}`,
      anything_else && `Other Info: ${anything_else}`,
    ]
      .filter(Boolean)
      .join('\n\n')

    const { submittedAt, message: messageField } = airtableFieldNames()

    const res = await createAirtableRecord({
      'First Name': first_name,
      'Last Name': last_name,
      Email: email,
      Newsletter: Boolean(newsletter),
      Phone: phone || '',
      City: city || '',
      State: state || '',
      [messageField]: volunteerDetails || '',
      [submittedAt]: new Date().toISOString(),
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
    console.error('Volunteer route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
