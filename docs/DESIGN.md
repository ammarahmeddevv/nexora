# Nexora — design brief & build spec

## What this is

A **concept landing page** for a **fictional** developer-infrastructure company,
built as a portfolio showpiece to demonstrate design and front-end engineering.
Nexora is not a real product and there is no real client. This is stated in the
README and in the site footer.

## The fictional product

**Nexora** — a durable workflow engine for developers. You write ordinary
functions; Nexora runs them as background jobs, cron schedules and multi-step
pipelines that survive process restarts, retry themselves with backoff, respect
concurrency limits, and record every run so you can replay or inspect it.

Audience: backend and full-stack engineers evaluating infrastructure.
The page's job: make durability feel real and the DX feel pleasant, and get a
"start building" click.

## Design language

Direction is fixed by the brief: **dark, precise, technical.** Within that, the
choices below are specific to *durable execution* rather than the generic
dark-SaaS kit.

### Colour — `src/app/globals.css` `:root`

| Token | Hex | Use |
| --- | --- | --- |
| `--bg` | `#08090C` | page background (cool near-black) |
| `--panel` | `#0E1014` | raised surfaces |
| `--panel-2` | `#14171D` | nested surfaces, code blocks |
| `--line` | `#20242D` | hairline borders |
| `--ink` | `#E7E9EE` | primary text |
| `--ink-dim` | `#8A909E` | secondary text |
| `--iris` | `#6E7BFF` | the one brand accent |
| `--iris-soft` | `#9B8CFF` | accent gradient end / hover |
| `--state-ok` | `#3DD68C` | **state only** — a step succeeded, a metric is healthy |
| `--state-retry` | `#F2B45A` | **state only** — a step is retrying / a warning |
| `--state-run` | `#5AC8F2` | **state only** — a step is running |
| `--paper` | `#F5F6F8` | the single inverted section (pricing) |

Rule: `state-*` colours appear **only** on things that represent a state
(status dots, the run trace, dashboard thresholds). Never as decoration. All
other colour is ink, panel, and `iris`.

### Type

- **IBM Plex Sans** — everything. Weights 400 / 500 / 600. Chosen because the
  Plex superfamily was drawn for technical products and reads cleanly from 13px
  captions to a 72px hero without a second display face.
- **IBM Plex Mono** — code, terminal output, and the run trace's IDs/durations
  (where monospace is *functional* for column alignment). Not used for labels.

Hero headline ~clamp(2.6rem, 6vw, 4.75rem), tight leading (1.02), -0.02em
tracking. Body 16–18px, leading 1.6, measure ≤ 70ch.

Avoid: one-word colour accents in headlines, ALL-CAPS eyebrows, `→` glued to
buttons, `A · B · C` meta strings.

### Layout

- Left-aligned. 12-col grid, max-width 1200px, 24px gutters.
- **Recurring structural motif: a horizontal time axis** — a hairline rule with
  tick marks — used in the hero trace and the "how a run works" section, i.e.
  only where the content is genuinely temporal.
- Sections alternate `--bg` and `--panel` full-bleed bands. **Pricing is the one
  `--paper` (light) section**, giving the page a spine rather than a single mood.
- Corner radius: 10px on panels, 6px on inputs/buttons, 0 on the trace lanes.

### Motion

One orchestrated load sequence (the hero run-trace assembling itself, one step
visibly retrying), and one pinned scroll sequence ("how a run works", the DAG
advancing as you scroll). GSAP + ScrollTrigger, Lenis for smooth scroll. No
per-card fade-up-on-scroll. `prefers-reduced-motion` disables Lenis, the 3D
drift, and all ScrollTrigger tweens (content renders in final state).

## The hero visual

A **live run trace** rendered with React Three Fiber: extruded horizontal lanes
on a faint grid floor, one lane per step of an `order.fulfil` workflow. Steps
fill left-to-right along the time axis; `charge-card` retries (amber pulse and a
`↻ retry 2` tag); `reserve-stock` sleeps (dashed lane); `notify` completes
(iris). Camera drifts very slowly. This is the product itself and is instantly
legible to the audience. Fallback for reduced-motion / no-WebGL: the same trace
as a static SVG.

## Page structure (single route, `/`)

1. **Nav** — wordmark, `Docs` `Pricing` `Changelog`, `Start building` button.
2. **Hero** — headline, sub, `Start building` + copy-able `npm i nexora`, the 3D run trace.
3. **Quickstart** — three-tab code block (define / schedule / deploy) with IBM Plex Mono, copy button.
4. **How a run works** — pinned scroll: a 4-step DAG advances (queued → running → retrying → sleeping → done) with prose on the side.
5. **Features** — six, in a 3×2 grid but each cell is a distinct small treatment, not identical cards: automatic retries, cron & schedules, concurrency & rate limits, full run history, local dev parity, type-safe SDK.
6. **Code showcase** — a longer real `workflow` definition, syntax-highlighted, with an inline annotation callout.
7. **Observability** — a dark dashboard mock: runs table with status dots, a small latency sparkline, a retry-rate figure. Uses `state-*` colours.
8. **Scale** — three figures (p99 dispatch latency, runs/day, regions) with one sentence each. Not the giant-number hero treatment — a restrained row.
9. **Pricing** — the light (`--paper`) section. Three tiers: Hobby / Team / Enterprise. Honest tiering (no crippled free tier, no hidden price — Enterprise says "talk to us" which is normal for infra).
10. **CTA + footer** — final line, `Start building`, and a footer note: *"Nexora is a fictional company. This site is a design and engineering concept by Ammar Ahmed."*

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 · React Three Fiber + drei ·
GSAP (ScrollTrigger) · Lenis. Static-friendly; deployed on Vercel.

## Quality floor

Responsive to 360px (the 3D trace becomes the SVG fallback under ~640px),
visible keyboard focus, `prefers-reduced-motion` respected, WCAG-AA text
contrast, no layout shift, Lighthouse performance ≥ 90 on desktop.
