# Kolofi - Save Smart Together

A modern fintech platform for group savings across Africa. Built with Next.js 16, TypeScript, and Tailwind CSS.

## Overview

Kolofi enables communities to save together with features for:
- **Savings Circles**: Join or create circles with friends and family to save collectively
- **Personal Vaults**: Lock away money for specific financial goals
- **Group Funds**: Pool resources for community projects or business ventures
- **Smart Notifications**: Stay updated on contributions and milestones
- **Analytics Dashboard**: Track savings progress with detailed insights

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Animations**: Lottie animations for engaging visuals
- **Theme**: Dark mode support with next-themes
- **UI Components**: Custom components built on shadcn/ui foundation

## Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout with theme
│   ├── globals.css              # Global styles and design tokens
│   ├── signup/page.tsx          # Sign up page
│   ├── login/page.tsx           # Login page
│   ├── onboarding/page.tsx      # Onboarding flow
│   ├── dashboard/
│   │   ├── layout.tsx           # Dashboard layout with navigation
│   │   ├── page.tsx             # Dashboard home
│   │   ├── circles/page.tsx     # Savings circles
│   │   ├── vaults/page.tsx      # Personal vaults
│   │   ├── funds/page.tsx       # Group funds
│   │   └── profile/page.tsx     # User profile & settings
│   ├── api/auth/
│   │   ├── signup/route.ts      # Sign up API
│   │   └── login/route.ts       # Login API
│
├── components/
│   ├── landing/
│   │   ├── hero.tsx             # Hero section with animation
│   │   ├── features.tsx         # Features showcase
│   │   ├── cta.tsx              # Call to action section
│   │   ├── header.tsx           # Navigation header
│   │   └── footer.tsx           # Page footer
│   ├── auth/
│   │   ├── signup-form.tsx      # Signup form component
│   │   └── login-form.tsx       # Login form component
│   ├── navigation/
│   │   └── bottom-navigation.tsx # Mobile bottom nav
│   ├── ui/                      # shadcn/ui components
│   ├── lottie-animation.tsx     # Lottie player component
│   └── theme-provider.tsx       # Theme provider wrapper
│
├── lib/
│   ├── types.ts                 # TypeScript interfaces
│   ├── constants.ts             # App constants
│   ├── formatting.ts            # Utility formatting functions
│   ├── auth.ts                  # Authentication utilities
│   └── utils.ts                 # General utilities
│
├── public/
│   └── animations/
│       └── hero-animation.json  # Lottie hero animation
│
└── scripts/
    └── init-db.sql              # Database schema
```

## Getting Started

### Prerequisites
- Node.js 18+ with pnpm

### Installation

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Add required packages** (if not auto-installed):
   ```bash
   pnpm add lottie-web next-themes
   ```

3. **Run the development server**:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to see the landing page.

## Key Features

### Design System
- **Color Palette**: Primary green (#22C55E) with neutral backgrounds
- **Typography**: Inter font for body, semantic heading weights
- **Theme Support**: Full light/dark mode with automatic detection
- **Responsive**: Mobile-first design with Tailwind breakpoints

### Authentication
- Sign up with email and password
- Login with form validation
- Mock API endpoints for demonstration
- Session token generation

### Dashboard Features
- **Home**: Overview with stats and recent activity
- **Savings Circles**: Create, join, and manage group savings
- **Vaults**: Individual goal-based savings accounts
- **Group Funds**: Community project funding
- **Profile**: Account management and preferences

### Mobile Experience
- Bottom navigation for mobile users
- Full responsiveness across all pages
- Touch-friendly interface with large tap targets

## Navigation

- **Landing Page** (`/`): Showcases features with hero animation
- **Sign Up** (`/signup`): Create new account
- **Login** (`/login`): Existing user login
- **Onboarding** (`/onboarding`): 4-step setup wizard
- **Dashboard** (`/dashboard`): Main app with nested routes:
  - Circles (`/dashboard/circles`)
  - Vaults (`/dashboard/vaults`)
  - Funds (`/dashboard/funds`)
  - Profile (`/dashboard/profile`)

## Available Scripts

```bash
# Development
pnpm dev          # Run dev server with HMR

# Build
pnpm build        # Production build
pnpm start        # Run production server

# Testing & Linting
pnpm lint         # Run ESLint
```

## Design Tokens

The app uses CSS variables for theming:

**Colors** (Light Mode):
- Background: `#F8FAFC`
- Foreground: `#0F172A`
- Primary: `#22C55E` (green)
- Secondary: `#16A34A` (dark green)
- Muted: `#E2E8F0` (light gray)

**Colors** (Dark Mode):
- Background: `#0F172A`
- Foreground: `#F8FAFC`
- Primary: `#22C55E` (green - unchanged)
- Card: `#1E293B`
- Muted: `#334155`

## Development Guidelines

### Component Structure
- Keep components modular and reusable
- Use TypeScript for type safety
- Follow shadcn/ui patterns
- Implement proper error handling

### State Management
- Use React hooks for local state
- Mock data for demonstration
- Ready for database integration

### Styling
- Use Tailwind classes exclusively
- Leverage design tokens from CSS variables
- Responsive prefixes (md:, lg:, etc.)
- No arbitrary values - use spacing scale

### Forms
- Use shadcn/ui form components
- Implement client-side validation
- Clear error messaging
- Accessible labels and inputs

## Future Enhancements

- [ ] Real database integration (Supabase/Neon)
- [ ] Payment processing integration
- [ ] Real-time notifications
- [ ] Advanced analytics and reporting
- [ ] PWA capabilities (offline support, install prompt)
- [ ] Multi-language support
- [ ] API documentation
- [ ] Unit and integration tests
- [ ] Performance optimizations
- [ ] SEO enhancements

## Demo Account

For testing purposes:
- **Email**: test@example.com
- **Password**: Any password (demo mode accepts any input)

## File Size Notes

- Landing page animation (Lottie JSON) is optimized
- Components are code-split automatically by Next.js
- CSS is optimized via Tailwind's PurgeCSS

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Notes

**Current Implementation** (Demo):
- Mock authentication for demonstration
- Client-side form validation only
- Session tokens stored in localStorage (NOT recommended for production)

**Production Recommendations**:
- Implement proper backend authentication
- Use secure HTTP-only cookies for sessions
- Hash passwords with bcrypt or similar
- Implement CSRF protection
- Add rate limiting on API endpoints
- Validate all inputs server-side

## Performance Tips

1. Images are lazy-loaded where possible
2. Lottie animations are optimized for web
3. Components use React.memo where appropriate
4. CSS is purged of unused styles via Tailwind

## Support & Contributing

For issues, feature requests, or contributions, please reach out through the project repository.

---

**Built with Kolofi** - Save Smart Together. Growing wealth across Africa, one circle at a time.
