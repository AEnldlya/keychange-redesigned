import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { createAirtableRecord, AIRTABLE_TABLES } from '@/lib/airtableSubmit'
import {
  airtableFieldNames,
  conditionSelectLabel,
  donationTypeSelectLabel,
} from '@/lib/airtableFieldNames'
import { nextJsonFromAirtableResponse } from '@/lib/airtableHttpError'

export async function POST(req) {
  try {
    const {
      donation_type,
      first_name,
      last_name,
      email,
      phone,
      date,
      ok_to_contact,
      newsletter,
      drive_organization,
      drive_date,
      drive_offer,
      instrument_type,
      condition,
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
    const donationTypeLabel = donationTypeSelectLabel(donation_type)
    const conditionLabel = conditionSelectLabel(condition)

    const fields = {
      'Donation Type': donationTypeLabel,
      'First Name': first_name,
      'Last Name': last_name,
      Email: email,
      Phone: phone || '',
      Date: date || '',
      'OK to Contact': Boolean(ok_to_contact),
      Newsletter: Boolean(newsletter),
      'Drive Organization': drive_organization || '',
      'Drive Date': drive_date || '',
      'Drive Offer': drive_offer || '',
      'Instrument Type': instrument_type || '',
      Condition: conditionLabel,
      [submittedAt]: new Date().toISOString(),
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
