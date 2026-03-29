/**
 * Adds a newsletter subscriber to the Contacts table.
 * Call this from any route where newsletter=true.
 */
export async function addNewsletterContact({ first_name, last_name, email, source }) {
  await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Contacts`, {
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
        'Newsletter': true,
        'Source': source,
        'Submitted At': new Date().toISOString(),
      },
    }),
  })
  // Intentionally fire-and-forget — don't fail the main submission if this errors
}
