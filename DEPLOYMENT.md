# Deployment Guide

This guide covers deploying the URL Shortener application to various platforms.

## Prerequisites

Before deploying, ensure you have:

1. **Supabase Project**: Set up and configured with the database schema
2. **Environment Variables**: All required environment variables configured
3. **Domain**: (Optional) Custom domain for production

## Vercel Deployment (Recommended)

Vercel is the easiest platform to deploy Next.js applications.

### Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository

3. **Configure Environment Variables**
   In Vercel dashboard, add these environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be available at `https://your-project.vercel.app`

### Custom Domain (Optional)

1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain
3. Update `NEXT_PUBLIC_APP_URL` to your custom domain
4. Redeploy the application

## Netlify Deployment

### Steps:

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Environment Variables**
   Add the same environment variables as Vercel

3. **Deploy**
   - Connect your GitHub repository
   - Configure build settings
   - Deploy

## Railway Deployment

### Steps:

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Create new project from GitHub repo

2. **Environment Variables**
   Add all required environment variables

3. **Deploy**
   Railway will automatically deploy your application

## Docker Deployment

### Dockerfile

Create a `Dockerfile` in the project root:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `NEXT_PUBLIC_APP_URL` | Your application URL | `https://myapp.com` |

## Post-Deployment Checklist

- [ ] Verify all environment variables are set correctly
- [ ] Test URL shortening functionality
- [ ] Test URL redirection
- [ ] Verify analytics tracking
- [ ] Test QR code generation
- [ ] Check responsive design on mobile
- [ ] Test custom aliases
- [ ] Verify URL expiration functionality

## Monitoring and Analytics

Consider adding:

1. **Error Tracking**: Sentry, Bugsnag
2. **Analytics**: Google Analytics, Plausible
3. **Uptime Monitoring**: Pingdom, UptimeRobot
4. **Performance Monitoring**: Vercel Analytics, New Relic

## Scaling Considerations

For high-traffic applications:

1. **CDN**: Use Cloudflare or similar
2. **Database**: Consider read replicas
3. **Caching**: Implement Redis for frequently accessed URLs
4. **Rate Limiting**: Add rate limiting to prevent abuse
5. **Load Balancing**: Use multiple instances behind a load balancer
