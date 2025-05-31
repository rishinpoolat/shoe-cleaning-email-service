import { createClient } from '@supabase/supabase-js'
import type { OrderData, Customer, CleaningOrder, CleaningPackage } from '@/types'

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Get complete order data including customer and package details
 */
export async function getOrderData(orderReference: string): Promise<OrderData> {
  try {
    // Get order details with related data
    const { data: order, error: orderError } = await supabase
      .from('shoe_cleaning_orders')
      .select(`
        *,
        customers:web_customers (
          id,
          first_name,
          last_name,
          email,
          phone
        ),
        package:shoe_cleaning_packages (
          id,
          name,
          description,
          price
        )
      `)
      .eq('order_reference', orderReference)
      .single()

    if (orderError || !order) {
      throw new Error(`Order not found: ${orderError?.message || 'Unknown error'}`)
    }

    if (!order.customers) {
      throw new Error('Customer data not found')
    }

    if (!order.package) {
      throw new Error('Package data not found')
    }

    return {
      order: {
        id: order.id,
        order_reference: order.order_reference,
        customer_id: order.customer_id,
        package_id: order.package_id,
        status: order.status,
        shoe_type: order.shoe_type,
        quantity: order.quantity,
        special_instructions: order.special_instructions,
        total_amount: order.total_amount,
        created_at: order.created_at,
        updated_at: order.updated_at,
      },
      customer: {
        id: order.customers.id,
        first_name: order.customers.first_name,
        last_name: order.customers.last_name,
        email: order.customers.email,
        phone: order.customers.phone,
      },
      package: {
        id: order.package.id,
        name: order.package.name,
        description: order.package.description,
        price: order.package.price,
      }
    }
  } catch (error) {
    console.error('Database error:', error)
    throw error
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderReference: string, status: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('shoe_cleaning_orders')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('order_reference', orderReference)

    if (error) {
      throw new Error(`Failed to update order status: ${error.message}`)
    }
  } catch (error) {
    console.error('Database error:', error)
    throw error
  }
}

export { supabase }