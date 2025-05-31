import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { getOrderData, updateOrderStatus } from '@/services/database'
import { sendEmail, sendBusinessNotification, emailDelay } from '@/services/email'
import ReadyToShipEmail from '@/components/emails/ready-to-ship-email'
import type { ApiResponse } from '@/types'

const app = new Hono()

// Validation schema
const readyToShipSchema = z.object({
  orderReference: z.string().min(1, 'Order reference is required'),
  trackingNumber: z.string().optional(),
})

/**
 * POST /ready-to-ship
 * Send notification when shoes are cleaned and ready to ship back
 */
app.post('/', zValidator('json', readyToShipSchema), async (c) => {
  try {
    const { orderReference, trackingNumber } = c.req.valid('json')

    console.log(`Processing ready-to-ship notification for order: ${orderReference}`)

    // Get order data
    const orderData = await getOrderData(orderReference)
    
    // Format dates
    const orderDate = new Date(orderData.order.created_at).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // Calculate estimated delivery (2-3 business days from now)
    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + 2) // 2 days for standard shipping
    const estimatedDelivery = deliveryDate.toLocaleDateString('en-GB', {
      weekday: 'long',
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
      estimatedDelivery,
      trackingNumber,
    }

    // Send customer email
    const customerEmailResult = await sendEmail({
      to: orderData.customer.email,
      subject: `Your Shoes Are Ready and On Their Way! - Order #${orderReference}`,
      react: ReadyToShipEmail(emailProps),
    })

    if (!customerEmailResult.success) {
      throw new Error(`Failed to send customer email: ${customerEmailResult.error}`)
    }

    // Wait before sending business notification
    await emailDelay(2000)

    // Send business notification
    const businessEmailResult = await sendBusinessNotification(
      `Order Completed and Shipped - #${orderReference}`,
      ReadyToShipEmail({
        ...emailProps,
        customerName: `${emailProps.customerName} (${orderData.customer.email})`,
      })
    )

    // Update order status to completed
    await updateOrderStatus(orderReference, 'package-sent-to-customer')

    console.log(`Ready-to-ship notification sent successfully for order: ${orderReference}`)

    return c.json<ApiResponse>({
      success: true,
      message: 'Ready-to-ship notification sent successfully',
      data: {
        orderReference,
        customerEmail: orderData.customer.email,
        customerEmailSent: customerEmailResult.success,
        businessEmailSent: businessEmailResult.success,
        messageId: customerEmailResult.messageId,
        estimatedDelivery,
        trackingNumber: trackingNumber || null,
      }
    })

  } catch (error) {
    console.error('Ready-to-ship notification error:', error)
    
    return c.json<ApiResponse>({
      success: false,
      message: 'Failed to send ready-to-ship notification',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

export default app