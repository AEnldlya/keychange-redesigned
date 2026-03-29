import { NextResponse } from 'next/server'
import { addNewsletterContact } from '../../../lib/airtable'

const BASE_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Volunteers`

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
          'Phone': phone || '',
          'Age / Grade / School': age_grade_school,
          'State': state,
          'City': city,
          'Best Contact Method': CONTACT_METHOD_LABELS[contact_method] || contact_method,
          'Help Interests': (help_types || []).map(v => HELP_LABELS[v] || v),
          'Availability': availability,
          'Why Volunteer': why_volunteer,
          'Anything Else': anything_else || '',
          'Submitted At': new Date().toISOString(),
        },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Airtable error:', err)
      return NextResponse.json({ error: 'Airtable error' }, { status: 500 })
    }

    if (newsletter) {
      addNewsletterContact({ first_name, last_name, email, source: 'Volunteer Form' })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Volunteer route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
