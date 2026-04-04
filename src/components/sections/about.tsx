"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Code2, Palette, Zap } from "lucide-react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

const stats = [
  { value: "1.8+", label: "Years\nExperience" },
  { value: "10+", label: "Projects\nBuilt" },
  { value: "10+", label: "Happy\nClients" },
  { value: "1.8+", label: "Tech\nMastered" },
];

const traits = [
  { icon: Code2, title: "Clean Code", desc: "Readable, maintainable, and scalable frontend architecture." },
  { icon: Palette, title: "Pixel Perfect", desc: "Every detail matters — from spacing to micro-interactions." },
  { icon: Zap, title: "Performance", desc: "Fast load times and smooth 60fps animations." },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export function AboutSection() {
  const { ref, visible } = useInView();

  const anim = (delay: number, y = 24) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : `translateY(${y}px)`,
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <section
      id="about"
      ref={ref}
      className="relative w-full bg-black py-28 md:py-36 px-6 md:px-16 overflow-hidden"
    >
      {/* animated gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
        />
      </div>

      {/* grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
          backgroundSize: "5rem 5rem",
        }}
      />

      <div className="relative max-w-6xl mx-auto">

        {/* top label row */}
        <div className="flex items-center gap-3 mb-12" style={anim(0)}>
          <span className="h-px w-8 bg-white/30" />
          <p className="text-xs uppercase tracking-[0.3em] text-gray-100">About Me</p>
        </div>

        {/* main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-start">

          {/* LEFT */}
          <div className="flex flex-col gap-8">
            <h2
              className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.1]"
              style={anim(100)}
            >
              I craft digital{" "}
              <span
                className="relative inline-block"
                style={{
                  background: "linear-gradient(135deg,#fff 30%,rgba(255,255,255,0.3))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                experiences
              </span>
              <br />that leave an impression.
            </h2>

            <p className="text-gray-300 text-sm leading-relaxed" style={anim(200)}>
              I'm <span className="text-white font-medium">Hemanth</span>, a Frontend Developer
              passionate about building fast, accessible, and visually stunning web applications.
              I specialise in React, TypeScript, and modern CSS turning complex ideas into
              clean, intuitive interfaces.
            </p>

            <p className="text-gray-300 text-sm text-base leading-relaxed" style={anim(280)}>
              When I'm not pushing pixels, I'm exploring new design systems, contributing to
              open source, or obsessing over micro-interactions that make users smile.
            </p>

            <div style={anim(360)}>
              <LiquidButton
                size="lg"
                className="text-white font-medium tracking-tight"
                onClick={() => {
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push({ event: "contact_click", source: "about_section" });
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="flex gap-1 items-center">
                Get in touch <ArrowUpRight className="w-4 h-4" />
                </div>
              </LiquidButton>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-6">

            {/* stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-2 gap-3">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="group relative rounded-2xl p-5 flex flex-col gap-1 overflow-hidden transition-all duration-300 hover:scale-[1.03]"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2), inset 3px 3px 0.5px -3px rgba(255,255,255,0.9), inset -3px -3px 0.5px -3px rgba(255,255,255,0.85), inset 1px 1px 1px -0.5px rgba(255,255,255,0.6), inset -1px -1px 1px -0.5px rgba(255,255,255,0.6), inset 0 0 8px 4px rgba(255,255,255,0.06)",
                    ...anim(150 + i * 60),
                  }}
                >
                  <span className="pointer-events-none absolute inset-x-3 top-[1px] h-px rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                  <span className="pointer-events-none absolute inset-x-6 bottom-[1px] h-px rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <span className="text-3xl font-bold text-white tracking-tight">{s.value}</span>
                  <span className="text-xs text-gray-300 whitespace-nowrap leading-tight">{s.label}</span>
                </div>
              ))}
            </div>

            {/* trait cards */}
            <div className="flex flex-col gap-3">
              {traits.map((t, i) => {
                const Icon = t.icon;
                return (
                  <div
                    key={i}
                    className="group relative flex items-start gap-4 rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2), inset 3px 3px 0.5px -3px rgba(255,255,255,0.9), inset -3px -3px 0.5px -3px rgba(255,255,255,0.85), inset 1px 1px 1px -0.5px rgba(255,255,255,0.6), inset -1px -1px 1px -0.5px rgba(255,255,255,0.6), inset 0 0 8px 4px rgba(255,255,255,0.06)",
                      ...anim(300 + i * 80),
                    }}
                  >
                    <span className="pointer-events-none absolute inset-x-4 top-[1px] h-px rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                    <span className="pointer-events-none absolute inset-x-8 bottom-[1px] h-px rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <div className="shrink-0 p-2.5 rounded-xl border border-white/10 bg-white/5 group-hover:border-white/20 transition-colors">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white mb-0.5">{t.title}</p>
                      <p className="text-xs text-gray-300 leading-relaxed">{t.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* availability badge */}
            <div
              className="relative inline-flex items-center gap-2 self-start overflow-hidden rounded-full border border-white/10 px-4 py-2 text-xs text-gray-300"
              style={{
                background:
                  "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.08) 60%, transparent 80%), linear-gradient(to right, #1a1a1a, #2a2a2a)",
                backgroundSize: "200% auto, 100%",
                animation: "shimmer 3s linear infinite",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 1px 3px rgba(0,0,0,0.4)",
                ...anim(560),
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Available for freelance work
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
