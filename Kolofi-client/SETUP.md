# Kolofi Setup Guide

Complete guide for setting up Kolofi for development and production.

## Development Setup

### 1. Initial Installation

```bash
# Clone or download the project
cd kolofi

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Database (when integrated)
DATABASE_URL=postgresql://user:password@localhost:5432/kolofi

# Authentication (future)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Payment Processing (future)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Email Service (future)
RESEND_API_KEY=re_...
```

### 3. Database Setup (Optional - for production)

The SQL schema is provided in `scripts/init-db.sql`. To set up:

#### Using PostgreSQL:
```bash
# Create database
createdb kolofi

# Load schema
psql kolofi < scripts/init-db.sql
```

#### Using Supabase:
1. Create a new Supabase project
2. Go to SQL Editor
3. Copy and paste contents of `scripts/init-db.sql`
4. Execute all queries
5. Update `DATABASE_URL` in `.env.local`

#### Using Neon:
1. Create a new Neon project
2. Copy the connection string to `.env.local`
3. Execute the SQL schema through the Neon console

### 4. Test the Application

**Landing Page**: http://localhost:3000
- View features
- See Lottie animation
- Access sign up/login

**Sign Up**: http://localhost:3000/signup
- Create test account
- Redirects to onboarding

**Onboarding**: http://localhost:3000/onboarding
- Complete 4-step setup
- Redirects to dashboard

**Dashboard**: http://localhost:3000/dashboard
- Mock data is pre-populated
- Navigate between sections

**Demo Login**:
- Email: `test@example.com`
- Password: Any value (demo mode)

## Production Deployment

### Vercel Deployment

Kolofi is optimized for Vercel deployment.

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import on Vercel**:
   - Go to vercel.com
   - Click "Add New" → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add all environment variables from `.env.local`

4. **Deploy**:
   - Vercel automatically detects Next.js
   - Deployment starts automatically
   - Access your app at `yourdomain.vercel.app`

### Database Integration

When ready for production, integrate a real database:

#### Option 1: Supabase (Recommended)
1. Create Supabase project at supabase.com
2. Get connection string
3. Update `.env.local`:
   ```
   DATABASE_URL=postgresql://[user]:[password]@[host]:5432/postgres
   ```
4. Run database schema:
   ```bash
   psql $DATABASE_URL < scripts/init-db.sql
   ```

#### Option 2: Neon
1. Create Neon project at neon.tech
2. Copy connection string
3. Use same setup as Supabase

#### Option 3: AWS Aurora
1. Create RDS PostgreSQL instance
2. Note endpoint and credentials
3. Set DATABASE_URL accordingly

### Authentication Setup

#### Current State (Demo)
- Mock authentication in `app/api/auth/`
- Sessions stored in localStorage
- **NOT suitable for production**

#### For Production:
Implement proper authentication using one of:

1. **NextAuth.js** (Recommended):
   ```bash
   pnpm add next-auth
   ```
   - Create `app/api/auth/[...nextauth].ts`
   - Configure with OAuth providers (Google, GitHub)
   - Use secure session cookies

2. **Supabase Auth**:
   - Built-in authentication
   - Magic links, OAuth, password-based
   - Row-level security integration

3. **Custom Implementation**:
   - Hash passwords with bcrypt
   - Implement secure session tokens
   - Use HTTP-only cookies
   - Add rate limiting

### Security Checklist

- [ ] Environment variables set correctly
- [ ] Database passwords secured
- [ ] API keys not exposed in code
- [ ] HTTPS enabled on production
- [ ] CORS configured appropriately
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (use parameterized queries)
- [ ] CSRF protection enabled
- [ ] Security headers configured
- [ ] Regular security audits scheduled

### Performance Optimization

1. **Image Optimization**:
   - Use Next.js Image component
   - Implement lazy loading
   - Optimize image sizes

2. **Code Splitting**:
   - Routes are auto-split by Next.js
   - Dynamic imports for heavy components

3. **Database Optimization**:
   - Add indexes (included in schema)
   - Implement query caching
   - Monitor slow queries

4. **CDN Setup**:
   - Vercel automatically uses Edge Network
   - Images served from Vercel CDN

### Monitoring & Logging

Recommended services:

1. **Error Tracking**: Sentry
   ```bash
   pnpm add @sentry/nextjs
   ```

2. **Analytics**: PostHog or Plausible
   - Track user behavior
   - Monitor conversions

3. **Logging**: LogRocket or Datadog
   - Session replay
   - Performance monitoring

### Backup & Recovery

1. **Database Backups**:
   - Enable automatic backups (provided by services)
   - Test restore procedures
   - Store backups in multiple regions

2. **Code Backup**:
   - GitHub as primary backup
   - Tag releases

## Development Workflow

### Adding New Features

1. Create feature branch:
   ```bash
   git checkout -b feature/savings-analytics
   ```

2. Develop locally:
   ```bash
   pnpm dev
   ```

3. Test thoroughly:
   - Manual testing
   - Cross-browser testing
   - Mobile testing

4. Commit and push:
   ```bash
   git add .
   git commit -m "feat: add savings analytics"
   git push origin feature/savings-analytics
   ```

5. Create pull request on GitHub
6. Merge after review
7. Vercel auto-deploys on merge to main

### Updating Dependencies

```bash
# Check outdated packages
pnpm outdated

# Update all packages
pnpm update

# Update specific package
pnpm add package-name@latest

# Test after updates
pnpm dev
pnpm build
```

## Troubleshooting

### Port Already in Use
```bash
# Find process on port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
pnpm dev -- -p 3001
```

### Database Connection Issues
1. Check DATABASE_URL format
2. Verify credentials
3. Check firewall/network
4. Test connection: `psql $DATABASE_URL`

### Build Failures
```bash
# Clear cache and rebuild
rm -rf .next
pnpm build

# Check for TypeScript errors
pnpm tsc --noEmit
```

### Hot Reload Not Working
1. Clear Next.js cache: `rm -rf .next`
2. Restart dev server: `pnpm dev`
3. Clear browser cache

## Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs

## Support

For issues or questions:
1. Check README.md for overview
2. Review code comments
3. Check GitHub issues
4. Contact development team

---

**Last Updated**: March 2026
**Next Review**: June 2026
