// Twilio API configuration for Nooraya
// For production deployment on Vercel, set these as environment variables:
// VITE_TWILIO_ACCOUNT_SID, VITE_TWILIO_AUTH_TOKEN, VITE_TWILIO_PHONE_NUMBER
//
// For the MVP prototype, SMS and calls are simulated locally.
// When deploying to Vercel, create serverless API routes in /api/ folder.

export interface TwilioConfig {
  accountSid: string
  authToken: string
  phoneNumber: string
}

export function getTwilioConfig(): TwilioConfig | null {
  const sid = import.meta.env.VITE_TWILIO_ACCOUNT_SID
  const token = import.meta.env.VITE_TWILIO_AUTH_TOKEN
  const phone = import.meta.env.VITE_TWILIO_PHONE_NUMBER
  if (sid && token && phone) {
    return { accountSid: sid, authToken: token, phoneNumber: phone }
  }
  return null
}

export function isTwilioConfigured(): boolean {
  return getTwilioConfig() !== null
}

// Send SMS via Vercel serverless function
export async function sendSMS(to: string, body: string): Promise<{ success: boolean; simulated: boolean; message: string }> {
  if (!isTwilioConfigured()) {
    console.log(`[PROTOTYPE SMS] To: ${to} | Body: ${body}`)
    return { success: true, simulated: true, message: 'Prototype notification generated (SMS not configured)' }
  }

  try {
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, body }),
    })
    const data = await response.json()
    return { success: data.success, simulated: false, message: data.message || 'SMS sent successfully' }
  } catch (err) {
    console.error('SMS send error:', err)
    return { success: false, simulated: false, message: 'Failed to send SMS' }
  }
}

// Make a call via Vercel serverless function
export async function makeCall(to: string, message: string): Promise<{ success: boolean; simulated: boolean; message: string }> {
  if (!isTwilioConfigured()) {
    console.log(`[PROTOTYPE CALL] To: ${to} | Message: ${message}`)
    return { success: true, simulated: true, message: 'Prototype call generated (Twilio not configured)' }
  }

  try {
    const response = await fetch('/api/make-call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, message }),
    })
    const data = await response.json()
    return { success: data.success, simulated: false, message: data.message || 'Call initiated' }
  } catch (err) {
    console.error('Call error:', err)
    return { success: false, simulated: false, message: 'Failed to make call' }
  }
}

// Notify all trusted contacts about an emergency
export async function notifyAllContacts(
  contacts: Array<{ phone: string; name: string }>,
  userName: string,
  alertType: 'sos' | 'checkin_missed' | 'route_overdue' | 'quick_alert',
  locationUrl: string | null,
  customMessage?: string
): Promise<void> {
  const messages: Record<string, string> = {
    sos: `🚨 NOORAYA SOS ALERT: ${userName} has activated an emergency SOS.`,
    checkin_missed: `⚠️ NOORAYA ALERT: ${userName} has missed a scheduled safety check-in.`,
    route_overdue: `⚠️ NOORAYA ALERT: ${userName} has not reached their destination within the expected time.`,
    quick_alert: `📍 NOORAYA: ${userName} sent a quick alert: "${customMessage || ''}"`,
  }

  let body = messages[alertType]
  if (locationUrl) {
    body += ` Location: ${locationUrl}`
  }
  body += ' — Nooraya: Safe in Silence'

  for (const contact of contacts) {
    await sendSMS(contact.phone, body)
  }

  // For SOS, also attempt a call
  if (alertType === 'sos') {
    for (const contact of contacts) {
      await makeCall(
        contact.phone,
        `This is an automated Nooraya safety alert. ${userName} has activated an emergency SOS. Please check on them immediately.`
      )
    }
  }
}
