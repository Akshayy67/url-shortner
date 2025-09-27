# Quick Setup Guide

Follow these steps to get your URL Shortener running locally.

## 1. Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free tier is sufficient)

## 2. Clone and Install

```bash
# If you haven't already, navigate to the project directory
cd url-shortener

# Install dependencies
npm install
```

## 3. Set Up Supabase

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Sign in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `url-shortener`
   - Database Password: (generate a strong password)
   - Region: (choose closest to your users)
6. Click "Create new project"

### Get API Keys

1. In your Supabase dashboard, go to Settings > API
2. Copy the following values:
   - Project URL
   - `anon` `public` key
   - `service_role` `secret` key

### Set Up Database Schema

1. In Supabase dashboard, go to SQL Editor
2. Copy the contents of `supabase-schema.sql`
3. Paste into the SQL Editor
4. Click "Run" to execute the schema

## 4. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 5. Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 6. Test the Application

### Manual Testing

1. Open [http://localhost:3000](http://localhost:3000)
2. Enter a long URL (e.g., `https://www.example.com/very/long/url`)
3. Click "Shorten URL"
4. Verify the shortened URL is created
5. Click the copy button to copy the short URL
6. Test the short URL in a new tab

### Automated Testing

Run the API test script:

```bash
npm run test:api
```

This will test:
- URL shortening
- Custom aliases
- Recent URLs retrieval
- QR code generation
- Redirection functionality

## 7. Advanced Features

### Custom Aliases

1. Click "Advanced Options" in the form
2. Enter a custom alias (3-50 characters, letters, numbers, hyphens, underscores)
3. The short URL will use your custom alias

### URL Expiration

1. Click "Advanced Options"
2. Set an expiration date and time
3. The URL will automatically expire and stop working after this time

### QR Codes

1. After creating a short URL, click the QR code button
2. A QR code will be generated for easy sharing

## 8. Troubleshooting

### Common Issues

**"Failed to create short URL"**
- Check your Supabase configuration
- Verify environment variables are correct
- Ensure database schema is applied

**"Database connection error"**
- Verify your Supabase project URL and keys
- Check if your Supabase project is active
- Ensure RLS policies are correctly set

**"Custom alias already exists"**
- Try a different alias
- Check the recent URLs list to see existing aliases

**TypeScript errors**
- Run `npm run type-check` to see detailed errors
- Ensure all dependencies are installed

### Getting Help

1. Check the browser console for errors
2. Check the terminal where you ran `npm run dev` for server errors
3. Verify your Supabase dashboard for database issues
4. Run the test script to identify specific problems

## 9. Next Steps

Once everything is working locally:

1. **Deploy to Production**: See `DEPLOYMENT.md` for deployment guides
2. **Customize Styling**: Modify Tailwind classes in components
3. **Add Features**: Extend functionality as needed
4. **Set Up Monitoring**: Add error tracking and analytics

## 10. File Structure

```
url-shortener/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── [code]/         # Dynamic redirect route
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   ├── lib/               # Utility functions
│   └── types/             # TypeScript types
├── public/                # Static assets
├── supabase-schema.sql    # Database schema
├── .env.example          # Environment variables template
└── README.md             # Main documentation
```

## Support

If you encounter any issues:

1. Check this setup guide
2. Review the main README.md
3. Check the deployment guide in DEPLOYMENT.md
4. Open an issue on GitHub (if applicable)
