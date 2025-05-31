# Shoe Cleaning Email Service

A dedicated **Bun + Hono** application for handling shoe cleaning email notifications with PDF attachments and order tracking.

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/rishinpoolat/shoe-cleaning-email-service.git
cd shoe-cleaning-email-service
bun install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your actual values
```

**Required Environment Variables:**
```env
# Server Configuration
PORT=3001

# Resend API (Email Service)
RESEND_API_KEY=re_your_api_key_here

# Supabase Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Get Your API Keys

**🔑 Resend API Key:**
1. Go to [resend.com](https://resend.com) → Sign up/Login
2. Navigate to **API Keys** → **Create API Key**
3. Copy the key (starts with `re_`)

**🗄️ Supabase Credentials:**
1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project → **Settings** → **API**
3. Copy **Project URL** and **anon/public** key

### 4. Run the Service
```bash
# Development mode (hot reload)
bun run dev

# Production build
bun run build
bun start

# Health check
curl http://localhost:3001/
```

## 📡 API Endpoints

### **POST /send-label**
Send shipping label with PDF attachment to customer.

```bash
curl -X POST http://localhost:3001/send-label \
  -F "orderReference=OS-CLEAN-1234567890" \
  -F "label=@shipping-label.pdf"
```

**Payload:**
- `orderReference` (string): Order reference from database
- `label` (File): PDF file attachment

---

### **POST /shipment-received**
Notify customer when shoes are received for cleaning.

```bash
curl -X POST http://localhost:3001/shipment-received \
  -H "Content-Type: application/json" \
  -d '{"orderReference": "OS-CLEAN-1234567890"}'
```

**Payload:**
```json
{
  "orderReference": "OS-CLEAN-1234567890"
}
```

---

### **POST /ready-to-ship**
Confirm cleaning completion and return shipping.

```bash
curl -X POST http://localhost:3001/ready-to-ship \
  -H "Content-Type: application/json" \
  -d '{
    "orderReference": "OS-CLEAN-1234567890",
    "trackingNumber": "RM123456789GB"
  }'
```

**Payload:**
```json
{
  "orderReference": "OS-CLEAN-1234567890",
  "trackingNumber": "RM123456789GB"  // optional
}
```

## 🔄 Customer Email Journey

1. **Initial Order** → Main app sends confirmation
2. **Label Ready** → `POST /send-label` with PDF attachment
3. **Shoes Received** → `POST /shipment-received` when package arrives  
4. **Cleaning Complete** → `POST /ready-to-ship` when finished

## 📧 Email Templates

All emails feature professional OFFseason branding with:

### 📨 Send Label Email
- **Subject**: "Your Shipping Label is Ready - Order #[ORDER]"
- **Content**: PDF attachment + step-by-step shipping instructions
- **Includes**: Packaging guide, drop-off locations, tracking info

### 📦 Shipment Received Email  
- **Subject**: "We've Received Your Shoes - Order #[ORDER]"
- **Content**: Confirmation with cleaning process timeline
- **Includes**: 5-step cleaning process, estimated completion date

### ✨ Ready to Ship Email
- **Subject**: "Your Shoes Are Ready and On Their Way! - Order #[ORDER]"
- **Content**: Completion celebration + care instructions
- **Includes**: What was done, delivery info, maintenance tips

**Email Features:**
- ✅ Responsive design (mobile/desktop)
- ✅ Professional OFFseason branding  
- ✅ Customer + business team notifications
- ✅ Order details and progress tracking
- ✅ PDF attachment support for labels

## 🗄️ Database Schema

The service expects these **Supabase** tables:

### `shoe_cleaning_orders`
```sql
CREATE TABLE shoe_cleaning_orders (
  id TEXT PRIMARY KEY,
  order_reference TEXT UNIQUE NOT NULL,
  customer_id TEXT REFERENCES web_customers(id),
  package_id TEXT REFERENCES shoe_cleaning_packages(id),
  status TEXT DEFAULT 'pending', -- 'pending', 'label_sent', 'received', 'completed'
  shoe_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  special_instructions TEXT,
  total_amount INTEGER NOT NULL, -- in pence
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### `web_customers`
```sql
CREATE TABLE web_customers (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT
);
```

### `shoe_cleaning_packages`
```sql
CREATE TABLE shoe_cleaning_packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL -- in pence
);
```

## 🧪 Testing the Service

### 1. Create Test Data
First, insert test data in your Supabase database:

```sql
-- Test customer
INSERT INTO web_customers (id, first_name, last_name, email) 
VALUES ('test-customer-1', 'John', 'Doe', 'john.doe@example.com');

