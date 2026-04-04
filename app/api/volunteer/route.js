import { NextResponse } from 'next/server'

// Submit to Key Change Submissions table via Maton gateway
const AIRTABLE_BASE_ID = 'appS0Nfve0Di8jeKp'
const AIRTABLE_TABLE_ID = 'tblcpqpSso2IeAr6p'
const MATON_GATEWAY_URL = `https://gateway.maton.ai/airtable/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`

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
      first_name, last_name, email, newsletter, phone,
      age_grade_school, state, city, contact_method,
      help_types, availability, why_volunteer, anything_else,
    } = await req.json()

    // Build volunteer details as a formatted message
    const volunteerDetails = [
      age_grade_school && `Age/Grade/School: ${age_grade_school}`,
      city && state && `Location: ${city}, ${state}`,
      contact_method && `Best Contact: ${CONTACT_METHOD_LABELS[contact_method] || contact_method}`,
      help_types?.length && `Interested In: ${help_types.map(v => HELP_LABELS[v] || v).join(', ')}`,
      availability && `Availability: ${availability}`,
      why_volunteer && `Why Volunteer: ${why_volunteer}`,
      anything_else && `Other Info: ${anything_else}`,
    ].filter(Boolean).join('\n\n')

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
          'Phone': phone || '',
          'City': city || '',
          'State': state || '',
          'Message': volunteerDetails || '',
          'Source': 'Volunteer Form',
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
    console.error('Volunteer route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
