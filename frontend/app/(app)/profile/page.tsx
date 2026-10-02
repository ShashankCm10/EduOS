'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  UserCog,
  Camera,
  Share2,
  Save,
  Check,
  Flame,
  Trophy,
  Zap,
  GraduationCap,
  Target,
  Bell,
  Palette,
  ShieldCheck,
  Download,
  Trash2,
  Plus,
  CircleCheck,
  Timer,
  Brain,
  Monitor,
  Smartphone,
  KeyRound,
  TriangleAlert,
  Sparkles,
  BookOpen,
  Layers,
  CircleGauge,
} from 'lucide-react';
import PageHeader from '@/components/app/PageHeader';
import Reveal from '@/components/fx/Reveal';
import { Chip, ProgressBar, ProgressRing, Avatar } from '@/components/ui/core';
import { cn } from '@/lib/utils';
import { student, subjects, materials } from '@/lib/data';

type Tab = 'profile' | 'academic' | 'goals' | 'preferences' | 'notifications' | 'privacy';

const ACCENTS = [
  { id: 'violet', label: 'Violet surge', c: 'from-violet-600 to-indigo-500' },
  { id: 'cyan', label: 'Cyan pulse', c: 'from-cyan-400 to-sky-500' },
  { id: 'emerald', label: 'Emerald flow', c: 'from-emerald-400 to-teal-500' },
  { id: 'amber', label: 'Amber dusk', c: 'from-amber-400 to-orange-500' },
  { id: 'pink', label: 'Fuchsia heat', c: 'from-fuchsia-500 to-pink-500' },
  { id: 'aurora', label: 'Full aurora', c: 'from-violet-600 via-fuchsia-500 to-cyan-400' },
];

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>('profile');
  const [accent, setAccent] = useState('violet');
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: student.name,
    email: student.email,
    phone: '+91 98450 21188',
    bio: 'Third-year CSE student. Interested in distributed systems and the maths behind ML. Currently rebuilding my DSA fundamentals.',
    university: 'RV College of Engineering',
    program: student.program,
    semester: String(student.semester),
    roll: student.roll,
    hostel: student.hostel,
    dailyTarget: 4,
    sessionLength: 25,
    difficultyBias: 70,
  });

  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  const [toggles, setToggles] = useState<Record<string, boolean>>({
    deadline: true,
    streak: true,
    aiInsight: true,
    weekly: true,
    quizResult: true,
    plannerReplan: true,
    emailDigest: false,
    pushAll: true,
    sounds: false,
    anim: true,
    compact: false,
    offline: true,
  });
  const flip = (k: string) => setToggles((p) => ({ ...p, [k]: !p[k] }));

  const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: 'profile', label: 'Profile', icon: UserCog },
    { id: 'academic', label: 'Academic', icon: GraduationCap },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Data & privacy', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={
          <>
            <UserCog className="h-3.5 w-3.5" /> Student workspace · {student.roll}
          </>
        }
        title={
          <>
            Profile & <span className="grad-text">Settings</span>
          </>
        }
        sub="Everything EduOS knows about you lives here — and nothing here is ever shared with your institution."
        actions={
          <>
            <button className="btn btn-md btn-ghost">
              <Share2 className="h-4 w-4" /> Share profile card
            </button>
            <button
              onClick={() => {
                setSaved(true);
                setTimeout(() => setSaved(false), 1800);
              }}
              className="btn btn-md btn-primary shine"
            >
              {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {saved ? 'Saved' : 'Save changes'}
            </button>
          </>
        }
      />

      {/* ---------------- identity card ---------------- */}
      <Reveal>
        <div className="panel relative overflow-hidden">
          {/* cover */}
          <div className="relative h-40 sm:h-48">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-700 via-indigo-700 to-cyan-600" />
            <div aria-hidden className="absolute inset-0 grid-bg opacity-25" />
            <div aria-hidden className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-amber-400/25 blur-[90px]" />
            <div aria-hidden className="absolute left-1/3 top-1/2 h-52 w-52 rounded-full bg-fuchsia-500/25 blur-[90px]" />
            <div className="absolute inset-0 noise" />
            <button className="btn btn-sm btn-ghost absolute right-4 top-4 border-white/25 bg-white/10 text-[11.5px]">
              <Camera className="h-3.5 w-3.5" /> Change cover
            </button>
          </div>

          <div className="relative px-5 pb-5 sm:px-7 sm:pb-7">
            <div className="-mt-14 flex flex-wrap items-end gap-5">
              <div className="relative">
                <span className="block rounded-full bg-ink-900 p-1.5">
                  <Avatar name={student.name} size={104} tone="violet" />
                </span>
                <button className="absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-ink-900/90 text-slate-300 transition hover:text-white">
                  <Camera className="h-3.5 w-3.5" />
                </button>
                <span className="absolute -right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-[10px] font-extrabold text-white ring-4 ring-ink-950">
                  {student.level}
                </span>
              </div>

              <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-white">{student.name}</h2>
                  <Chip tone="cyan">{student.handle}</Chip>
                  <Chip tone="emerald">
                    <ShieldCheck className="h-3 w-3" /> Verified student
                  </Chip>
                </div>
                <p className="mt-1.5 text-[13px] text-slate-400">
                  {form.program} · {form.university} · Semester {form.semester}
                </p>
                <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-slate-400">{form.bio}</p>
              </div>

              <div className="flex gap-2 pb-1">
                <Link href="/analytics" className="btn btn-sm btn-ghost">
                  View analytics
                </Link>
                <Link href="/tutor" className="btn btn-sm btn-primary">
                  <Sparkles className="h-3.5 w-3.5" /> Resume with AI
                </Link>
              </div>
            </div>

            {/* stat strip */}
            <div className="mt-6 grid gap-4 border-t border-white/[0.07] pt-5 sm:grid-cols-3 lg:grid-cols-5">
              {[
                { l: 'CGPA', v: student.cgpa, i: GraduationCap, tone: 'text-violet-300' },
                { l: 'Credits earned', v: `${student.creditsEarned}/${student.creditsTotal}`, i: BookOpen, tone: 'text-cyan-300' },
                { l: 'Day streak', v: `${student.streak}d`, i: Flame, tone: 'text-orange-300' },
                { l: 'Cohort rank', v: `#${student.rank}`, i: Trophy, tone: 'text-amber-300' },
                { l: 'Total XP', v: student.xp.toLocaleString(), i: Zap, tone: 'text-emerald-300' },
              ].map((x) => (
                <div key={x.l} className="flex items-center gap-3">
                  <x.i className={cn('h-4 w-4 shrink-0', x.tone)} />
                  <div>
                    <div className="font-display text-[17px] font-extrabold text-white">{x.v}</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">{x.l}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ---------------- tabs ---------------- */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-[12.5px] font-semibold transition-all duration-300',
              tab === t.id ? 'text-white' : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-100'
            )}
          >
            {tab === t.id && <span className="absolute inset-0 rounded-xl border border-white/15 bg-gradient-to-r from-violet-600/80 to-cyan-500/40" />}
            <t.icon className="relative h-3.5 w-3.5" />
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ---------------- panels ---------------- */}
      {tab === 'profile' && (
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr] animate-fade-up">
          <div className="panel p-5 sm:p-6">
            <h3 className="font-display text-[15px] font-bold text-white">Personal details</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Input label="Full name" value={form.name} onChange={(v) => set('name', v)} />
              <Input label="Student email" value={form.email} onChange={(v) => set('email', v)} />
              <Input label="Phone" value={form.phone} onChange={(v) => set('phone', v)} />
              <Input label="Handle" value={student.handle} onChange={() => {}} />
            </div>
            <div className="mt-4">
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Bio</span>
              <textarea
                value={form.bio}
                onChange={(e) => set('bio', e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-white/[0.09] bg-white/[0.035] px-3.5 py-3 text-[13px] text-white transition focus:border-violet-400/60"
              />
              <div className="mt-1.5 text-[10.5px] text-slate-500">Visible only to you. EduOS has no social graph.</div>
            </div>

            <div className="mt-6 border-t border-white/[0.07] pt-5">
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-slate-400">Study identity</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {['GATE 2026', 'Placements', 'Distributed systems', 'ML mathematics', 'Consistent 4h/day'].map((t) => (
                  <span key={t} className="rounded-full border border-violet-400/30 bg-violet-500/[0.1] px-3 py-1.5 text-[11.5px] font-semibold text-violet-200">
                    {t}
                  </span>
                ))}
                <button className="rounded-full border border-dashed border-white/20 px-3 py-1.5 text-[11.5px] font-semibold text-slate-400 transition hover:border-violet-400/50 hover:text-white">
                  <Plus className="mr-1 inline h-3 w-3" /> Add
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="panel p-5">
              <h3 className="font-display text-[15px] font-bold text-white">Workspace at a glance</h3>
              <div className="mt-4 space-y-3">
                {[
                  { l: 'Courses enrolled', v: subjects.length, i: GraduationCap },
                  { l: 'Materials indexed', v: `${materials.length} docs · 402 pages`, i: Layers },
                  { l: 'Materials read', v: '68% average', i: BookOpen },
                  { l: 'Avg. session length', v: '58 minutes', i: Timer },
                  { l: 'Tutor conversations', v: '63 this semester', i: Brain },
                ].map((x) => (
                  <div key={x.l} className="flex items-center gap-3">
                    <x.i className="h-4 w-4 shrink-0 text-slate-500" />
                    <span className="min-w-0 flex-1 text-[12.5px] text-slate-400">{x.l}</span>
                    <span className="shrink-0 text-[12.5px] font-semibold text-white">{x.v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel p-5">
              <h3 className="font-display text-[15px] font-bold text-white">Level progress</h3>
              <div className="mt-4 flex items-center gap-5">
                <ProgressRing
                  value={(student.xp / student.xpToNext) * 100}
                  size={92}
                  stroke={8}
                  from="#F59E0B"
                  to="#EC4899"
                  label={<span className="text-lg">{student.level}</span>}
                  sub="level"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] text-slate-300">
                    <span className="font-bold text-white">{student.xp.toLocaleString()}</span> / {student.xpToNext.toLocaleString()} XP
                  </div>
                  <div className="mt-2">
                    <ProgressBar value={(student.xp / student.xpToNext) * 100} height={6} from="#F59E0B" to="#EC4899" />
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">
                    {(student.xpToNext - student.xp).toLocaleString()} XP to level {student.level + 1} — roughly 4 quizzes
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {['🔥 41-day best', '🎯 12 quizzes aced', '📚 2,481 pages', '⚡ Top 3% XP'].map((b) => (
                  <span key={b} className="rounded-full border border-white/[0.09] bg-white/[0.04] px-2.5 py-1 text-[10.5px] text-slate-300">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'academic' && (
        <div className="grid gap-4 lg:grid-cols-2 animate-fade-up">
          <div className="panel p-5 sm:p-6">
            <h3 className="font-display text-[15px] font-bold text-white">Institution</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Input label="University / College" value={form.university} onChange={(v) => set('university', v)} />
              <Input label="Program" value={form.program} onChange={(v) => set('program', v)} />
              <Input label="Roll number" value={form.roll} onChange={(v) => set('roll', v)} />
              <Input label="Hostel / Room" value={form.hostel} onChange={(v) => set('hostel', v)} />
              <Select label="Current semester" value={form.semester} onChange={(v) => set('semester', v)} options={['1', '2', '3', '4', '5', '6', '7', '8']} />
              <Select label="Grade system" value="10-point CGPA" onChange={() => {}} options={['10-point CGPA', '4-point GPA', 'Percentage']} />
            </div>
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.08] p-3.5">
              <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <p className="text-[11.5px] leading-relaxed text-emerald-100">
                Student email verified. You get Scholar features at 50% off for your first year.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="panel p-5">
              <h3 className="font-display text-[15px] font-bold text-white">Enrolled courses</h3>
              <div className="mt-4 space-y-2">
                {subjects.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">
                    <span className="w-11 shrink-0 font-mono text-[10.5px] text-slate-400">{s.code}</span>
                    <span className="min-w-0 flex-1 truncate text-[12.5px] text-slate-200">{s.title}</span>
                    <span className="shrink-0 text-[11px] text-slate-500">{s.credits} cr</span>
                    <button className="shrink-0 text-[11px] font-semibold text-pink-300 hover:text-pink-200">Remove</button>
                  </div>
                ))}
              </div>
              <button className="btn btn-sm btn-ghost mt-3 w-full">
                <Plus className="h-3.5 w-3.5" /> Add a course
              </button>
            </div>

            <div className="panel p-5">
              <h3 className="font-display text-[15px] font-bold text-white">Assessment weights</h3>
              <p className="mt-0.5 text-[11.5px] text-slate-500">Used to rank your deadlines by real grade impact</p>
              <div className="mt-4 space-y-3">
                {[
                  { l: 'Continuous assessment', v: 40 },
                  { l: 'Mid-semester', v: 20 },
                  { l: 'End-semester', v: 30 },
                  { l: 'Labs & viva', v: 10 },
                ].map((x) => (
                  <div key={x.l}>
                    <div className="flex items-center justify-between text-[11.5px]">
                      <span className="text-slate-400">{x.l}</span>
                      <span className="font-bold text-white">{x.v}%</span>
                    </div>
                    <div className="mt-1.5">
                      <ProgressBar value={x.v} height={5} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'goals' && (
        <div className="space-y-4 animate-fade-up">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { t: 'Crack GATE 2026', d: 'Target: AIR under 500 · exam in Feb 2027', p: 34, tone: '#7C3AED' },
              { t: 'Land a summer internship', d: 'Applied 6 · 2 interviews scheduled', p: 55, tone: '#22D3EE' },
              { t: 'Publish a paper on RAG', d: 'Draft outline done · advisor meeting Thu', p: 22, tone: '#EC4899' },
              { t: 'Hold CGPA above 8.9', d: 'Currently 8.74 · projected 8.91', p: 82, tone: '#10B981' },
              { t: 'Zero missed deadlines', d: '1 slip in 11 submissions', p: 91, tone: '#F59E0B' },
              { t: 'Read 40 pages a week', d: 'Average 34 pages · 68% of material read', p: 68, tone: '#84CC16' },
            ].map((g, i) => (
              <Reveal key={g.t} delay={i * 50}>
                <div className="panel card-hover h-full p-5">
                  <div className="flex items-start justify-between gap-3">
                    <Target className="h-4 w-4 shrink-0" style={{ color: g.tone }} />
                    <Chip tone="default">
                      {g.p}%
                    </Chip>
                  </div>
                  <h3 className="mt-3.5 font-display text-[14.5px] font-bold text-white">{g.t}</h3>
                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-400">{g.d}</p>
                  <div className="mt-4">
                    <ProgressBar value={g.p} height={6} from={g.tone} to="#22D3EE" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="aura-border overflow-hidden rounded-3xl p-[1px]">
              <div className="flex flex-wrap items-center gap-5 rounded-3xl bg-ink-900/85 p-5 backdrop-blur-xl sm:p-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500">
                  <Plus className="h-5 w-5 text-white" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-[15px] font-bold text-white">Add a goal and EduOS will build around it</h3>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-slate-400">
                    Goals are not badges — they are constraints. Adding one immediately re-weights your plan, quizzes and AI drills.
                  </p>
                </div>
                <button className="btn btn-md btn-primary shine">Create goal</button>
              </div>
            </div>
          </Reveal>
        </div>
      )}

      {tab === 'preferences' && (
        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr] animate-fade-up">
          <div className="space-y-4">
            <div className="panel p-5 sm:p-6">
              <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-white">
                <Palette className="h-4 w-4 text-violet-300" /> Appearance
              </h3>
              <p className="mt-1 text-[11.5px] text-slate-500">Pick the gradient accent used across your workspace</p>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
                {ACCENTS.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAccent(a.id)}
                    className={cn(
                      'group rounded-2xl border p-3 text-left transition-all duration-300',
                      accent === a.id ? 'border-white/30 bg-white/[0.07]' : 'border-white/[0.08] bg-white/[0.025] hover:border-white/20'
                    )}
                  >
                    <span className={cn('block h-10 w-full rounded-xl bg-gradient-to-br', a.c)} />
                    <span className="mt-2.5 flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-300">
                      {accent === a.id && <Check className="h-3 w-3 text-cyan-300" />}
                      {a.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-6 space-y-1 border-t border-white/[0.07] pt-4">
                <Row label="Interface animations" sub="Gradient drift, reveals and hover motion" on={toggles.anim} onFlip={() => flip('anim')} />
                <Row label="Compact density" sub="Tighter spacing, more data per screen" on={toggles.compact} onFlip={() => flip('compact')} />
                <Row label="Offline mode" sub="Cache materials and decks on this device" on={toggles.offline} onFlip={() => flip('offline')} />
                <Row label="Interface sounds" sub="Subtle cues for focus session start and completion" on={toggles.sounds} onFlip={() => flip('sounds')} />
              </div>
            </div>

            <div className="panel p-5 sm:p-6">
              <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-white">
                <CircleGauge className="h-4 w-4 text-cyan-300" /> Study engine
              </h3>
              <div className="mt-5 space-y-5">
                <Slider label="Daily study target" value={form.dailyTarget} min={1} max={10} unit="h" onChange={(v) => set('dailyTarget', v)} />
                <Slider label="Focus session length" value={form.sessionLength} min={15} max={60} step={5} unit="min" onChange={(v) => set('sessionLength', v)} />
                <Slider label="Difficulty bias" value={form.difficultyBias} min={0} max={100} unit="%" onChange={(v) => set('difficultyBias', v)} />
              </div>
              <div className="mt-5 flex flex-wrap gap-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5 text-[11.5px] text-slate-400">
                <Sparkles className="h-4 w-4 shrink-0 text-violet-300" />
                A {form.difficultyBias}% difficulty bias means quizzes serve hard questions more often. At your accuracy (87%) the engine
                recommends 65–75%.
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="panel p-5">
              <h3 className="font-display text-[15px] font-bold text-white">Connected devices</h3>
              <div className="mt-4 space-y-2.5">
                {[
                  { l: 'MacBook Air · Chrome', s: 'this device · active now', i: Monitor, on: true },
                  { l: 'iPad Air · Safari', s: 'offline cache synced 2h ago', i: Smartphone, on: true },
                  { l: 'Pixel 8 · EduOS app', s: 'last seen yesterday', i: Smartphone, on: false },
                ].map((d) => (
                  <div key={d.l} className="flex items-center gap-3.5 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5">
                    <d.i className="h-4 w-4 shrink-0 text-slate-400" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12.5px] font-semibold text-slate-200">{d.l}</div>
                      <div className="text-[10.5px] text-slate-500">{d.s}</div>
                    </div>
                    {d.on ? <Chip tone="emerald">Active</Chip> : <button className="text-[11px] font-semibold text-slate-400 hover:text-white">Revoke</button>}
                  </div>
                ))}
              </div>
            </div>

            <div className="panel p-5">
              <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-white">
                <KeyRound className="h-4 w-4 text-amber-300" /> Security
              </h3>
              <div className="mt-4 space-y-3 text-[12.5px]">
                {[
                  { l: 'Two-factor authentication', v: 'Enabled · authenticator app', ok: true },
                  { l: 'Password last changed', v: '42 days ago', ok: true },
                  { l: 'Recovery email', v: 'Set', ok: true },
                  { l: 'Login alerts', v: 'On for new devices', ok: true },
                ].map((x) => (
                  <div key={x.l} className="flex items-center justify-between gap-4">
                    <span className="text-slate-400">{x.l}</span>
                    <span className="flex shrink-0 items-center gap-1.5 font-semibold text-white">
                      <CircleCheck className="h-3.5 w-3.5 text-emerald-400" /> {x.v}
                    </span>
                  </div>
                ))}
              </div>
              <button className="btn btn-sm btn-ghost mt-4 w-full">Change password</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'notifications' && (
        <div className="grid gap-4 lg:grid-cols-2 animate-fade-up">
          <div className="panel p-5 sm:p-6">
            <h3 className="font-display text-[15px] font-bold text-white">Study alerts</h3>
            <p className="mt-1 text-[11.5px] text-slate-500">EduOS sends fewer, better-timed notifications than most apps — by design</p>
            <div className="mt-4 space-y-1 border-t border-white/[0.07] pt-4">
              <Row label="Deadline reminders" sub="Scaled to the grade weight of each submission" on={toggles.deadline} onFlip={() => flip('deadline')} />
              <Row label="Streak nudges" sub="Only when your streak is genuinely at risk" on={toggles.streak} onFlip={() => flip('streak')} />
              <Row label="AI insights" sub="Weak-topic alerts and readiness drops" on={toggles.aiInsight} onFlip={() => flip('aiInsight')} />
              <Row label="Auto-replan notices" sub="When the planner reshuffles your week" on={toggles.plannerReplan} onFlip={() => flip('plannerReplan')} />
              <Row label="Quiz result summaries" sub="Instant breakdown after each attempt" on={toggles.quizResult} onFlip={() => flip('quizResult')} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="panel p-5 sm:p-6">
              <h3 className="font-display text-[15px] font-bold text-white">Channels</h3>
              <div className="mt-4 space-y-1">
                <Row label="Push notifications" sub="All devices with EduOS installed" on={toggles.pushAll} onFlip={() => flip('pushAll')} />
                <Row label="Weekly email digest" sub="Sunday 18:00 · plan + progress summary" on={toggles.emailDigest} onFlip={() => flip('emailDigest')} />
              </div>
              <div className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Quiet hours</div>
                <div className="mt-2 flex items-center gap-3 text-[12.5px] text-slate-300">
                  <span className="font-mono">22:30</span>
                  <span className="text-slate-600">→</span>
                  <span className="font-mono">07:00</span>
                  <Chip tone="violet" className="ml-auto">
                    protects your sleep
                  </Chip>
                </div>
              </div>
            </div>

            <div className="panel p-5">
              <h3 className="font-display text-[15px] font-bold text-white">Preview</h3>
              <div className="mt-4 space-y-2.5">
                {[
                  { t: 'CN lab is 4 days overdue', s: '15% of your CN grade · 90 min to clear', tone: 'from-pink-500 to-rose-600', when: 'now' },
                  { t: 'Your plan was rebuilt for tomorrow', s: '2 blocks moved, 1 drill added', tone: 'from-violet-500 to-indigo-600', when: '2h' },
                ].map((n) => (
                  <div key={n.t} className="flex gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5">
                    <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white', n.tone)}>
                      <Bell className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[12.5px] font-semibold text-white">{n.t}</div>
                      <div className="text-[11px] text-slate-400">{n.s}</div>
                    </div>
                    <span className="ml-auto shrink-0 text-[10px] text-slate-500">{n.when}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'privacy' && (
        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr] animate-fade-up">
          <div className="panel p-5 sm:p-6">
            <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-white">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Your data, your rules
            </h3>
            <div className="mt-4 space-y-3">
              {[
                { t: 'No institutional access', d: 'Your college, teachers and admin have no read access to anything in EduOS. There is no admin dashboard to grant.' },
                { t: 'No model training on your notes', d: 'Uploaded material is used only to answer your own questions. It is never used to train public models.' },
                { t: 'Page-level isolation', d: 'Each account is a separate encrypted store. Retrieval cannot cross accounts, even by accident.' },
                { t: 'Full portability', d: 'Export every note, deck, quiz attempt and AI conversation as Markdown or PDF at any time.' },
              ].map((x) => (
                <div key={x.t} className="flex gap-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.028] p-4">
                  <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <div>
                    <div className="text-[13px] font-semibold text-white">{x.t}</div>
                    <div className="mt-1 text-[11.5px] leading-relaxed text-slate-400">{x.d}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-white/[0.07] pt-5">
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-slate-400">Export</h4>
              <div className="mt-3 flex flex-wrap gap-2.5">
                <button className="btn btn-sm btn-ghost">
                  <Download className="h-3.5 w-3.5" /> All materials (.zip)
                </button>
                <button className="btn btn-sm btn-ghost">
                  <Download className="h-3.5 w-3.5" /> Quiz history (.csv)
                </button>
                <button className="btn btn-sm btn-ghost">
                  <Download className="h-3.5 w-3.5" /> AI conversations (.md)
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="panel p-5">
              <h3 className="font-display text-[15px] font-bold text-white">Storage</h3>
              <div className="mt-4">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-slate-400">2.1 GB of 10 GB used</span>
                  <span className="font-semibold text-white">21%</span>
                </div>
                <div className="mt-2">
                  <ProgressBar value={21} height={8} />
                </div>
                <div className="mt-3 space-y-2 text-[11.5px]">
                  {[
                    { l: 'Materials', v: '1.8 GB' },
                    { l: 'Decks & exports', v: '210 MB' },
                    { l: 'Conversations', v: '90 MB' },
                  ].map((x) => (
                    <div key={x.l} className="flex items-center justify-between">
                      <span className="text-slate-400">{x.l}</span>
                      <span className="font-semibold text-white">{x.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="panel border-pink-400/25 p-5">
              <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-white">
                <TriangleAlert className="h-4 w-4 text-pink-400" /> Danger zone
              </h3>
              <div className="mt-4 space-y-3">
                <button className="btn btn-sm btn-ghost w-full justify-between">
                  Clear AI tutor memory <span className="text-[11px] text-slate-500">Resets personalisation</span>
                </button>
                <button className="btn btn-sm w-full justify-between border border-pink-400/30 bg-pink-500/[0.1] text-pink-200 hover:bg-pink-500/[0.18]">
                  <Trash2 className="h-3.5 w-3.5" /> Delete workspace
                </button>
              </div>
              <p className="mt-3 text-[10.5px] leading-relaxed text-slate-500">
                Deletion is immediate and irreversible, including materials, decks and quiz history. Exports are yours to keep.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- small inputs ---------------- */
function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-white/[0.09] bg-white/[0.035] px-3.5 text-[13px] text-white transition focus:border-violet-400/60 focus:bg-white/[0.06]"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-white/[0.09] bg-ink-800/80 px-3.5 text-[13px] text-white"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function Row({ label, sub, on, onFlip }: { label: string; sub: string; on: boolean; onFlip: () => void }) {
  return (
    <div className="flex items-center gap-4 rounded-xl px-1 py-3 transition hover:bg-white/[0.02]">
      <div className="min-w-0 flex-1">
        <div className="text-[12.5px] font-semibold text-slate-200">{label}</div>
        <div className="text-[11px] text-slate-500">{sub}</div>
      </div>
      <button
        onClick={onFlip}
        aria-pressed={on}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full border transition-all duration-300',
          on ? 'border-transparent bg-gradient-to-r from-violet-600 to-cyan-500' : 'border-white/12 bg-white/[0.06]'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white shadow transition-all duration-300',
            on ? 'left-[22px]' : 'left-0.5'
          )}
          style={{ width: 18, height: 18 }}
        />
      </button>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-[12px]">
        <span className="font-semibold text-slate-200">{label}</span>
        <span className="font-display text-[14px] font-bold text-white">
          {value}
          <span className="ml-0.5 text-[11px] text-slate-400">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full"
      />
      <div className="mt-1 flex justify-between text-[10px] text-slate-500">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
}