-- Test package
INSERT INTO shoe_cleaning_packages (id, name, description, price) 
VALUES ('basic-clean', 'Basic Cleaning', 'Standard shoe cleaning', 2500);

-- Test order
INSERT INTO shoe_cleaning_orders (
  id, order_reference, customer_id, package_id, status, 
  shoe_type, quantity, total_amount
) VALUES (
  'test-order-1', 'OS-CLEAN-1234567890', 'test-customer-1', 'basic-clean', 
  'pending', 'Sneakers', 1, 2500
);
```

### 2. Test API Endpoints

**Health Check:**
```bash
curl http://localhost:3001/
# Should return service info JSON
```

**Test Shipment Received:**
```bash
curl -X POST http://localhost:3001/shipment-received \
  -H "Content-Type: application/json" \
  -d '{"orderReference": "OS-CLEAN-1234567890"}'
```

**Test Ready to Ship:**
```bash
curl -X POST http://localhost:3001/ready-to-ship \
  -H "Content-Type: application/json" \
  -d '{"orderReference": "OS-CLEAN-1234567890", "trackingNumber": "RM123456789GB"}'
```

**Test Send Label** (create test PDF first):
```bash
# Create a simple test PDF or use any PDF file
curl -X POST http://localhost:3001/send-label \
  -F "orderReference=OS-CLEAN-1234567890" \
  -F "label=@test-shipping-label.pdf"
```

### 3. Expected Response
All successful requests return:
```json
{
  "success": true,
  "message": "Email sent successfully",
  "data": {
    "orderReference": "OS-CLEAN-1234567890",
    "customerEmail": "john.doe@example.com",
    "customerEmailSent": true,
    "businessEmailSent": true,
    "messageId": "re_abc123..."
  }
}
```

## 🛠 Development Commands

```bash
# Development
bun run dev              # Start with hot reload
bun run type-check       # TypeScript validation only

# Building  
bun run build           # Production build
bun run build:simple    # Simple build (faster)

# Production
bun start              # Run production server
```

## 🚨 Troubleshooting

### Environment Issues

**❌ "Missing Supabase environment variables"**
- Verify `SUPABASE_URL` format: `https://project-id.supabase.co`
- Ensure `SUPABASE_ANON_KEY` is the **anon/public** key (not service role)
- Check `.env` file exists and variables are set

