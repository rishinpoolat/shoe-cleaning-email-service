# Shoe Cleaning Email Service

A dedicated Bun + Hono email service for OFFseason shoe cleaning notifications with PDF attachment support and order tracking.

## 🚀 Features

- **📧 Three Email Types**: Label sending, shipment received, and completion notifications
- **📎 PDF Attachments**: Send shipping labels as email attachments
- **📱 React Email Templates**: Professional, responsive email designs
- **🗄️ Database Integration**: Connects to existing Supabase database
- **👥 Team Notifications**: Automatic business team notifications
- **⚡ Fast Performance**: Built with Bun and Hono for optimal speed
- **🔒 Type Safety**: Full TypeScript coverage

## 📁 Project Structure

```
src/
├── components/
│   └── emails/                    # React email templates
│       ├── label-email.tsx       # Shipping label email
│       ├── shipment-received-email.tsx
│       └── ready-to-ship-email.tsx
├── routes/                        # API endpoints
│   ├── send-label.ts             # POST /send-label
│   ├── shipment-received.ts      # POST /shipment-received
│   └── ready-to-ship.ts          # POST /ready-to-ship
├── services/
│   ├── database.ts               # Supabase connection
│   └── email.ts                  # Resend email service
├── types/
│   └── index.ts                  # TypeScript definitions
└── index.ts                      # Main Hono server
```

## 🛠 Installation & Setup

