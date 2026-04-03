"use client";
import { useEffect, useRef, useState } from "react";

const ASCII_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]<>;:,._-+=!@#$%^&*";
const genCode = (w: number, h: number) => {
  let out = "";
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) out += ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
    out += "\n";
  }
  return out;
};
const education = [
  {
    degree: "Bachelor's Degree",
    field: "Computer Science",
    institution: "Krishna University",
    year: "2021 – 2024",
    grade: "8.2 CGPA",
    description:
      "Built a foundation in software engineering and modern web development, with hands-on experience in JavaScript and frontend technologies. Currently strengthening data structures and algorithms to improve problem-solving and performance.",
  },
  {
    degree: "Intermediate",
    field: "MPC (Maths, Physics, Chemistry)",
    institution: "PB Siddhartha Junior College",
    year: "2019 – 2021",
    grade: "92%",
    description:
      "Strong academic foundation in mathematics, physics, and chemistry, developing analytical thinking, problem-solving ability, and a disciplined approach to learning.",
  },
];

const loopCards = [...education, ...education, ...education, ...education];

const glassCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow:
    "0 2px 6px rgba(0,0,0,0.2), inset 3px 3px 0.5px -3px rgba(255,255,255,0.9), inset -3px -3px 0.5px -3px rgba(255,255,255,0.85), inset 1px 1px 1px -0.5px rgba(255,255,255,0.6), inset -1px -1px 1px -0.5px rgba(255,255,255,0.6), inset 0 0 8px 4px rgba(255,255,255,0.06)",
};

