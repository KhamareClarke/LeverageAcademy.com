import nodemailer from 'nodemailer'

export interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail(options: EmailOptions) {
  try {
    // Use Gmail SMTP if configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ [EMAIL] Gmail credentials not found in environment variables')
      console.log('📧 [DEV MODE] Email would be sent to:', options.to)
      console.log('📧 [DEV MODE] Subject:', options.subject)
      return {
        success: false,
        error: 'Email service not configured. Please set EMAIL_USER and EMAIL_PASS in environment variables.',
      }
    }

    console.log('📧 [EMAIL] Gmail credentials found')
    console.log('📧 [EMAIL] Recipient:', options.to)
    
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
    console.log('📧 [EMAIL] Verifying SMTP connection...')
    try {
      await transporter.verify()
      console.log('✅ [EMAIL] SMTP connection verified')
    } catch (verifyErr: any) {
      console.error('❌ [EMAIL] SMTP verification failed:', verifyErr)
      throw new Error(`SMTP connection failed: ${verifyErr.message}`)
    }

    console.log('📧 [EMAIL] Sending email to:', options.to)
    console.log('📧 [EMAIL] Email subject:', options.subject)
    
    const info = await transporter.sendMail({
      from: `"Leverage Academy" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    })

    console.log('✅ [EMAIL] Email sent successfully!')
    console.log('✅ [EMAIL] Message ID:', info.messageId)
    return {
      success: true,
      messageId: info.messageId,
    }
  } catch (error: any) {
    console.error('❌ [EMAIL] Failed to send email:', error)
    console.error('❌ [EMAIL] Error code:', error.code)
    console.error('❌ [EMAIL] Error command:', error.command)
    console.error('❌ [EMAIL] Error response:', error.response)
    return {
      success: false,
      error: error.message || 'Failed to send email. Please check your email configuration.',
    }
  }
}

export async function sendApplicationApprovalEmail(email: string, name: string, courseTitle: string) {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0B; color: #F2F2F0; padding: 40px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="background: #f7cf3f; color: #000; width: 60px; height: 60px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-bottom: 20px;">
          L
        </div>
        <h1 style="color: #f7cf3f; margin: 0; font-size: 28px;">Leverage Academy</h1>
      </div>
      
      <h2 style="color: #F2F2F0; margin-top: 30px;">Application Approved! 🎉</h2>
      <p style="color: #A1A1AA; font-size: 16px; line-height: 1.6;">Dear ${name},</p>
      
      <p style="color: #A1A1AA; font-size: 16px; line-height: 1.6;">
        Great news! Your application for <strong style="color: #f7cf3f;">${courseTitle}</strong> has been approved!
      </p>
      
      <div style="background: #121214; border: 1px solid rgba(247, 207, 63, 0.3); padding: 30px; margin: 30px 0; border-radius: 16px; text-align: center;">
        <p style="color: #F2F2F0; font-size: 18px; margin: 0;">
          You can now proceed with payment to enroll in the course.
        </p>
      </div>
      
      <p style="color: #A1A1AA; font-size: 14px; line-height: 1.6;">
        Please log in to your account to complete your enrollment and payment.
      </p>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center;">
        <p style="color: #A1A1AA; font-size: 12px;">© 2024 Leverage Academy. All rights reserved.</p>
      </div>
    </div>
  `

  return await sendEmail({
    to: email,
    subject: `Application Approved - ${courseTitle}`,
    html: emailHtml,
  })
}

export async function sendPaymentNotificationEmail(
  to: string,
  studentEmail: string,
  courseTitle: string,
  amount: number
) {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0B; color: #F2F2F0; padding: 40px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="background: #f7cf3f; color: #000; width: 60px; height: 60px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-bottom: 20px;">
          L
        </div>
        <h1 style="color: #f7cf3f; margin: 0; font-size: 28px;">Leverage Academy</h1>
      </div>
      
      <h2 style="color: #F2F2F0; margin-top: 30px;">Payment Received</h2>
      <p style="color: #A1A1AA; font-size: 16px; line-height: 1.6;">
        A payment has been recorded for a course enrollment.
      </p>
      
      <div style="background: #121214; border: 1px solid rgba(247, 207, 63, 0.3); padding: 20px; margin: 24px 0; border-radius: 16px;">
        <p style="margin: 0 0 8px; color: #A1A1AA;">Student Email: <strong style="color: #F2F2F0;">${studentEmail}</strong></p>
        <p style="margin: 0 0 8px; color: #A1A1AA;">Course: <strong style="color: #F2F2F0;">${courseTitle}</strong></p>
        <p style="margin: 0; color: #A1A1AA;">Amount: <strong style="color: #F2F2F0;">£${amount.toFixed(2)}</strong></p>
      </div>
      
      <p style="color: #A1A1AA; font-size: 14px; line-height: 1.6;">
        You can view this student in the Admin Students dashboard.
      </p>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center;">
        <p style="color: #A1A1AA; font-size: 12px;">© 2024 Leverage Academy. All rights reserved.</p>
      </div>
    </div>
  `

  return await sendEmail({
    to,
    subject: `Payment Received - ${courseTitle}`,
    html: emailHtml,
  })
}

export async function sendWelcomeEmail(studentEmail: string, studentName: string, courseTitle: string) {
  const name = studentName || 'there'
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0B; color: #F2F2F0; padding: 40px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="background: #f7cf3f; color: #000; width: 60px; height: 60px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-bottom: 20px;">
          L
        </div>
        <h1 style="color: #f7cf3f; margin: 0; font-size: 28px;">Leverage Academy</h1>
      </div>
      
      <h2 style="color: #F2F2F0; margin-top: 30px;">Welcome! 🎉</h2>
      <p style="color: #A1A1AA; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
      
      <p style="color: #A1A1AA; font-size: 16px; line-height: 1.6;">
        Thank you for your payment. You're now enrolled in <strong style="color: #f7cf3f;">${courseTitle}</strong>.
      </p>
      
      <div style="background: #121214; border: 1px solid rgba(247, 207, 63, 0.3); padding: 30px; margin: 30px 0; border-radius: 16px; text-align: center;">
        <p style="color: #F2F2F0; font-size: 18px; margin: 0;">
          You can access your course and start learning from your student dashboard.
        </p>
      </div>
      
      <p style="color: #A1A1AA; font-size: 14px; line-height: 1.6;">
        Log in at any time to continue your progress. We're excited to have you.
      </p>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center;">
        <p style="color: #A1A1AA; font-size: 12px;">© 2024 Leverage Academy. All rights reserved.</p>
      </div>
    </div>
  `

  return await sendEmail({
    to: studentEmail,
    subject: `Welcome to Leverage Academy – You're enrolled in ${courseTitle}`,
    html: emailHtml,
  })
}

export async function sendVerificationEmail(email: string, code: string) {
  const emailHtml = `
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
        This code will expire in <strong style="color: #F2F2F0;">10 minutes</strong>.
      </p>
      
      <p style="color: #A1A1AA; font-size: 14px; line-height: 1.6; margin-top: 30px;">
        If you didn't request this code, please ignore this email.
      </p>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center;">
        <p style="color: #A1A1AA; font-size: 12px;">© 2024 Leverage Academy. All rights reserved.</p>
      </div>
    </div>
  `

  return await sendEmail({
    to: email,
    subject: 'Your Leverage Academy Verification Code',
    html: emailHtml,
  })
}
