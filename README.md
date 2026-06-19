# Leverage Academy

A premium, private education platform for builders designing AI systems, business infrastructure, and digital assets that compound over time.

## Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (for subtle animations)
- **Supabase** (Database & Authentication)
- Desktop-first, fully responsive

## Features

- **Role-Based Access Control**: Admin and Student roles with separate dashboards
- **Course Management**: Admins can create, manage, and publish courses
- **Application System**: Students apply to courses, admins review and approve
- **Payment Processing**: Students pay after approval to access courses
- **Lesson Tracking**: Students track progress through course lessons
- **Progress Analytics**: Admins can view student progress and enrollments

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Global styles with Tailwind
├── components/
│   ├── Button.tsx          # Reusable button component (primary/ghost)
│   ├── Card.tsx            # Animated card component
│   ├── Navigation.tsx      # Sticky navigation with blur effect
│   └── Section.tsx         # Section wrapper with depth
└── public/                 # Static assets

```

## Design Principles

- **Software-like, not marketing**: Product-grade UI similar to Google, Stripe, Apple
- **Calm intelligence**: Minimal but powerful, expensive feel
- **Subtle motion**: Purposeful animations with Framer Motion
- **Depth & atmosphere**: Soft glows, generous spacing, restrained design
- **Black & gold palette**: Near-black backgrounds with premium gold accents

## Brand Identity

- **Brand**: Leverage Academy
- **Founder**: Khamare Clarke
- **Philosophy**: Build systems. Create leverage. Own the outcome.
- **Tone**: Quiet authority. Systems thinking. Execution over motivation.

## Color System

- **Backgrounds**: `#000000` → `#0b0b0b` (near-black)
- **Text**: White and soft gray
- **Accent**: Premium gold `#f1cb32`
- **Borders**: White at 6-10% opacity
- **Glows**: Soft radial gold light (very subtle)

## License

© 2024 Leverage Academy. All rights reserved.
