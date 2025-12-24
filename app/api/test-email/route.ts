import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Test route to verify email configuration
export async function GET() {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json({ 
        error: 'Email credentials not found',
        hasEmailUser: !!process.env.EMAIL_USER,
        hasEmailPass: !!process.env.EMAIL_PASS,
      }, { status: 400 })
    }

    // Remove spaces from app password
    const emailPass = process.env.EMAIL_PASS.replace(/\s/g, '')

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER.trim(),
        pass: emailPass,
      },
    })

    // Test connection
    await transporter.verify()

    // Send test email
    const info = await transporter.sendMail({
      from: `"Leverage Academy" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'Test Email - Leverage Academy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Test Successful!</h2>
          <p>Your Gmail SMTP configuration is working correctly.</p>
          <p>Verification codes will now be sent via email.</p>
        </div>
      `,
    })

    return NextResponse.json({ 
      success: true,
      message: 'Test email sent successfully',
      messageId: info.messageId,
      to: process.env.EMAIL_USER,
    })
  } catch (error: any) {
    console.error('Email test error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to send test email',
      details: error.toString(),
    }, { status: 500 })
  }
}