### Prerequisites
- [Bun](https://bun.sh) installed
- Resend account with API key
- Supabase database access

### Quick Start

1. **Clone and install dependencies**
   ```bash
   cd shoe-cleaning-email-service
   bun install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Configure your environment**
   ```env
   PORT=3001
   RESEND_API_KEY=re_your_resend_api_key_here
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Start the service**
   ```bash
   # Development mode
   bun run dev
   
   # Production mode
   bun run start
   ```

## 📡 API Endpoints

### Health Check
```bash
GET /
# Returns service status and available endpoints
```

### 1. Send Shipping Label
```bash
POST /send-label
Content-Type: multipart/form-data

# Body (form data):
# - orderReference: string
# - label: File (PDF)
```

**Example:**
```bash
curl -X POST http://localhost:3001/send-label \
  -F "orderReference=OS-CLEAN-1234567890" \
  -F "label=@shipping-label.pdf"
```

### 2. Shipment Received Notification
```bash
POST /shipment-received
Content-Type: application/json

{
  "orderReference": "OS-CLEAN-1234567890"
}
```

### 3. Ready to Ship Notification
```bash
POST /ready-to-ship
Content-Type: application/json

{
  "orderReference": "OS-CLEAN-1234567890",
  "trackingNumber": "RM123456789GB"  // optional
}
```

## 🔄 Email Workflow

The service handles a complete 3-step email sequence:

1. **📋 Order Confirmed** → Customer receives initial confirmation (handled by main app)
2. **📦 Label Ready** → `POST /send-label` sends shipping label with PDF attachment
3. **👀 Shoes Received** → `POST /shipment-received` confirms receipt and cleaning start
4. **✨ Cleaning Complete** → `POST /ready-to-ship` notifies completion and return shipping

## 📧 Email Configuration

### Customer Emails
- **From:** `OFFseason <no-reply@offseasonshoes.com>`
- **Templates:** Professional React Email components
- **Features:** Order details, progress tracking, care instructions

### Business Notifications
- **To:** `OFFseason <info@offseasonshoes.com>`
- **CC:** Team members (info, ash, developers)
- **Purpose:** Internal order tracking and customer communication awareness

### Email Templates

#### Label Email
- Shipping instructions with PDF attachment
- Step-by-step packaging guide
- Royal Mail drop-off locations

#### Shipment Received Email
- Confirmation of receipt
- 5-step cleaning process explanation
- Estimated completion timeline

#### Ready to Ship Email
- Completion celebration
- Care tips for clean shoes
- Delivery tracking information

## 🗄️ Database Schema

The service expects these Supabase tables:

### `shoe_cleaning_orders`
- `id`, `order_reference`, `customer_id`, `package_id`
- `status`, `shoe_type`, `quantity`, `special_instructions`
- `total_amount`, `created_at`, `updated_at`

### `web_customers`
- `id`, `first_name`, `last_name`, `email`, `phone`

### `shoe_cleaning_packages`
- `id`, `name`, `description`, `price`

## 🔧 Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | No | Server port (default: 3001) | `3001` |
| `RESEND_API_KEY` | **Yes** | Resend API key for emails | `re_abc123...` |
| `SUPABASE_URL` | **Yes** | Supabase project URL | `https://abc.supabase.co` |
| `SUPABASE_ANON_KEY` | **Yes** | Supabase anonymous key | `eyJhbGci...` |

### Getting API Keys

#### Resend API Key
1. Sign up at [resend.com](https://resend.com)
2. Go to **API Keys** → **Create API Key**
3. Copy the key (starts with `re_`)

#### Supabase Credentials
1. Open your [Supabase project](https://app.supabase.com)
2. Go to **Settings** → **API**
3. Copy **Project URL** and **anon/public** key

## 🚀 Development

### Available Scripts
```bash
# Development with hot reload
bun run dev

# Production server
bun run start

# Build for production
bun run build

# Type checking
bun run type-check

# Tests
bun test
```

### Building
```bash
# Create production build
bun run build

# Build output will be in ./dist/
ls -la dist/
```

## 📦 Deployment

The service can be deployed to:

### Railway (Recommended)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Vercel
1. Import project from GitHub
2. Configure environment variables
3. Deploy

### Docker
```dockerfile
FROM oven/bun:1 as base
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install
COPY . .
RUN bun run build
EXPOSE 3001
CMD ["bun", "start"]
```

## 🛡️ Security & Best Practices

### Domain Verification
- **Required:** Verify `offseasonshoes.com` in Resend
- **DNS Records:** Add TXT and CNAME records from Resend
- **Status:** Check verification in Resend dashboard

### Environment Security
- Keep `.env` files private (in `.gitignore`)
- Use different API keys for development/production
- Never commit API keys to Git
- Rotate keys regularly

### Rate Limiting
- Built-in delays between customer and business emails
- Automatic retry logic for rate limit errors
- 3-attempt retry with exponential backoff

## 🔍 Troubleshooting

### Common Issues

#### "Missing environment variables"
```bash
# Check your .env file exists and has all required variables
cat .env
```

#### "Domain not verified" email errors
- Verify `offseasonshoes.com` in Resend dashboard
- Check DNS records are properly configured
- Wait 15-30 minutes for DNS propagation

#### "Order not found" database errors
- Verify order reference exists in `shoe_cleaning_orders` table
- Check Supabase connection and permissions
- Ensure database schema matches expected structure

#### Build errors
```bash
# Clean install
rm -rf node_modules bun.lockb
bun install

# Try build again
bun run build
```

### Debug Mode
```bash
# Run with debug logging
DEBUG=* bun run dev

# Check service health
curl http://localhost:3001/
```

## 📊 Monitoring

### Health Checks
```bash
# Service status
curl http://localhost:3001/

# Response should include:
{
  "message": "Shoe Cleaning Email Service",
  "version": "1.0.0",
  "status": "healthy",
  "endpoints": [...]
}
```

### Logging
- Console logs for all email attempts
- Error tracking with stack traces
- Request/response logging via Hono middleware

## 🤝 Contributing

1. Create feature branch from `main`
2. Make changes and test locally
3. Submit pull request with description
4. Merge after code review

### Code Style
- TypeScript for type safety
- ESLint + Prettier for formatting
- Conventional commit messages
- Comprehensive error handling

## 📄 License

MIT License - see LICENSE file for details

---

## 🎯 Quick Reference

### Start Service
```bash
bun run dev  # Development
bun start    # Production
```

### Send Test Email
```bash
# Label email with PDF
curl -X POST http://localhost:3001/send-label \
  -F "orderReference=OS-CLEAN-TEST" \
  -F "label=@test-label.pdf"

# Shipment received
curl -X POST http://localhost:3001/shipment-received \
  -H "Content-Type: application/json" \
  -d '{"orderReference": "OS-CLEAN-TEST"}'

# Ready to ship
curl -X POST http://localhost:3001/ready-to-ship \
  -H "Content-Type: application/json" \
  -d '{"orderReference": "OS-CLEAN-TEST", "trackingNumber": "RM123456789GB"}'
```

**Built with ❤️ by OFFseason using Bun + Hono + React Email**