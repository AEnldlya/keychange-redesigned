import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

// Submit to Key Change Submissions table via Maton gateway
const AIRTABLE_BASE_ID = 'appS0Nfve0Di8jeKp'
const AIRTABLE_TABLE_ID = 'tblcpqpSso2IeAr6p'
const MATON_GATEWAY_URL = `https://gateway.maton.ai/airtable/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`

export async function POST(req) {
  try {
    const {
      first_name, last_name, organization, email, newsletter,
      phone, city, state, donation_description, condition,
      can_dropoff, alt_location, dropoff_time, other_info,
      image_base64, image_filename,
    } = await req.json()

    // Upload image to Vercel Blob if provided
    let instrumentPhotoUrl = null
    if (image_base64 && image_filename) {
      const buffer = Buffer.from(image_base64, 'base64')
      const blob = await put(`donations/${Date.now()}-${image_filename}`, buffer, {
        access: 'public',
        contentType: image_filename.match(/\.png$/i) ? 'image/png' : 'image/jpeg',
      })
      instrumentPhotoUrl = blob.url
    }

    // Build donation details as a formatted message
    const donationDetails = [
      donation_description && `Donation: ${donation_description}`,
      condition && `Condition: ${condition}`,
      can_dropoff && `Can Drop Off: ${can_dropoff}`,
      alt_location && `Alt Location: ${alt_location}`,
      dropoff_time && `Preferred Time: ${dropoff_time}`,
      other_info && `Additional Info: ${other_info}`,
      instrumentPhotoUrl && `Photo: ${instrumentPhotoUrl}`,
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
          'Organization': organization || '',
          'Message': donationDetails || '',
          'Source': 'Donate Form',
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
    console.error('Donate route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
