"use client";
import { useEffect, useRef, useState } from "react";
import { Code2, Palette, Zap, Globe, Layers, Smartphone } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

const services = [
  {
    icon: Code2,
    title: "Frontend Development",
    description: "Building fast, scalable React & Next.js apps with TypeScript and clean component architecture.",
    points: ["React & Next.js", "TypeScript", "Component Systems", "Performance"],
  },
  {
    icon: Palette,
    title: "UI/UX Implementation",
    description: "Translating Figma designs into pixel-perfect, responsive interfaces with smooth animations.",
    points: ["Figma to Code", "Responsive Design", "Design Systems", "Micro-interactions"],
  },
  {
    icon: Zap,
    title: "Animation & Motion",
    description: "Bringing interfaces to life with purposeful animations using GSAP, Framer Motion, and CSS.",
    points: ["GSAP Animations", "Scroll Triggers", "Page Transitions", "CSS Keyframes"],
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description: "Every interface I build works flawlessly across all screen sizes — mobile, tablet, and desktop.",
    points: ["Mobile First", "Fluid Layouts", "Touch Friendly", "Cross-browser"],
  },
  {
    icon: Layers,
    title: "Component Libraries",
    description: "Building reusable, documented component libraries with shadcn/ui, Radix, and full a11y support.",
    points: ["shadcn/ui", "Radix UI", "21st.dev", "Accessibility"],
  },
  {
    icon: Globe,
    title: "Freelance Projects",
    description: "End-to-end delivery from planning and design to deployment — fast, reliable, and polished.",
    points: ["Project Planning", "Rapid Prototyping", "Deployment", "Ongoing Support"],
  },
];

const gloss: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow:
    "inset 3px 3px 0.5px -3px rgba(255,255,255,0.9), inset -3px -3px 0.5px -3px rgba(255,255,255,0.85), inset 1px 1px 1px -0.5px rgba(255,255,255,0.6), inset -1px -1px 1px -0.5px rgba(255,255,255,0.6), inset 0 0 8px 4px rgba(255,255,255,0.06)",
};

function ServiceCard({ s, i, visible }: { s: typeof services[0]; i: number; visible: boolean }) {
  const [shimmer, setShimmer] = useState(false);
  const Icon = s.icon;

  const handleEnter = () => {
    setShimmer(false);
    // force reflow so animation restarts
    requestAnimationFrame(() => setShimmer(true));
  };
  const handleLeave = () => setShimmer(false);

  return (
    <div
      className="group relative rounded-2xl p-6 overflow-hidden cursor-default transition-all duration-300 hover:scale-[1.02]"
      style={{
        ...gloss,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.97)",
        transition: `opacity 0.6s ease ${200 + i * 80}ms, transform 0.6s ease ${200 + i * 80}ms`,
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* top gloss line */}
      <span className="pointer-events-none absolute inset-x-6 top-[1px] h-px rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      {/* bottom gloss line */}
      <span className="pointer-events-none absolute inset-x-10 bottom-[1px] h-px rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* one-time shimmer sweep */}
      {shimmer && (
        <span
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl"
          style={{
            background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.08) 60%, transparent 80%)",
            backgroundSize: "200% auto",
            animation: "shimmer 0.6s linear forwards",
          }}
          onAnimationEnd={() => setShimmer(false)}
        />
      )}

      {/* icon */}
      <div
        className="inline-flex p-3 rounded-xl mb-5 transition-all duration-300 group-hover:scale-110"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>

      {/* number */}
      <span className="absolute top-5 right-5 text-[10px] font-mono text-white/15">
        0{i + 1}
      </span>

      <h3 className="text-base font-semibold text-white mb-2">{s.title}</h3>
      <p className="text-xs text-gray-300 leading-relaxed mb-5">{s.description}</p>

      <ul className="flex flex-col gap-2">
        {s.points.map((pt, pi) => (
          <li key={pi} className="flex items-center gap-2 text-xs text-gray-300">
            <span className="w-1 h-1 rounded-full shrink-0 bg-white" />
            {pt}
          </li>
        ))}
      </ul>

      {/* bottom scan line on hover */}
      <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)" }} />
    </div>
  );
}

export function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const anim = (delay: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <section id="services" ref={ref} className="relative w-full bg-black py-28 md:py-36 px-6 md:px-16 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.05] -translate-y-1/2"
          style={{ background: "radial-gradient(circle,#fff 0%,transparent 70%)" }} />
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
          backgroundSize: "5rem 5rem",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-12" style={anim(0)}>
          <span className="h-px w-8 bg-white/30" />
          <p className="text-xs uppercase tracking-[0.3em] text-gray-200">Services</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight max-w-lg" style={anim(100)}>
            What I can do{" "}
            <span style={{
              background: "linear-gradient(135deg,#fff 30%,rgba(255,255,255,0.3))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              for you
            </span>
          </h2>
          <div style={anim(200)}>
            <LiquidButton
              size="lg"
              className="text-white font-medium tracking-tight whitespace-nowrap"
              onClick={() => {
                trackEvent("contact_click", { source: "services_section" });
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Start a project
            </LiquidButton>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <ServiceCard key={i} s={s} i={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
