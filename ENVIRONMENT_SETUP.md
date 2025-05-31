# Environment Setup Guide

## 🔧 Required Environment Variables

Your shoe cleaning email service needs **4 environment variables** to function properly.

### Quick Setup
```bash
# Copy the example file
cp .env.example .env

# Edit with your actual values
nano .env  # or use your preferred editor
```

---

## 📋 Step-by-Step Guide

### 1. **PORT** (Optional)
```env
PORT=3001
```
- **Default**: 3001
- **Purpose**: Which port the server runs on
- **Setup**: Usually no change needed

### 2. **RESEND_API_KEY** (Required) ⚠️
```env
RESEND_API_KEY=re_abc123...
```

**How to get it:**
1. 🌐 Go to [resend.com](https://resend.com)
2. 📝 Sign up/Login
3. 🔑 Navigate to "API Keys"
4. ➕ Click "Create API Key"
5. 📋 Copy the key (starts with `re_`)

**Note**: Keep this secret! Don't commit to Git.

### 3. **SUPABASE_URL** (Required) ⚠️
```env
SUPABASE_URL=https://abcdefgh.supabase.co
```

**How to get it:**
1. 🌐 Go to [supabase.com](https://supabase.com)
2. 📁 Open your project dashboard
3. ⚙️ Go to Settings → API
4. 📋 Copy "Project URL"

### 4. **SUPABASE_ANON_KEY** (Required) ⚠️
```env
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**How to get it:**
1. 📁 Same Supabase project dashboard
2. ⚙️ Settings → API
3. 📋 Copy "anon/public" key
4. ⚠️ This is the **public** key, not the service role key

---

## ✅ Testing Your Setup

After setting up your `.env` file:

```bash
# Test the service starts
bun run dev

# Should see:
# 🚀 Shoe Cleaning Email Service running on http://localhost:3001

# Test health check
curl http://localhost:3001/
# Should return JSON with service info
```

---

## 🔒 Security Notes

- ✅ **DO**: Keep `.env` file in `.gitignore`
- ✅ **DO**: Use different keys for dev/production
- ❌ **DON'T**: Share API keys in screenshots/logs
- ❌ **DON'T**: Commit `.env` to Git

---

## 🚨 Troubleshooting

### "Missing Supabase environment variables"
- Check `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set
- Verify URL format: `https://project-id.supabase.co`

### "Missing RESEND_API_KEY environment variable"  
- Check the key starts with `re_`
- Verify you're using API key, not account password

### "Failed to connect to database"
- Check Supabase project is active
- Verify you're using the correct project URL
- Make sure anon key matches the project

---

## 📞 Need Help?

If you're missing any credentials:
1. **Resend**: Contact your email service admin
2. **Supabase**: Check with your database admin
3. **Project Issues**: Check the GitHub repository

The service **will not start** without all required environment variables! 🚨