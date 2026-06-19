# Leverage Academy — Claude Instructions

## Project Stack
- **Framework**: Next.js 14 App Router (Server + Client Components)
- **Auth**: Supabase (never suggest alternatives)
- **Payments**: Stripe (never suggest alternatives)
- **Styling**: Tailwind CSS with custom design tokens
- **Animation**: Framer Motion
- **Icons**: Lucide React only — never use emojis as UI icons
- **Language**: TypeScript

## Colour Constraint — CRITICAL
Never change, replace, or introduce alternatives to any colour token. The design system is locked:
- Gold: `text-gold-400`, `bg-gradient-gold`, `border-gold-400`, `shadow-glow-gold`, `shadow-glow-gold-lg`, `bg-gradient-gold-radial`
- Dark: `bg-main-950`, `bg-main-900`, `bg-main-800`
- Type: `text-type-50`, `text-type-100`, `text-type-200`
- Shimmer: `animate-shimmer bg-[length:200%_auto]`

Do not add raw hex values, RGB, or any Tailwind colour not in this list.

## Design System — Spacing Standards
All sections must use these consistent tokens:

| Element | Token |
|---|---|
| Section padding | `py-32 sm:py-40 px-6` |
| Section header bottom margin | `mb-20 sm:mb-28` |
| Badge bottom margin | `mb-10 sm:mb-12` |
| Badge tracking | `tracking-[0.2em]` |
| H2 size cap | `text-4xl sm:text-5xl md:text-7xl` |
| H2 leading/tracking | `leading-[1.0] tracking-[-0.02em]` |
| CTA block top margin | `mt-20 sm:mt-24` |
| Primary button padding | `py-4 sm:py-5 text-sm sm:text-base` |
| Card hover | `whileHover={{ y: -6, scale: 1.01 }}` |
| Card border hover | `hover:border-gold-400/35` |

## Design Rules
- No emojis as icons — use Lucide SVG only
- Background mesh opacity: max `opacity-[0.06]` (higher values cause a brown/warm tint)
- Gold radials: max `opacity-[0.05]` in sections, `opacity-[0.03]` in Hero
- CTAs that scroll to anchor use `motion.a href="#section"` — not `Link + motion.div`
- All primary CTA buttons use `bg-gradient-gold text-black font-bold rounded-xl`
- Secondary buttons use `border border-white/10 hover:border-gold-400/35`
- Container max-width: `!max-w-7xl` (wide sections), `!max-w-3xl` (FAQ/focused reading)

## Windows Environment
- Use `py -3` not `python3` for Python scripts
- `ImageResponse` / Satori (Next.js OG image generation) crashes on this machine — do not create or restore `opengraph-image.tsx` locally; it works on Vercel deployment only
- Do not reference `/og-image.png` in layout metadata

## Code Style
- No comments unless the WHY is non-obvious
- No abstractions beyond what the task requires
- No backward-compatibility hacks or unused variable renames
- No feature flags or shims when the code can just be changed
- Prefer editing existing files over creating new ones
- Never generate or guess URLs

## Response Discipline
- **Be Concise**: When performing bulk edits, do not explain reasoning unless explicitly asked
- **Diff Strategy**: When modifying multiple files, show only the specific lines changed — never output the entire file content
- **Chunking**: If a task requires more than 10 file changes, pause after every 5 files and ask for confirmation before proceeding
- **No Rambling**: If the response is likely to exceed 10k tokens, stop, summarize what has been done, and ask if the user wants to continue

## Owner
Khamare Clarke — Founder & Chief Architect. Non-technical product owner. Keep explanations clear and outcome-focused.
