import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// This is a helper route for sending emails via SMTP (Gmail)

export async function POST(request: Request) {
  const body = await request.json()
  const { email, code } = body

  if (!email || !code) {
    return NextResponse.json({ error: 'Email and code are required' }, { status: 400 })
  }

  try {
    // Use Gmail SMTP if configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      // Remove any spaces from app password (Gmail app passwords sometimes have spaces in display)
      const emailPass = process.env.EMAIL_PASS.replace(/\s/g, '')
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER.trim(),
          pass: emailPass,
        },
      })

      // Verify connection
      await transporter.verify()

      const info = await transporter.sendMail({
        from: `"Leverage Academy" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Leverage Academy Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0B; color: #F2F2F0; padding: 40px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background: #f7cf3f; color: #000; width: 60px; height: 60px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-bottom: 20px;">
                L
              </div>
              <h1 style="color: #f7cf3f; margin: 0; font-size: 28px;">Leverage Academy</h1>
            </div>
            
            <h2 style="color: #F2F2F0; margin-top: 30px;">Your Verification Code</h2>
            <p style="color: #A1A1AA; font-size: 16px; line-height: 1.6;">Please use the following code to verify your email address:</p>
            
            <div style="background: #121214; border: 1px solid rgba(247, 207, 63, 0.3); padding: 30px; text-align: center; margin: 30px 0; border-radius: 16px;">
              <div style="color: #f7cf3f; font-size: 48px; font-weight: bold; letter-spacing: 8px; font-family: monospace;">
                ${code}
              </div>
            </div>
            
            <p style="color: #A1A1AA; font-size: 14px; line-height: 1.6;">
              This code will expire in <strong style="color: #F2F2F0;">1 hour</strong>.
            </p>
            
            <p style="color: #A1A1AA; font-size: 14px; line-height: 1.6; margin-top: 30px;">
              If you didn't request this code, please ignore this email.
            </p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center;">
              <p style="color: #A1A1AA; font-size: 12px;">© 2024 Leverage Academy. All rights reserved.</p>
            </div>
          </div>
        `,
      })

      console.log('✅ Email sent successfully:', info.messageId)
      return NextResponse.json({ success: true, messageId: info.messageId })
    } else {
      console.error('❌ Gmail credentials not found in environment variables')
      return NextResponse.json({ 
        error: 'Gmail credentials not configured. Please check EMAIL_USER and EMAIL_PASS in .env.local' 
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('❌ Error sending email:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to send email',
      details: error.toString(),
    }, { status: 500 })
  }
}
