# Shoe Cleaning Email Service

A dedicated Bun + Hono application for handling shoe cleaning email notifications with PDF attachments and order tracking.

## 🚀 Features

- **Send Label**: Email shipping labels as PDF attachments
- **Shipment Received**: Notify customers when shoes arrive for cleaning  
- **Ready to Ship**: Confirm completion and return shipping
- **React Email Templates**: Professional, responsive email designs
- **Database Integration**: Connects to existing Supabase database
- **Business Notifications**: CC internal team on all communications

## 📁 Project Structure

```
src/
├── routes/                     # API endpoints
│   ├── send-label.ts          # POST /send-label
│   ├── shipment-received.ts   # POST /shipment-received  
│   └── ready-to-ship.ts       # POST /ready-to-ship
├── components/
│   └── emails/                # React email templates
│       ├── label-email.tsx
│       ├── shipment-received-email.tsx
│       └── ready-to-ship-email.tsx
├── services/
│   ├── database.ts            # Supabase connection
│   └── email.ts               # Resend email service
├── types/
│   └── index.ts               # TypeScript definitions
└── index.ts                   # Main Hono server
```

## 🛠 Installation

1. **Install dependencies**:
   ```bash
   bun install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Run development server**:
   ```bash
   bun run dev
   ```

4. **Production build**:
   ```bash
   bun run build
   bun start
   ```

## 📡 API Endpoints

### POST /send-label
Send shipping label with PDF attachment.

**Content-Type**: `multipart/form-data`

**Body**:
- `orderReference` (string): Order reference number
- `label` (File): PDF file attachment

**Example**:
```bash
curl -X POST http://localhost:3001/send-label \
  -F "orderReference=OS-CLEAN-1234567890" \
  -F "label=@shipping-label.pdf"
```

### POST /shipment-received  
Notify customer when shoes are received for cleaning.

**Content-Type**: `application/json`

**Body**:
```json
{
  "orderReference": "OS-CLEAN-1234567890"
}
```

### POST /ready-to-ship
Confirm cleaning completion and return shipping.

**Content-Type**: `application/json`

**Body**:
```json
{
  "orderReference": "OS-CLEAN-1234567890",
  "trackingNumber": "RM123456789GB" // optional
}
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 3001) | No |
| `RESEND_API_KEY` | Resend API key for sending emails | Yes |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

## 📧 Email Templates

All email templates follow OFFseason's brand guidelines with:
- Professional responsive design
- Order details and status updates
- Clear next steps for customers  
- Care instructions and tips
- Consistent styling with main website

## 📊 Database Schema

The service expects these Supabase tables:
- `shoe_cleaning_orders` - Order information
- `web_customers` - Customer details  
- `shoe_cleaning_packages` - Service packages

## 🔄 Order Status Flow

1. **Order Created** → Initial confirmation (handled by main app)
2. **Label Sent** → `POST /send-label` updates status to `label_sent`
3. **Shoes Received** → `POST /shipment-received` updates to `received`  
4. **Cleaning Complete** → `POST /ready-to-ship` updates to `completed`

## 🚀 Development

**Start development server**:
```bash
bun run dev
```

**Health check**:
```bash
curl http://localhost:3001/
```

## 📦 Deployment

This service can be deployed to:
- Railway
- Vercel  
- Any platform supporting Bun/Node.js

Ensure environment variables are configured in your deployment platform.

## 🎯 Usage Examples

### Send Label with PDF
```javascript
const formData = new FormData()
formData.append('orderReference', 'OS-CLEAN-1234567890')
formData.append('label', pdfFile)

const response = await fetch('http://localhost:3001/send-label', {
  method: 'POST',
  body: formData
})
```

### Notify Shipment Received
```javascript
const response = await fetch('http://localhost:3001/shipment-received', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderReference: 'OS-CLEAN-1234567890'
  })
})
```

### Confirm Ready to Ship
```javascript
const response = await fetch('http://localhost:3001/ready-to-ship', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderReference: 'OS-CLEAN-1234567890',
    trackingNumber: 'RM123456789GB'
  })
})
```

## 🔍 Error Handling

All endpoints return standardized JSON responses:

**Success**:
```json
{
  "success": true,
  "message": "Email sent successfully",
  "data": { ... }
}
```

**Error**:
```json
{
  "success": false,
  "message": "Failed to send email",
  "error": "Detailed error message"
}
```

## 🤝 Contributing

1. Create feature branch from `main`
2. Make changes and test locally  
3. Submit pull request for review
4. Merge to `main` after approval

---

Built with ❤️ using Bun + Hono + React Email