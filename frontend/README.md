# EduOS — the student-only academic operating system

A complete, production-grade **landing page + full product UI** for EduOS: a multi-tenant-safe,
student-only academic OS that unifies courses, notes, assignments, quizzes, a planner, analytics
and a RAG-grounded AI tutor.

Built with **Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 3**. No UI kit, no
chart library — every surface, chart and animation is hand-built for a consistent gradient-led
visual language.

---

## Run it

```bash
cd eduos
npm install
npm run dev        # http://localhost:3000  (binds 0.0.0.0)
npm run build      # production build — passes with all 15 routes
npm start          # serve the production build
```

---

## Route map

| Route | What it is | Highlights |
|---|---|---|
| `/` | **Landing page** | Animated hero with live product preview (3 switchable tabs), university marquee, bento feature grid, AI section with a self-typing tutor demo, how-it-works, testimonial marquees, pricing toggle, FAQ accordion, orbit CTA, footer |
| `/login` | Sign in | Split showcase layout, floating stat cards, SSO buttons, inline validation, loading state |
| `/signup` | 2-step sign-up | Password-strength meter, academic profile step, interest chips, privacy panel |
| `/dashboard` | Student home | 4 KPI tiles with sparklines, study-hours chart with hover crosshair, AI daily brief, interactive task list, working focus timer, exam readiness rings, course grid, consistency map, cohort ladder, XP bars |
| `/subjects` | Course list | Summary strip, filter + sort + search, rich course cards (progress ring, attendance, modules, grade) |
| `/subjects/[id]` | Course workspace | 5 tabs — Overview (charts + AI read), Curriculum (accordion modules + lectures), Materials, Assessments (grade forecast), Attendance (donut + weekly breakdown + register) |
| `/materials` | Study materials + **RAG assistant** | 3-pane library / PDF viewer / grounded assistant. Ask a question → streamed answer with page citations → clicking a citation highlights that exact passage in the viewer |
| `/tutor` | AI Academic Tutor | 3-pane chat: conversation history, live chat with **Socratic / Direct / Exam-drill modes**, context panel with source toggles, weak-topic profile, suggested prompts |
| `/assignments` | Assignments | Impact-sorted list, expandable briefs with step checklists, next-deadline tracker, submission health donut, AI sequencing |
| `/quizzes` | Quizzes | In-progress hero, subject/difficulty filters, quiz cards with best-score rings, **working modal quiz runner** (timer, adaptive difficulty, explanations, score screen) |
| `/quizzes/result` | Quiz result | Score hero, per-topic accuracy, answer-rhythm chart, attempt composition donut, you-vs-cohort bars, AI post-mortem, full question log |
| `/planner` | Study planner | **Week grid** (08:00–20:00 × 7 days, absolutely-positioned blocks, today highlighted) + agenda view, workload composition, auto-replan card, block detail, exam runway |
| `/analytics` | Progress & performance | Range switcher, KPI tiles, study-hours/focus chart, accuracy vs cohort, skill radar, 12-week heatmap, GPA trajectory + course forecast, what-changed insights, readiness model |
| `/profile` | Profile & settings | Gradient cover identity card, 6 tabs: Profile, Academic, Goals, Preferences (accent picker, sliders, toggles), Notifications, Data & privacy |

Global navigation also includes a **⌘K command palette** (fuzzy search across pages, subjects,
materials and quizzes), a notification dropdown, and a collapse-able sidebar with an XP/level card.

---

## Design language

**Concept:** dark cosmic canvas, multi-colour gradient accents, glassmorphic panels.
Deliberately *not* plain — every screen has motion, depth and colour, but the type scale, spacing
and radii stay strict so it still reads as one product.

