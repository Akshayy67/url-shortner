# URL Shortener

A modern, full-featured URL shortener built with Next.js, TypeScript, Tailwind CSS, and Supabase. Create short, memorable links with advanced analytics, custom aliases, QR codes, and expiration dates.

## Features

- ⚡ **Lightning Fast**: Instant URL shortening with optimized performance
- 📊 **Analytics**: Track clicks, monitor performance, and gain insights
- 🎯 **Custom Aliases**: Create branded, memorable short links
- 📱 **QR Codes**: Generate QR codes for easy sharing
- ⏰ **URL Expiration**: Set expiration dates for temporary links
- 📋 **Copy to Clipboard**: One-click copying functionality
- 🔒 **Secure**: Built with security best practices
- 📱 **Responsive**: Works perfectly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **QR Codes**: qrcode library
- **ID Generation**: nanoid

## Getting Started

### 🚀 Quick Start (Demo Mode)

Want to try it immediately? No setup required!

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - the app works with demo data out of the box!

## Prerequisites

- Node.js 18+ and npm
- A Supabase account and project (for production use)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd url-shortener
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Supabase**

   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and API keys
   - Copy the SQL schema from `supabase-schema.sql` and run it in the Supabase SQL editor

4. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

The application uses Supabase as the database. Run the SQL commands in `supabase-schema.sql` in your Supabase SQL editor to create the necessary tables and functions:

- `urls` table: Stores URL mappings, analytics, and metadata
- `clicks` table: Stores detailed click analytics
- Functions for click counting and expiration checking
- Row Level Security (RLS) policies for public access

## API Endpoints

- `POST /api/shorten` - Create a new shortened URL
- `GET /api/urls` - Retrieve recent URLs with analytics
- `GET /api/qr` - Generate QR code for a URL
- `GET /[code]` - Redirect to original URL and track analytics

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   ├── [code]/        # Dynamic redirect route
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page
├── components/        # React components
├── lib/              # Utility functions and database
└── types/            # TypeScript type definitions
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

Make sure to:

- Set the correct environment variables
- Update `NEXT_PUBLIC_APP_URL` to your production domain
- Configure your Supabase project for production

## Environment Variables

| Variable                        | Description               | Required |
| ------------------------------- | ------------------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL | Yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key    | Yes      |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service role key | Yes      |
| `NEXT_PUBLIC_APP_URL`           | Your application URL      | Yes      |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
