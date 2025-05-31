import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'

// Import routes
import sendLabelRoute from './routes/send-label'
import shipmentReceivedRoute from './routes/shipment-received'
import readyToShipRoute from './routes/ready-to-ship'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', prettyJSON())
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://offseasonshoes.com'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Health check
app.get('/', (c) => {
  return c.json({
    message: 'Shoe Cleaning Email Service',
    version: '1.0.0',
    status: 'healthy',
    endpoints: [
      'POST /send-label',
      'POST /shipment-received',
      'POST /ready-to-ship'
    ]
  })
})

// Routes
app.route('/send-label', sendLabelRoute)
app.route('/shipment-received', shipmentReceivedRoute)
app.route('/ready-to-ship', readyToShipRoute)

// Error handling
app.onError((err, c) => {
  console.error('Error:', err)
  return c.json({
    error: 'Internal Server Error',
    message: err.message
  }, 500)
})

// 404 handler
app.notFound((c) => {
  return c.json({
    error: 'Not Found',
    message: 'The requested endpoint was not found'
  }, 404)
})

const port = process.env.PORT || 3001

console.log(`🚀 Shoe Cleaning Email Service running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port: Number(port)
})