**❌ "Missing RESEND_API_KEY environment variable"**
- Get API key from [resend.com/api-keys](https://resend.com/api-keys)
- Key should start with `re_`
- Verify key is active and not expired

### Email Issues

**❌ "Domain not verified" errors**
- Verify `offseasonshoes.com` domain in Resend dashboard
- Add required DNS records (SPF, DKIM, DMARC)
- Wait up to 24 hours for full propagation

**❌ Emails not being sent**
- Check Resend dashboard for delivery logs
- Verify recipient emails are valid
- Check rate limits (service has built-in delays)
- Ensure `from` email domain is verified

### Database Issues

**❌ "Order not found"**
- Verify order exists: `SELECT * FROM shoe_cleaning_orders WHERE order_reference = 'your-order-ref'`
- Check customer and package data exist
- Ensure foreign key relationships are correct

**❌ Database connection timeouts**
- Verify Supabase project is active (not paused)
- Check internet connectivity
- Confirm API key has correct permissions

### Build Issues

**❌ Build failures**
- Clear cache: `rm -rf node_modules bun.lockb && bun install`
- Update Bun: `bun upgrade`
- Try simple build: `bun run build:simple`
- Check TypeScript errors: `bun run type-check`

## 📦 Deployment

### Platform Options
- **Railway** (recommended for Bun)
- **Vercel** 
- **Render**
- **Any platform with Bun/Node.js support**

### Environment Variables in Production
Set these in your deployment platform:
```
RESEND_API_KEY=re_your_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
PORT=3001
```

### Pre-Deployment Checklist
- ✅ Domain `offseasonshoes.com` verified in Resend
- ✅ Database tables created in Supabase
- ✅ Environment variables configured
- ✅ Test all endpoints locally
- ✅ Build succeeds: `bun run build`

### Health Monitoring
Use `GET /` endpoint for health checks in your platform.

## 📁 Project Structure

```
shoe-cleaning-email-service/
├── src/
│   ├── routes/                    # API endpoints
│   │   ├── send-label.ts         # PDF email with attachment
│   │   ├── shipment-received.ts  # Arrival notification
│   │   └── ready-to-ship.ts      # Completion notification
│   ├── components/emails/         # React email templates
│   │   ├── label-email.tsx       # Shipping label email
│   │   ├── shipment-received-email.tsx
│   │   └── ready-to-ship-email.tsx
│   ├── services/
│   │   ├── database.ts           # Supabase queries
│   │   └── email.ts              # Resend email service
│   ├── types/index.ts            # TypeScript definitions
│   └── index.ts                  # Main Hono server
├── .env.example                  # Environment template
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript config
├── bunfig.toml                   # Bun build config
└── README.md                     # This file
```

## 🔒 Security & Best Practices

- ✅ Environment variables not committed to Git
- ✅ No sensitive data in source code
- ✅ Input validation with Zod schemas
- ✅ Rate limiting between email sends (2-second delays)
- ✅ Comprehensive error handling
- ✅ Email security handled by Resend
- ✅ Database security handled by Supabase RLS

## 📊 Performance

**Expected Response Times:**
- Health Check: < 100ms
- Send Label: 2-5 seconds (2 emails + PDF processing)
- Shipment Received: 2-4 seconds (2 emails)
- Ready to Ship: 2-4 seconds (2 emails)

**Email Delivery:**
- Customer emails: Usually delivered within 30 seconds
- Business notifications: CC'd to team automatically
- PDF attachments: Up to 10MB supported

## 🚀 Getting Started (Complete Setup)

### Step 1: Clone and Install
```bash
git clone https://github.com/rishinpoolat/shoe-cleaning-email-service.git
cd shoe-cleaning-email-service
bun install
```

### Step 2: Set Up Resend
1. Create account at [resend.com](https://resend.com)
2. Add and verify domain `offseasonshoes.com`
3. Create API key → copy for `.env`

### Step 3: Set Up Supabase
1. Create project at [supabase.com](https://supabase.com)
2. Create the database tables (see schema above)
3. Get Project URL and anon key → copy for `.env`

### Step 4: Configure Environment
```bash
cp .env.example .env
# Edit .env with your actual API keys
```

### Step 5: Test Everything
```bash
bun run dev
curl http://localhost:3001/  # Health check
# Test with your order data
```

### Step 6: Deploy
1. Push to GitHub
2. Connect to Railway/Vercel/Render
3. Set environment variables in platform
4. Deploy!

## 📞 Support & Documentation

- **Issues**: [GitHub Issues](https://github.com/rishinpoolat/shoe-cleaning-email-service/issues)
- **Resend Docs**: [resend.com/docs](https://resend.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Hono Docs**: [hono.dev](https://hono.dev)

---

**Built with ❤️ using Bun + Hono + React Email + Resend + Supabase**

*This service handles 3 critical emails in the shoe cleaning workflow: shipping label delivery, arrival confirmation, and completion notification. Each email is professionally designed with OFFseason branding and includes all necessary information for customers and the business team.*