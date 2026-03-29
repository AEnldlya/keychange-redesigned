import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { addNewsletterContact } from '../../../lib/airtable'

const BASE_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Donations`

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

    const fields = {
      'First Name': first_name,
      'Last Name': last_name,
      'Organization': organization || '',
      'Email': email,
      'Newsletter': Boolean(newsletter),
      'Phone': phone,
      'City': city,
      'State': state,
      'Donation Description': donation_description,
      'Condition': condition,
      'Can Drop Off': can_dropoff,
      'Alt Location': alt_location || '',
      'Drop-off Time': dropoff_time,
      'Other Info': other_info || '',
      'Submitted At': new Date().toISOString(),
    }

    if (instrumentPhotoUrl) {
      fields['Instrument Photo'] = [{ url: instrumentPhotoUrl }]
    }

    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Airtable error:', err)
      return NextResponse.json({ error: 'Airtable error' }, { status: 500 })
    }

    if (newsletter) {
      addNewsletterContact({ first_name, last_name, email, source: 'Donate Form' })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Donate route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
