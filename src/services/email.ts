import { Resend } from 'resend'
import type { EmailResult } from '../types'

// Initialize Resend
const resendApiKey = process.env.RESEND_API_KEY!

if (!resendApiKey) {
  throw new Error('Missing RESEND_API_KEY environment variable')
}

const resend = new Resend(resendApiKey)

// Email configuration
const FROM_EMAIL = 'OFFseason <no-reply@offseasonshoes.com>'
const BUSINESS_EMAIL = 'OFFseason <info@offseasonshoes.com>'
const CC_EMAILS = [
  'info@offseasonclothing.co.uk',
  'ash@offseasonclothing.co.uk', 
  'cieran@offseasonclothing.co.uk',
  'brad@offseasonclothing.co.uk',
  'rhea@offseasonclothing.co.uk',
  'developers@offseasonclothing.co.uk',
  'developer.offseason@gmail.com'
]

interface SendEmailOptions {
  to: string
  subject: string
  react: React.ReactElement
  cc?: string[]
  attachments?: Array<{
    filename: string
    content: Buffer
    contentType: string
  }>
}

/**
 * Send email using Resend
 */
export async function sendEmail(options: SendEmailOptions): Promise<EmailResult> {
  try {
    console.log(`Sending email to: ${options.to}`)
    console.log(`Subject: ${options.subject}`)

    const emailData: any = {
      from: FROM_EMAIL,
      to: [options.to],
      subject: options.subject,
      react: options.react,
    }

    // Add CC if provided
    if (options.cc && options.cc.length > 0) {
      emailData.cc = options.cc
    }

    // Add attachments if provided
    if (options.attachments && options.attachments.length > 0) {
      emailData.attachments = options.attachments
    }

    const response = await resend.emails.send(emailData)

    console.log('Email sent successfully:', response)

    return {
      success: true,
      messageId: response.data?.id,
    }
  } catch (error) {
    console.error('Email sending failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send notification to business team
 */
export async function sendBusinessNotification(
  subject: string,
  react: React.ReactElement
): Promise<EmailResult> {
  return sendEmail({
    to: BUSINESS_EMAIL,
    subject,
    react,
    cc: CC_EMAILS,
  })
}

/**
 * Helper to add delay between emails to avoid rate limits
 */
export async function emailDelay(ms: number = 2000): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export { FROM_EMAIL, BUSINESS_EMAIL, CC_EMAILS }