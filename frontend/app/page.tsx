import Nav from '@/components/landing/Nav';
import Hero from '@/components/landing/Hero';
import Bento from '@/components/landing/Bento';
import AISection from '@/components/landing/AISection';
import Steps from '@/components/landing/Steps';
import Testimonials from '@/components/landing/Testimonials';
import Pricing from '@/components/landing/Pricing';
import FAQ from '@/components/landing/FAQ';
import { FinalCTA, Footer } from '@/components/landing/CTAFooter';
import CursorSpotlight from '@/components/fx/CursorSpotlight';
import Marquee from '@/components/fx/Marquee';

const UNIVERSITIES = [
  'IIT Bombay', 'BITS Pilani', 'NIT Trichy', 'IIIT Hyderabad', 'VIT Vellore', 'DTU', 'Manipal', 'SRM',
  'Amrita', 'PSG Tech', 'COEP', 'Jadavpur', 'Anna University', 'Thapar', 'LNMIIT', 'VIT Chennai',
];

export default function LandingPage() {
  return (
    <div className="relative overflow-x-clip">
      <CursorSpotlight />
      <Nav />
      <Hero />

      {/* university marquee */}
      <section className="border-y border-white/[0.07] bg-ink-950/60 py-7">
        <p className="mb-5 text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
          Students from 400+ campuses already run their semester on EduOS
        </p>
        <Marquee speed="slow">
          {UNIVERSITIES.map((u) => (
            <span
              key={u}
              className="mx-3 whitespace-nowrap font-display text-lg font-bold tracking-tight text-slate-500/70 transition hover:text-slate-200 sm:text-xl"
            >
              {u}
            </span>
          ))}
        </Marquee>
      </section>

      <Bento />
      <AISection />
      <Steps />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
