# Leverage Academy — Full SEO Audit Report
**Date:** 2026-06-15  
**URL:** http://localhost:3000 (LeverageAcademy.com)  
**Business Type:** EdTech — Private application-based online education (AI systems, business infrastructure). UK market (GBP).  
**Auditor:** Claude SEO (claude-seo v2.2.0)

---

## Overall SEO Health Score: 32 / 100

| Category | Score | Weight | Weighted |
|---|---|---|---|
| Technical SEO | 15/100 | 22% | 3.3 |
| Content Quality (E-E-A-T) | 48/100 | 23% | 11.0 |
| On-Page SEO | 42/100 | 20% | 8.4 |
| Schema / Structured Data | 0/100 | 10% | 0.0 |
| Performance (CWV) | 45/100 | 10% | 4.5 |
| AI Search Readiness | 22/100 | 10% | 2.2 |
| Images | N/A | 5% | 2.5 (default) |
| **TOTAL** | | | **31.9 → 32** |

---

## Executive Summary

Leverage Academy has strong brand identity, compelling copy, and a clear market positioning. However, the site currently has **zero organic search visibility** due to three blocking issues that must be resolved before any other SEO work has impact:

1. **HTTP 500 on every page** — missing Supabase environment variables crash the middleware, making the site completely unindexable.
2. **Homepage renders client-side only** — the `'use client'` directive on `app/page.tsx` means all marketing content is invisible to search crawlers.
3. **No robots.txt or sitemap** — crawlers have no guidance on what to index.

The good news: all three critical issues can be fixed in a single day. Once resolved, the site has solid content fundamentals (strong H1, clear value proposition, FAQ section, founder credibility signals) that will rank well with proper on-page and technical SEO in place.

---

## Top 5 Critical Issues

1. 🔴 **HTTP 500 error on all pages** — site completely unindexable (missing Supabase env vars)
2. 🔴 **`'use client'` on homepage** — all marketing content invisible to search crawlers
3. 🟠 **No sitemap.xml** — crawlers can't discover pages
4. 🟠 **No robots.txt** — no crawl guidance
5. 🟠 **No structured data** — zero rich result eligibility (FAQ, Course, Organization)

## Top 5 Quick Wins

1. ✅ Add `.env.local` with Supabase keys → fixes 500 immediately
2. ✅ Narrow middleware matcher to `/student`, `/admin`, `/apply` only → decouples homepage from Supabase
3. ✅ Create `app/robots.ts` + `app/sitemap.ts` → 20 lines of code, immediate crawl improvement
4. ✅ Add FAQPage JSON-LD → FAQ content already exists, just needs schema wrapper
5. ✅ Add OG/Twitter tags to `layout.tsx` metadata → 5 lines, fixes social sharing

---

## Technical SEO (Score: 15/100)

### ✅ What Works
- `<html lang="en">` — correct language declaration
- `next/font` with `display: swap` for both Fraunces and Inter fonts
- Middleware matcher correctly excludes `_next/static`, `_next/image`, and image assets
- `reactStrictMode: true` in next.config.js

### 🔴 Critical

**HTTP 500 on all pages — site completely unindexable**
- **Evidence:** All requests return 500 with error: `"Your project's URL and Key are required to create a Supabase client"`. The Supabase middleware in `middleware.ts` runs on every non-static request and crashes when env vars are absent.
- **Fix:** Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 🟠 High

**No robots.txt**  
Crawlers request `/robots.txt` and receive a 500 error. Create `app/robots.ts`:
```ts
import { MetadataRoute } from 'next'
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/'] }
    ],
    sitemap: 'https://leverageacademy.com/sitemap.xml',
  }
}
```

**No sitemap.xml**  
Create `app/sitemap.ts`:
```ts
import { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://leverageacademy.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://leverageacademy.com/login', priority: 0.5 },
    { url: 'https://leverageacademy.com/signup', priority: 0.6 },
    { url: 'https://leverageacademy.com/about', priority: 0.8 },
  ]
}
```

