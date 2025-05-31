// Customer types
export interface Customer {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
}

// Order types
export interface CleaningOrder {
  id: string
  order_reference: string
  customer_id: string
  package_id: string
  status: string
  shoe_type: string
  quantity: number
  special_instructions?: string
  total_amount: number
  created_at: string
  updated_at: string
}

// Package types
export interface CleaningPackage {
  id: string
  name: string
  description: string
  price: number
}

// Combined order data
export interface OrderData {
  order: CleaningOrder
  customer: Customer
  package: CleaningPackage
}

// Email payload types
export interface EmailPayload {
  orderReference: string
  customerName: string
  customerEmail: string
  orderDate: string
  packageName: string
  shoeType: string
  quantity: number
  specialInstructions?: string
  estimatedDelivery?: string
}

// API request types
export interface SendLabelRequest {
  orderReference: string
  // label will be in form data as file
}

export interface ShipmentReceivedRequest {
  orderReference: string
}

export interface ReadyToShipRequest {
  orderReference: string
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

// Email service types
export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}