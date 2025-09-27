# URL Shortener

A modern, fast URL shortener built with Next.js and Supabase.

## Features

- Shorten long URLs instantly
- Custom aliases support
- QR code generation
- Click analytics
- URL expiration
- Responsive design

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env.local`
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=your_app_url
```

## Database Setup

Run the SQL schema in your Supabase dashboard to create the required tables.

## Deployment

Deploy to Vercel with one click or use any other hosting platform that supports Next.js.

## License

MIT
