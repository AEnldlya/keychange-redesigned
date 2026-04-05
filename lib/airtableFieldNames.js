/**
 * Airtable field names must match your base exactly (case-sensitive).
 * Override in .env.local / Vercel if your column names differ.
 */
export function airtableFieldNames() {
  return {
    submittedAt: process.env.AIRTABLE_FIELD_SUBMITTED_AT || 'Submitted At',
    message: process.env.AIRTABLE_FIELD_MESSAGE || 'Message',
  }
}

/** Map form values to single-select labels — add the same options in Airtable. */
export function conditionSelectLabel(value) {
  const map = {
    excellent: 'Excellent - Like new',
    good: 'Good - Minor wear, fully playable',
    fair: 'Fair - Needs some repair',
    poor: 'Poor - Significant repair needed',
    unknown: 'Unknown - Not sure',
  }
  return value ? map[value] || value : ''
}

export function canDropOffSelectLabel(value) {
  const map = {
    yes: 'Yes, I can drop off',
    no: 'No, I need pickup',
    maybe: 'Not sure yet',
  }
  return value ? map[value] || value : ''
}
