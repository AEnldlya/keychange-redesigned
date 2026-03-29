import { NextResponse } from 'next/server'
import { Resend } from 'resend'

async function fetchRecentRecords(tableName, since) {
  const formula = encodeURIComponent(`IS_AFTER({Submitted At}, '${since}')`)
  const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}?filterByFormula=${formula}`

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}` },
  })

  if (!res.ok) throw new Error(`Airtable fetch failed for ${tableName}: ${await res.text()}`)
  const data = await res.json()
  return data.records || []
}

function formatRecord(fields, type) {
  const name = `${fields['First Name'] || ''} ${fields['Last Name'] || ''}`.trim()
  const email = fields['Email'] || ''
  if (type === 'contact') {
    return `• ${name} &lt;${email}&gt; — "${(fields['Message'] || '').slice(0, 80)}…"`
  }
  if (type === 'donation') {
    return `• ${name} &lt;${email}&gt; — ${fields['Donation Description'] || ''} (${fields['Condition'] || ''})`
  }
  if (type === 'volunteer') {
    return `• ${name} &lt;${email}&gt; — ${fields['City'] || ''}, ${fields['State'] || ''}`
  }
  return `• ${name} &lt;${email}&gt;`
}

export async function GET(req) {
  // Authenticate cron calls
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const [contacts, donations, volunteers] = await Promise.all([
      fetchRecentRecords('Contacts', since),
      fetchRecentRecords('Donations', since),
      fetchRecentRecords('Volunteers', since),
    ])

    const total = contacts.length + donations.length + volunteers.length
    if (total === 0) {
      return NextResponse.json({ ok: true, message: 'No new submissions — no email sent.' })
    }

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    const subject = `Key Change: ${total} new submission${total !== 1 ? 's' : ''} — ${today}`

    const sections = []
    if (contacts.length) {
      sections.push(`<h3>Contacts (${contacts.length})</h3><p>${contacts.map(r => formatRecord(r.fields, 'contact')).join('<br>')}</p>`)
    }
    if (donations.length) {
      sections.push(`<h3>Donations (${donations.length})</h3><p>${donations.map(r => formatRecord(r.fields, 'donation')).join('<br>')}</p>`)
    }
    if (volunteers.length) {
      sections.push(`<h3>Volunteers (${volunteers.length})</h3><p>${volunteers.map(r => formatRecord(r.fields, 'volunteer')).join('<br>')}</p>`)
    }

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#0d1a3a">Key Change — Daily Digest</h2>
        <p style="color:#555">${today} · ${total} new submission${total !== 1 ? 's' : ''} in the last 24 hours</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0">
        ${sections.join('<hr style="border:none;border-top:1px solid #eee;margin:16px 0">')}
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0">
        <p style="color:#aaa;font-size:12px">View all submissions in <a href="https://airtable.com">Airtable</a>.</p>
      </div>
    `

    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Key Change <digest@keychange.org>',
      to: process.env.DIGEST_EMAIL_TO,
      subject,
      html,
    })

    return NextResponse.json({ ok: true, sent: total })
  } catch (err) {
    console.error('Daily digest error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
