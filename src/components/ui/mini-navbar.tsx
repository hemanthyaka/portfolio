"use client";
import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { getLenis } from '@/lib/lenis';
import resumeFile from '@/assets/files/2026_hemanth.pdf';

const CONTACT_EMAIL = 'yakahemanth3@gmail.com';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

const scrollTo = (href: string) => {
  const target = document.querySelector(href);
  if (!target) return;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target as HTMLElement, { duration: 1.4, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  } else {
    target.scrollIntoView({ behavior: 'smooth' });
  }
};

const Logo = () => {
  return (
    <a
      href="#hero"
      onClick={(e) => {
        e.preventDefault();
        scrollTo('#hero');
      }}
      aria-label="Go to top"
      className="group relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/90 transition-colors duration-200 hover:border-white/30 hover:bg-white/10"
    >
      <span
        aria-hidden="true"
        className="select-none text-[12px] font-semibold tracking-[0.18em] drop-shadow"
        style={{ fontFamily: '"GFS Didot","Playfair Display","EB Garamond",serif' }}
      >
        HY
      </span>
    </a>
  );
};

const AnimatedNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      scrollTo(href);
    }
  }
  return (
    <a
      href={href}
      onClick={handleClick}
      className="group relative inline-block overflow-hidden text-sm"
      style={{ height: '14px', lineHeight: '14px' }}
    >
      <div className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-1/2">
        <span className="block text-white" style={{ height: '14px', lineHeight: '14px' }}>{children}</span>
        <span className="block text-white" style={{ height: '14px', lineHeight: '14px' }}>{children}</span>
      </div>
    </a>
  )
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [itemsVisible, setItemsVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const itemsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const parallax = document.querySelector('#parallax-scene');
    if (!parallax) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(parallax);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (itemsTimerRef.current) clearTimeout(itemsTimerRef.current);
    if (isOpen) {
      itemsTimerRef.current = setTimeout(() => setItemsVisible(true), 250);
    } else {
      setItemsVisible(false);
    }
    return () => { if (itemsTimerRef.current) clearTimeout(itemsTimerRef.current); };
  }, [isOpen]);

  return (
    <nav
      className={`fixed bottom-6 left-1/2 z-50 flex flex-col items-center px-5 py-3 border border-white/10 bg-white/5 backdrop-blur-md w-[calc(100%-2rem)] sm:w-auto`}
      style={{
        borderRadius: isOpen ? '1rem' : '9999px',
        transition: 'border-radius 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease, transform 0.5s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(20px)',
        pointerEvents: visible ? 'auto' : 'none',
        boxShadow:
          '0 0 6px rgba(0,0,0,0.03), 0 2px 6px rgba(0,0,0,0.08), inset 3px 3px 0.5px -3px rgba(255,255,255,0.9), inset -3px -3px 0.5px -3px rgba(255,255,255,0.85), inset 1px 1px 1px -0.5px rgba(255,255,255,0.6), inset -1px -1px 1px -0.5px rgba(255,255,255,0.6), inset 0 0 6px 6px rgba(255,255,255,0.12), inset 0 0 2px 2px rgba(255,255,255,0.06), 0 0 12px rgba(255,255,255,0.15)',
      }}
    >
      {/* backdrop distortion layer — removed, causes turbulence artifacts on navbar */}
      {/* top gloss line */}
      <span className="pointer-events-none absolute inset-x-8 top-[1px] h-px rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      {/* main row */}
      <div className="flex w-full items-center justify-between gap-6 sm:gap-10">
        <Logo />

        {/* desktop links */}
        <div className="hidden sm:flex items-center gap-6">
          {navLinks.map((l) => (
            <AnimatedNavLink key={l.href} href={l.href}>{l.label}</AnimatedNavLink>
          ))}
        </div>

        {/* desktop actions */}
        <div className="hidden sm:flex items-center gap-2">
          <a
            href={resumeFile}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              trackEvent("resume", { source: "navbar_desktop" });
              setTimeout(() => window.open(resumeFile, "_blank"), 150);
            }}
            className="px-4 py-1.5 text-xs whitespace-nowrap border border-white bg-white/5 text-white rounded-full hover:border-white/30 transition-colors duration-200"
          >
            Resume
          </a>
          <div className="relative group">
            <div className="absolute inset-0 -m-2 rounded-full bg-white/10 blur-lg opacity-0 group-hover:opacity-60 transition-all duration-300 pointer-events-none" />
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              onClick={(e) => {
                e.preventDefault();
                trackEvent("hire_me", { source: "navbar_hire_me" });
                setTimeout(() => { window.location.href = `mailto:${CONTACT_EMAIL}`; }, 150);
              }}
              className="relative z-10 inline-flex items-center justify-center px-4 py-1.5 text-xs font-semibold whitespace-nowrap text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-white hover:to-gray-200 transition-all duration-200"
            >
              Hire Me
            </a>
          </div>
        </div>

        {/* mobile hamburger */}
        <button
          className="sm:hidden flex items-center justify-center w-8 h-8 text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* mobile dropdown */}
      <div
        className={`sm:hidden flex flex-col items-center w-full overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 pt-4' : 'max-h-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-4 w-full">
          {navLinks.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => { setIsOpen(false); scrollTo(l.href); }}
              className="text-sm w-full text-center transition-all duration-300 ease-out"
              style={{
                opacity: itemsVisible ? 1 : 0,
                transform: itemsVisible ? 'translateY(0)' : 'translateY(10px)',
                transitionDelay: itemsVisible ? `${i * 50}ms` : '0ms',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex flex-col items-center gap-3 mt-4 w-full">
          {[
            <a
              key="resume"
              href={resumeFile}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                trackEvent("resume", { source: "navbar_mobile" });
                setTimeout(() => window.open(resumeFile, "_blank"), 150);
              }}
              className="w-full px-4 py-2 text-center text-sm whitespace-nowrap border border-white bg-white/5 text-white rounded-full transition-colors duration-200"
            >
              Resume
            </a>,
            <a
              key="hire"
              href={`mailto:${CONTACT_EMAIL}`}
              onClick={(e) => {
                e.preventDefault();
                trackEvent("hire_me", { source: "navbar_hire_me_mobile" });
                setTimeout(() => { window.location.href = `mailto:${CONTACT_EMAIL}`; }, 150);
              }}
              className="w-full px-4 py-2 text-center text-sm font-semibold whitespace-nowrap text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full transition-all duration-200"
            >
              Hire Me
            </a>,
          ].map((btn, i) => (
            <div
              key={i}
              className="w-full transition-all duration-300 ease-out"
              style={{
                opacity: itemsVisible ? 1 : 0,
                transform: itemsVisible ? 'translateY(0)' : 'translateY(10px)',
                transitionDelay: itemsVisible ? `${(navLinks.length + i) * 50}ms` : '0ms',
              }}
            >
              {btn}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
