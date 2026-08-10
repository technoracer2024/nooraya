// Vercel Serverless Function: Make a call via Twilio with TTS
// Deploy to Vercel and set env vars: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { to, message } = req.body

  if (!to || !message) {
    return res.status(400).json({ error: 'Missing required fields: to, message' })
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_PHONE_NUMBER

  if (!accountSid || !authToken || !from) {
    return res.status(500).json({ 
      success: false, 
      message: 'Twilio credentials not configured.' 
    })
  }

  try {
    const twilio = await import('twilio')
    const client = twilio.default(accountSid, authToken)
    
    const call = await client.calls.create({
      twiml: `<Response><Say voice="alice" language="en-US">${message}</Say><Pause length="2"/><Say voice="alice" language="en-US">${message}</Say></Response>`,
      from,
      to,
    })

    return res.status(200).json({ 
      success: true, 
      message: `Call initiated (SID: ${call.sid})` 
    })
  } catch (error) {
    console.error('Twilio call error:', error)
    return res.status(500).json({ 
      success: false, 
      message: `Failed to make call: ${error.message}` 
    })
  }
}
