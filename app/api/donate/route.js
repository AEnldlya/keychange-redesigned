import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { createAirtableRecord } from '@/lib/airtableSubmit'

export async function POST(req) {
  try {
    const {
      first_name,
      last_name,
      organization,
      email,
      newsletter,
      phone,
      city,
      state,
      donation_description,
      condition,
      can_dropoff,
      alt_location,
      dropoff_time,
      other_info,
      image_base64,
      image_filename,
    } = await req.json()

    let instrumentPhotoUrl = null
    if (image_base64 && image_filename) {
      const buffer = Buffer.from(image_base64, 'base64')
      const blob = await put(`donations/${Date.now()}-${image_filename}`, buffer, {
        access: 'public',
        contentType: image_filename.match(/\.png$/i) ? 'image/png' : 'image/jpeg',
      })
      instrumentPhotoUrl = blob.url
    }

    const donationDetails = [
      donation_description && `Donation: ${donation_description}`,
      condition && `Condition: ${condition}`,
      can_dropoff && `Can Drop Off: ${can_dropoff}`,
      alt_location && `Alt Location: ${alt_location}`,
      dropoff_time && `Preferred Time: ${dropoff_time}`,
      other_info && `Additional Info: ${other_info}`,
      instrumentPhotoUrl && `Photo: ${instrumentPhotoUrl}`,
    ]
      .filter(Boolean)
      .join('\n\n')

    const res = await createAirtableRecord({
      'First Name': first_name,
      'Last Name': last_name,
      Email: email,
      Newsletter: Boolean(newsletter),
      Phone: phone || '',
      City: city || '',
      State: state || '',
      Organization: organization || '',
      Message: donationDetails || '',
      Source: 'Donate Form',
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
    console.error('Donate route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
