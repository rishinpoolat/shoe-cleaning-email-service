import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { getOrderData, updateOrderStatus } from '@/services/database'
import { sendEmail, sendBusinessNotification, emailDelay } from '@/services/email'
import ShipmentReceivedEmail from '@/components/emails/shipment-received-email'
import type { ApiResponse } from '@/types'

const app = new Hono()

// Validation schema
const shipmentReceivedSchema = z.object({
  orderReference: z.string().min(1, 'Order reference is required'),
})

/**
 * POST /shipment-received
 * Send confirmation email when shoes are received for cleaning
 */
app.post('/', zValidator('json', shipmentReceivedSchema), async (c) => {
  try {
    const { orderReference } = c.req.valid('json')

    console.log(`Processing shipment-received notification for order: ${orderReference}`)

    // Get order data
    const orderData = await getOrderData(orderReference)
    
    // Format dates
    const orderDate = new Date(orderData.order.created_at).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // Calculate estimated completion (3-5 business days from now)
    const completionDate = new Date()
    completionDate.setDate(completionDate.getDate() + 4) // 4 days as average
    const estimatedCompletion = completionDate.toLocaleDateString('en-GB', {
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
      estimatedCompletion,
    }

    // Send customer email
    const customerEmailResult = await sendEmail({
      to: orderData.customer.email,
      subject: `We've Received Your Shoes - Order #${orderReference}`,
      react: ShipmentReceivedEmail(emailProps),
    })

    if (!customerEmailResult.success) {
      throw new Error(`Failed to send customer email: ${customerEmailResult.error}`)
    }

    // Wait before sending business notification
    await emailDelay(2000)

    // Send business notification
    const businessEmailResult = await sendBusinessNotification(
      `Shipment Received - Order #${orderReference}`,
      ShipmentReceivedEmail({
        ...emailProps,
        customerName: `${emailProps.customerName} (${orderData.customer.email})`,
      })
    )

    // Update order status to indicate shoes have been received
    await updateOrderStatus(orderReference, 'received')

    console.log(`Shipment received notification sent successfully for order: ${orderReference}`)

    return c.json<ApiResponse>({
      success: true,
      message: 'Shipment received notification sent successfully',
      data: {
        orderReference,
        customerEmail: orderData.customer.email,
        customerEmailSent: customerEmailResult.success,
        businessEmailSent: businessEmailResult.success,
        messageId: customerEmailResult.messageId,
        estimatedCompletion,
      }
    })

  } catch (error) {
    console.error('Shipment received notification error:', error)
    
    return c.json<ApiResponse>({
      success: false,
      message: 'Failed to send shipment received notification',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

export default app