export function EducationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const posRef = useRef(0);
  const rafRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const asciiMap = useRef<Map<number, string>>(new Map());

  // pre-generate ascii for each card slot
  useEffect(() => {
    loopCards.forEach((_, i) => asciiMap.current.set(i, genCode(52, 14)));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        pausedRef.current = !e.isIntersecting;
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    const SPEED = 0.6;
    const CARD_W = 424; // 400px + 24px gap
    const SET_W = CARD_W * education.length;

    const runScramble = (pre: HTMLElement, id: number) => {
      if (pre.dataset.scrambling === "true") return;
      pre.dataset.scrambling = "true";
      const orig = asciiMap.current.get(id) || "";
      let n = 0;
      const iv = setInterval(() => {
        pre.textContent = genCode(52, 14);
        if (++n >= 12) { clearInterval(iv); pre.textContent = orig; delete pre.dataset.scrambling; }
      }, 30);
    };

    const updateScanEffect = () => {
      // disable on mobile
      if (window.innerWidth < 768) return;
      const containerRect = container.getBoundingClientRect();
      const scanX = containerRect.left + 100;
      const sw = 6;
      let any = false;

      track.querySelectorAll<HTMLElement>(".edu-card").forEach((card, idx) => {
        const r = card.getBoundingClientRect();
        const norm = card.querySelector<HTMLElement>(".card-norm")!;
        const asc  = card.querySelector<HTMLElement>(".card-asc")!;
        const pre  = asc.querySelector<HTMLElement>("pre")!;

        if (r.left < scanX + sw && r.right > scanX - sw) {
          any = true;
          if (card.dataset.scanned !== "true") runScramble(pre, idx % education.length);
          card.dataset.scanned = "true";
          const il = Math.max(scanX - sw - r.left, 0);
          const ir = Math.min(scanX + sw - r.left, r.width);
          norm.style.setProperty("--cr", `${(il / r.width) * 100}%`);
          asc.style.setProperty("--cl", `${(ir / r.width) * 100}%`);
        } else {
          delete card.dataset.scanned;
          if (r.right < scanX - sw) {
            norm.style.setProperty("--cr", "100%");
            asc.style.setProperty("--cl", "100%");
          } else {
            norm.style.setProperty("--cr", "0%");
            asc.style.setProperty("--cl", "0%");
          }
        }
      });
      setIsScanning(any);
    };

    const tick = () => {
      if (!pausedRef.current) {
        posRef.current -= SPEED;
        if (Math.abs(posRef.current) >= SET_W) posRef.current = 0;
        track.style.transform = `translateX(${posRef.current}px)`;
      }
      updateScanEffect();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const anim = (delay: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <section id="education" ref={sectionRef} className="relative w-full bg-black py-28 md:py-36 overflow-hidden">
      <style>{`
        @keyframes glitch{0%,16%,50%,100%{opacity:1}15%,99%{opacity:.9}49%{opacity:.8}}
        .edu-glitch{animation:glitch .1s infinite linear alternate-reverse}
        @keyframes scanPulse{0%{opacity:.75;transform:translateX(-50%) scaleY(1)}100%{opacity:1;transform:translateX(-50%) scaleY(1.04)}}
        .scan-pulse{animation:scanPulse 1.5s infinite alternate ease-in-out}
      `}</style>

      <div className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle,#fff 0%,transparent 70%)" }} />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
          backgroundSize: "5rem 5rem",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 md:px-16">
        <div className="flex items-center gap-3 mb-12" style={anim(0)}>
          <span className="h-px w-8 bg-white/30" />
          <p className="text-xs uppercase tracking-[0.3em] text-gray-200">Education</p>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-16" style={anim(100)}>
          Academic background
        </h2>
      </div>

      {/* mobile: stacked cards */}
      <div className="md:hidden relative max-w-6xl mx-auto px-6 flex flex-col gap-6" style={anim(200)}>
        {education.map((edu, i) => (
          <div key={i} className="relative rounded-2xl overflow-hidden p-8" style={{ ...glassCard }}>
            <span className="pointer-events-none absolute inset-x-6 top-[1px] h-px rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            <span className="pointer-events-none absolute inset-x-10 bottom-[1px] h-px rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">{edu.degree}</h3>
              <span className="text-xs text-gray-400 px-3 py-1 rounded-full whitespace-nowrap"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                {edu.year}
              </span>
            </div>
            <p className="text-sm text-gray-300 mb-1">{edu.field}</p>
            <p className="text-xs text-gray-500 mb-4">{edu.institution}</p>
            <span className="inline-block px-3 py-1 rounded-full text-xs text-gray-300 mb-4"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)" }}>
              {edu.grade}
            </span>
            <p className="text-xs text-gray-500 leading-relaxed">{edu.description}</p>
          </div>
        ))}
      </div>

      {/* desktop: scrolling card stream */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden hidden md:block"
        style={anim(200)}
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
      >
        {/* left/right fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 z-20"
          style={{ background: "linear-gradient(to right,#000,transparent)" }} />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 z-20"
          style={{ background: "linear-gradient(to left,#000,transparent)" }} />

        {/* violet scanner line — desktop only */}
        <div
          className={`scan-pulse absolute top-0 bottom-0 w-0.5 z-30 pointer-events-none transition-opacity duration-300 hidden md:block ${isScanning ? "opacity-100" : "opacity-0"}`}
          style={{
            left: "100px",
            background: "linear-gradient(to bottom,transparent,#a78bfa,transparent)",
            boxShadow: "0 0 10px #a78bfa, 0 0 20px #a78bfa, 0 0 40px #8b5cf6",
          }}
        />

        <div
          ref={trackRef}
          className="flex gap-6 will-change-transform"
          style={{ width: "max-content", padding: "8px 24px" }}
        >
          {loopCards.map((edu, i) => (
            <div key={i} className="edu-card relative w-[400px] shrink-0 rounded-2xl overflow-hidden" style={{ height: "260px" }}>
              {/* normal card layer */}
              <div
                className="card-norm absolute inset-0 rounded-2xl overflow-hidden z-[2]"
                style={{ ...glassCard, clipPath: "inset(0 0 0 var(--cr,0%))" }}
              >
                <span className="pointer-events-none absolute inset-x-6 top-[1px] h-px rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent z-10" />
                <span className="pointer-events-none absolute inset-x-10 bottom-[1px] h-px rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />
                <div className="p-8 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white">{edu.degree}</h3>
                      <span className="text-xs text-gray-400 px-3 py-1 rounded-full whitespace-nowrap"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        {edu.year}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">{edu.field}</p>
                    <p className="text-xs text-gray-300 mb-4">{edu.institution}</p>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{edu.description}</p>
                </div>
              </div>

              {/* ascii layer — desktop only */}
              <div
                className="card-asc absolute inset-0 rounded-2xl overflow-hidden z-[1] bg-black hidden md:block"
                style={{ clipPath: "inset(0 calc(100% - var(--cl,0%)) 0 0)" }}
              >
                <pre
                  className="edu-glitch absolute inset-0 p-4 text-[rgba(220,210,255,0.55)] text-[10px] leading-[14px] overflow-hidden whitespace-pre m-0"
                  style={{ maskImage: "linear-gradient(to right,rgba(0,0,0,1) 0%,rgba(0,0,0,0.6) 60%,rgba(0,0,0,0.1) 100%)" }}
                >
                  {asciiMap.current.get(i % education.length) || ""}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
