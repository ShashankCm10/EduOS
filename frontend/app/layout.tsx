import type { Metadata, Viewport } from 'next';
import { Sora, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const display = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700', '800'],
  display: 'swap',
});

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'EduOS — The Academic Operating System for Students',
    template: '%s · EduOS',
  },
  description:
    'EduOS is a student-only academic operating system: your courses, notes, assignments, quizzes, timetable and an AI tutor that actually read your syllabus — in one adaptive workspace.',
  keywords: ['EduOS', 'student app', 'AI tutor', 'study planner', 'RAG over notes', 'academic OS', 'LMS for students'],
  authors: [{ name: 'EduOS' }],
  openGraph: {
    title: 'EduOS — The Academic Operating System for Students',
    description: 'Courses, notes, assignments, quizzes, planner and an AI tutor that read your syllabus.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#04050C',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh selection:bg-violet-500/40">{children}</body>
    </html>
  );
}
