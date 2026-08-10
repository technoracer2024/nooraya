// Vercel Serverless Function: Send SMS via Twilio
// Deploy to Vercel and set env vars: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { to, body } = req.body

  if (!to || !body) {
    return res.status(400).json({ error: 'Missing required fields: to, body' })
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_PHONE_NUMBER

  if (!accountSid || !authToken || !from) {
    return res.status(500).json({ 
      success: false, 
      message: 'Twilio credentials not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in Vercel environment variables.' 
    })
  }

  try {
    const twilio = await import('twilio')
    const client = twilio.default(accountSid, authToken)
    
    const message = await client.messages.create({
      body,
      from,
      to,
    })

    return res.status(200).json({ 
      success: true, 
      message: `SMS sent successfully (SID: ${message.sid})` 
    })
  } catch (error) {
    console.error('Twilio SMS error:', error)
    return res.status(500).json({ 
      success: false, 
      message: `Failed to send SMS: ${error.message}` 
    })
  }
}
