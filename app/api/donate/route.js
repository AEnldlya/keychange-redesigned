import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { createAirtableRecord, AIRTABLE_TABLES } from '@/lib/airtableSubmit'
import {
  airtableFieldNames,
  conditionSelectLabel,
  canDropOffSelectLabel,
} from '@/lib/airtableFieldNames'
import { nextJsonFromAirtableResponse } from '@/lib/airtableHttpError'

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
      try {
        const buffer = Buffer.from(image_base64, 'base64')
        const blob = await put(
          `donations/${Date.now()}-${image_filename}`,
          buffer,
          {
            access: 'public',
            contentType: image_filename.match(/\.png$/i)
              ? 'image/png'
              : 'image/jpeg',
          }
        )
        instrumentPhotoUrl = blob.url
      } catch (blobErr) {
        console.error('Blob upload error:', blobErr)
        return NextResponse.json(
          {
            error:
              'Could not upload your photo. Add BLOB_READ_WRITE_TOKEN in Vercel, or submit without a photo.',
          },
          { status: 500 }
        )
      }
    }

    const { submittedAt } = airtableFieldNames()
    const conditionLabel = conditionSelectLabel(condition)
    const dropOffLabel = canDropOffSelectLabel(can_dropoff)

    const fields = {
      'First Name': first_name,
      'Last Name': last_name,
      Email: email,
      Newsletter: Boolean(newsletter),
      Phone: phone || '',
      Organization: organization || '',
      City: city || '',
      State: state || '',
      'Donation Description': donation_description || '',
      Condition: conditionLabel,
      'Alt Location': alt_location || '',
      'Drop-off Time': dropoff_time || '',
      'Other Info': other_info || '',
      [submittedAt]: new Date().toISOString(),
    }

    if (dropOffLabel) {
      fields['Can Drop Off'] = dropOffLabel
    }

    if (instrumentPhotoUrl) {
      fields['Instrument Photo'] = [{ url: instrumentPhotoUrl }]
    }

    const res = await createAirtableRecord(fields, AIRTABLE_TABLES.donations)

    if (!res.ok) return nextJsonFromAirtableResponse(res)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Donate route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