| Token | Value |
|---|---|
| Canvas | `#04050C` → `#12152E` with three fixed radial colour washes |
| Gradient ramp | violet `#7C3AED` → indigo `#4F46E5` → cyan `#22D3EE` → emerald `#10B981`, with amber `#F59E0B` and fuchsia `#EC4899` for alerts/warmth |
| Display type | Sora (600–800), tight `-0.045em` tracking |
| Body type | Plus Jakarta Sans |
| Surfaces | `.glass` / `.panel` — 1px white 9% border, 18px backdrop blur, inset top highlight |
| Elevation | `shadow-glow`, `shadow-lift`, gradient bloom behind hero panels |
| Radii | 12 / 16 / 24 / 32 px — cards are 24px, hero panels 28–32px |
| Motion | `cubic-bezier(0.22, 1, 0.36, 1)` spring, 300–900ms; drift/orbit/marquee/pulse-ring/shimmer keyframes; **all of it respects `prefers-reduced-motion`** |

**Signature effects**
- `aura-border` — animated conic-gradient border rotating via `@property --angle`
- `grad-text` — animated multi-stop gradient text
- `Aurora` — layered drifting orbs + grid + noise, pure CSS
- `CursorSpotlight` — pointer-following gradient light (desktop only, rAF-throttled)
- `TiltCard` — 3D tilt with moving specular highlight
- `Reveal` — IntersectionObserver entrance animation
- `CountUp` — viewport-triggered number roll-up

---

## Architecture

```
eduos/
├─ app/
│  ├─ layout.tsx                 # fonts, metadata, global CSS
│  ├─ globals.css                # design system: tokens, glass, buttons, keyframes
│  ├─ page.tsx                   # landing page composition
│  ├─ login/ · signup/           # standalone auth routes
│  └─ (app)/                     # authenticated shell (sidebar + topbar)
│     ├─ layout.tsx
│     ├─ dashboard/ subjects/[id]/ materials/ tutor/
│     └─ assignments/ quizzes/result/ planner/ analytics/ profile/
├─ components/
│  ├─ app/       AppShell, CommandPalette, PageHeader, TaskList, FocusTimer
│  ├─ ui/        core.tsx (chips, rings, bars, tiles, sparkline…) · charts.tsx
│  ├─ fx/        Aurora, Reveal, TiltCard, Marquee, CountUp, CursorSpotlight
│  ├─ landing/   Nav, Hero, Bento, AISection, Steps, Testimonials, Pricing, FAQ, CTAFooter
│  └─ auth/      AuthLayout
├─ lib/
│  ├─ data.ts    single source of truth for all demo content
│  └─ utils.ts   cn() + tone system (gradient/bar/hex per subject colour)
└─ tailwind.config.ts  # colour ramp, gradients, shadows, keyframes
```

**Chart kit** (`components/ui/charts.tsx`) — `AreaChart` (smooth Catmull-Rom path, gradient fill,
crosshair tooltip, comparison series), `RadarChart`, `Donut`, `GroupBars`, `Heatmap`, `Gauge`,
`StackedBar`. All gradient-aware, all dependency-free.

---

## Swapping in a real backend

Everything renders from `lib/data.ts` — typed objects, no fetching inside presentational
components. To go live:

1. Replace the exports in `lib/data.ts` with `fetch()` calls in server components (or React Query
   in the client components that already hold state).
2. The UI expects these shapes: `Subject`, `Assignment`, `Quiz`, `Material`, `lastQuizResult`,
   `studyTrend`, `accuracyTrend`, `mastery`, `heatmap`, `timetable`, `tasks`, `examCountdown`,
   `leaderboard`, `tutorThread`, `ragThread`.
3. **RAG endpoints** — `materials` needs `POST /materials/{id}/chunks` (ingest + embed) and
   `POST /ask` returning `{ text, points[], cites: [{doc, page}], highlight }`. The viewer already
   highlights the cited passage when `cites[].page` matches the open page.
4. **Tutor** — `POST /tutor/completions` streaming tokens; the client already renders a streaming
   bubble and a typing indicator.

## Notes

- **Student-only by design** — there is no teacher/admin/parent surface anywhere in the IA, copy
  or navigation. That constraint is stated as a product virtue on the landing page.
- **Accessibility** — AA-contrast body text, visible focus rings, semantic landmarks, `aria-hidden`
  on decorative layers, full `prefers-reduced-motion` fallback, keyboard-navigable palette and quiz.
- **Performance** — 103 kB shared JS, ~120-140 kB first load per route, zero chart/icon runtime
  beyond `lucide-react`, fonts self-hosted through `next/font`.
