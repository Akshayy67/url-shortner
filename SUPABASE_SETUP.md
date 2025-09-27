# 🚀 Supabase Setup Guide for Real-Time URL Shortener

This guide will help you set up a real Supabase database to replace the demo/mock data with actual persistent storage.

## 📋 Prerequisites

- A Supabase account (free tier available)
- Access to your project's environment variables

## 🔧 Step 1: Create Supabase Project

1. **Go to Supabase Dashboard**
   - Visit [https://supabase.com](https://supabase.com)
   - Sign in or create a free account

2. **Create New Project**
   - Click "New Project"
   - Choose your organization
   - Enter project details:
     - **Name**: `url-shortener` (or your preferred name)
     - **Database Password**: Create a strong password (save this!)
     - **Region**: Choose closest to your users
   - Click "Create new project"

3. **Wait for Setup**
   - Project creation takes 1-2 minutes
   - You'll see a dashboard when ready

## 🗄️ Step 2: Set Up Database Schema

1. **Open SQL Editor**
   - In your Supabase dashboard, go to "SQL Editor"
   - Click "New query"

2. **Run Database Schema**
   - Copy the entire contents of `supabase-schema.sql`
   - Paste into the SQL editor
   - Click "Run" to execute

3. **Verify Tables Created**
   - Go to "Table Editor" in the sidebar
   - You should see two tables: `urls` and `clicks`

## 🔑 Step 3: Get API Keys

1. **Navigate to Settings**
   - In your Supabase dashboard, click "Settings" (gear icon)
   - Go to "API" section

2. **Copy Required Values**
   - **Project URL**: Copy the "Project URL"
   - **Anon Key**: Copy the "anon" key (public key)
   - **Service Role Key**: Copy the "service_role" key (keep this secret!)

## ⚙️ Step 4: Configure Environment Variables

1. **Open `.env.local` file** in your project root

2. **Replace placeholder values** with your actual Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Save the file**

## 🔄 Step 5: Restart Application

1. **Stop the development server** (Ctrl+C in terminal)

2. **Start the application again**:
```bash
npm run dev
```

3. **Verify Real Database Connection**
   - The app should now use real Supabase instead of mock data
   - Create a new shortened URL to test
   - Check your Supabase dashboard "Table Editor" to see real data

## ✅ Step 6: Test Real Functionality

### Test URL Shortening
1. Go to http://localhost:3000
2. Enter a URL and create a shortened link
3. Check Supabase dashboard → Table Editor → urls table
4. You should see your new URL entry

### Test URL Redirection
1. Click on your shortened URL
2. It should redirect to the original URL
3. Check the clicks table for analytics data

### Test QR Codes
1. Generate a QR code for your shortened URL
2. Scan with your phone to test redirection

## 🔒 Security Notes

- **Never commit** your `.env.local` file to version control
- The **service role key** has admin access - keep it secret
- The **anon key** is safe to expose in frontend code
- Row Level Security (RLS) is enabled for data protection

## 🚨 Troubleshooting

### "Invalid supabaseUrl" Error
- Double-check your `NEXT_PUBLIC_SUPABASE_URL` format
- Should be: `https://your-project-id.supabase.co`

### "Invalid API Key" Error
- Verify you copied the correct anon and service role keys
- Check for extra spaces or missing characters

### Database Connection Issues
- Ensure your Supabase project is active
- Check if the database schema was applied correctly
- Verify RLS policies are in place

### Still Seeing Demo Data?
- Restart your development server after changing `.env.local`
- Clear browser cache and refresh

## 📊 Monitoring Your Database

- **Real-time Data**: View live data in Supabase Table Editor
- **Analytics**: Monitor clicks and URL performance
- **Logs**: Check Supabase logs for any errors
- **Usage**: Monitor your free tier limits

## 🎉 Success!

Once configured, your URL shortener will have:
- ✅ Real persistent data storage
- ✅ Live analytics and click tracking
- ✅ Scalable database infrastructure
- ✅ Automatic backups and security
- ✅ Real-time updates across devices

Your application is now production-ready with real database functionality!
