import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { getOrderData, updateOrderStatus } from '@/services/database'
import { sendEmail, sendBusinessNotification, emailDelay } from '@/services/email'
import LabelEmail from '@/components/emails/label-email'
import type { ApiResponse } from '@/types'

const app = new Hono()

// Validation schema
const sendLabelSchema = z.object({
  orderReference: z.string().min(1, 'Order reference is required'),
})

/**
 * POST /send-label
 * Send shipping label email with PDF attachment
 */
app.post('/', async (c) => {
  try {
    // Parse form data
    const body = await c.req.formData()
    const orderReference = body.get('orderReference') as string
    const labelFile = body.get('label') as File

    // Validate required fields
    if (!orderReference) {
      return c.json<ApiResponse>({
        success: false,
        message: 'Order reference is required',
        error: 'Missing orderReference in form data'
      }, 400)
    }

    if (!labelFile) {
      return c.json<ApiResponse>({
        success: false,
        message: 'Label PDF file is required',
        error: 'Missing label file in form data'
      }, 400)
    }

    // Validate file type
    if (labelFile.type !== 'application/pdf') {
      return c.json<ApiResponse>({
        success: false,
        message: 'Label must be a PDF file',
        error: `Invalid file type: ${labelFile.type}`
      }, 400)
    }

    console.log(`Processing send-label request for order: ${orderReference}`)

    // Get order data
    const orderData = await getOrderData(orderReference)
    
    // Convert file to buffer for attachment
    const labelBuffer = Buffer.from(await labelFile.arrayBuffer())
    
    // Format order date
    const orderDate = new Date(orderData.order.created_at).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // Prepare email data
    const emailProps = {
      customerName: `${orderData.customer.first_name} ${orderData.customer.last_name}`,
      orderNumber: orderData.order.order_reference,
      orderDate,
      packageName: orderData.package.name,
      shoeType: orderData.order.shoe_type,
      quantity: orderData.order.quantity,
      specialInstructions: orderData.order.special_instructions,
    }

    // Send customer email with label attachment
    const customerEmailResult = await sendEmail({
      to: orderData.customer.email,
      subject: `Your Shipping Label is Ready - Order #${orderReference}`,
      react: LabelEmail(emailProps),
      attachments: [
        {
          filename: `shipping-label-${orderReference}.pdf`,
          content: labelBuffer,
          contentType: 'application/pdf',
        }
      ]
    })

    if (!customerEmailResult.success) {
      throw new Error(`Failed to send customer email: ${customerEmailResult.error}`)
    }

    // Wait before sending business notification
    await emailDelay(2000)

    // Send business notification (without attachment)
    const businessEmailResult = await sendBusinessNotification(
      `Shipping Label Sent - Order #${orderReference}`,
      LabelEmail({
        ...emailProps,
        customerName: `${emailProps.customerName} (${orderData.customer.email})`,
      })
    )

    // Update order status to indicate label has been sent
    await updateOrderStatus(orderReference, 'label_sent')

    console.log(`Label email sent successfully for order: ${orderReference}`)

    return c.json<ApiResponse>({
      success: true,
      message: 'Shipping label email sent successfully',
      data: {
        orderReference,
        customerEmail: orderData.customer.email,
        customerEmailSent: customerEmailResult.success,
        businessEmailSent: businessEmailResult.success,
        messageId: customerEmailResult.messageId,
      }
    })

  } catch (error) {
    console.error('Send label error:', error)
    
    return c.json<ApiResponse>({
      success: false,
      message: 'Failed to send shipping label email',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

export default app