**Middleware runs on all routes including public marketing pages**  
`middleware.ts` matcher catches everything except static assets. The homepage should never need auth middleware. This couples public SEO content to Supabase availability.
- **Fix:** Change matcher to: `['/student/:path*', '/admin/:path*', '/apply/:path*', '/api/admin/:path*']`

### 🟡 Medium

**No canonical URL**  
Add to `layout.tsx` metadata:
```ts
export const metadata: Metadata = {
  metadataBase: new URL('https://leverageacademy.com'),
  alternates: { canonical: '/' },
  // ...
}
```

### 🔵 Low
**No favicon** — add `public/favicon.ico` or create `app/icon.tsx`

---

## Content Quality / E-E-A-T (Score: 48/100)

### ✅ What Works
- Founder clearly named: **Khamare Clarke, Founder & Chief Architect**
- Specific credibility numbers: 500+ Systems Built, 50+ Ventures Launched, 8+ Years, £10M+ Revenue
- Strong differentiation copy: "Not courses. Not content. Systems."
- FAQ section with 5 honest, specific answers
- 30-day refund policy stated
- Application-based model signals selectivity/quality

### 🔴 Critical

**Homepage is `'use client'` — all content invisible to crawlers**  
`app/page.tsx` line 1: `'use client'`. This disables Next.js Server-Side Rendering for the entire homepage. The H1, value proposition, FAQ answers, authority section, and all body copy may not be seen by Googlebot.

**Fix:** Convert to Server Component by moving client-only logic out:
```tsx
// app/page.tsx — remove 'use client'
import FloatingNav from '@/components/FloatingNav'
import Hero from '@/components/Hero'
// ... other imports

export default function Home() {
  // This now renders server-side
  return (
    <main>
      <FloatingNav />
      <Hero />
      {/* ... */}
    </main>
  )
}
```
The `motion` animations from framer-motion can stay in child components that have `'use client'` — only the wrappers need to be Server Components.

### 🟠 High

**No author bio or credentials page**  
Khamare Clarke is cited with strong claims but there is no `/about` page, no external proof links, no media mentions. Google's quality raters look for verifiable expertise for YMYL-adjacent content (education, financial outcomes).
- **Fix:** Create `/about` page with bio, verifiable external links (LinkedIn, press mentions, portfolio), and `Person` schema.

**Footer links are placeholder `#` hrefs**  
Privacy, Terms, and Contact all link to `#`. These are legally required pages in most jurisdictions and are quality signals for Google.
- **Fix:** Create `/privacy`, `/terms`, `/contact` pages.

### 🔵 Low
**Copyright year outdated (© 2024)**  
Change `© 2024 Leverage Academy` to `© {new Date().getFullYear()} Leverage Academy`

---

## On-Page SEO (Score: 42/100)

### ✅ What Works
- **H1:** "Build systems. Create leverage. Own the outcome." — strong, unique, on-brand
- **H2 hierarchy maintained:** "A different way to build" → "What you build here" → "Questions"
- **H3s on FAQ and features** — correct nesting
- Section IDs for anchor navigation: `#courses`, `#curriculum`, `#faq`, `#about`
- `<Link>` component used for internal navigation (prefetching enabled)

### 🟠 High

**Title tag missing keywords**  
Current: `Leverage Academy` (17 chars — too short, no keywords)  
Target searches: "AI systems course", "business infrastructure training", "AI education for founders"  
**Fix:** `Leverage Academy | AI Systems & Business Infrastructure Courses for Builders`

**No Open Graph or Twitter Card tags**  
Social shares will show a blank preview. Add to `layout.tsx`:
```ts
export const metadata: Metadata = {
  openGraph: {
    title: 'Leverage Academy | AI Systems for Elite Builders',
    description: 'A private education platform for builders designing AI systems...',
    url: 'https://leverageacademy.com',
    siteName: 'Leverage Academy',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leverage Academy',
    description: 'Build systems. Create leverage. Own the outcome.',
    images: ['/og-image.jpg'],
  },
}
```

### 🟡 Medium

**CTA buttons not linked to crawlable pages**  
"Start Building Your Portfolio", "Explore Full Curriculum", "View Case Studies" are either `<button>` elements or `href="#courses"` anchors. These create no link equity and no crawlable page graph.

**No metadata on inner routes**  
`/login`, `/signup`, `/apply/[courseId]`, `/student/*` all inherit the generic `layout.tsx` title. Each page needs unique metadata.

---

## Schema / Structured Data (Score: 0/100)

**No structured data found anywhere on the site.** This is the highest-ROI area to address after fixing the critical technical issues.

### Priority Schema to Add

**1. Organization (layout.tsx)**
```json
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Leverage Academy",
  "url": "https://leverageacademy.com",
  "founder": {
    "@type": "Person",
    "name": "Khamare Clarke"
  }
}
```

**2. FAQPage (page.tsx FAQSection)**  
All 5 FAQ pairs already exist — just need JSON-LD wrapper. Eligible for Google FAQ rich results immediately.

**3. Course (/apply/[courseId])**  
Each course page should include Course schema with name, description, price, provider.

---

## Performance / Core Web Vitals (Score: 45/100)

### ✅ What Works
- No large images (icon-only UI design eliminates image-related LCP issues)
- `next/font` eliminates render-blocking font requests
- Tailwind CSS minimal bundle size

### 🟠 Medium

**Heavy animation load above the fold**  
The Hero component initialises 6+ simultaneous framer-motion animations on load (`animate-pulse-slow`, `animate-float` ×3, `animate-shimmer` on H1 text, staggered motion.div entries). This increases TBT (Total Blocking Time) and delays LCP.

**H1 starts at `opacity: 0`**  
The main H1 (`Build systems. Create leverage. Own the outcome.`) has `initial={{ opacity: 0, y: 20 }}` — Googlebot's CWV measurement sees a delayed LCP element.

**Client-side course data fetching**  
`CoursesSection.tsx` uses `useEffect` + `fetch('/api/courses')` which delays content and causes layout shift. Convert to a Server Component with `async/await`.

---

## AI Search Readiness / GEO (Score: 22/100)

### ✅ What Works
- Founder attribution (citable by AI systems)
- Clear, quotable value propositions
- FAQ content is structurally citation-friendly

### 🔴 Critical
**Site blocks AI crawlers via 500 error** — same root cause as Technical SEO critical issue.

### 🟡 Medium
**No `/llms.txt`**  
Create `public/llms.txt` to guide AI crawlers:
```
# Leverage Academy - llms.txt
# AI Systems & Business Infrastructure Education

> Leverage Academy is a private education platform for builders designing AI systems, business infrastructure, and digital assets that compound over time.

## Public Content
- /: Homepage with platform overview and courses
- /about: Founder background and credentials
```

---

## Action Plan

### Phase 1 — Day 1 (Unblock the site)
- [ ] Add Supabase env vars to `.env.local` and production hosting
- [ ] Narrow `middleware.ts` matcher to `/student`, `/admin`, `/apply` routes only
- [ ] Remove `'use client'` from `app/page.tsx` and refactor client components

### Phase 2 — Week 1 (Discoverability)
- [ ] Create `app/robots.ts`
- [ ] Create `app/sitemap.ts`
- [ ] Update `layout.tsx` metadata: add `metadataBase`, OG tags, Twitter card, keyword-rich title
- [ ] Add FAQPage JSON-LD to `FAQSection`
- [ ] Add Organization + Person JSON-LD to `layout.tsx`
- [ ] Create `/privacy`, `/terms`, `/contact` pages

### Phase 3 — Weeks 2-3 (Authority)
- [ ] Create `/about` page with verifiable founder credentials
- [ ] Add unique metadata to each route (`/login`, `/signup`, `/apply/[courseId]`)
- [ ] Add `Course` schema to `/apply/[courseId]`
- [ ] Create `public/llms.txt`
- [ ] Fix copyright year to dynamic
- [ ] Link all CTA buttons to real pages

### Phase 4 — Month 2 (Performance & Monitoring)
- [ ] Convert `CoursesSection` to Server Component
- [ ] Reduce above-fold animations for LCP
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Vercel Analytics or GA4
- [ ] Add canonical URL tag

---

*Generated by claude-seo v2.2.0 | 2026-06-15*
