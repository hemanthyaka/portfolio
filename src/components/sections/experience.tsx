"use client";
import { useEffect, useRef, useState } from "react";
import { BriefcaseBusiness, Calendar } from "lucide-react";

type Experience = {
  company: string;
  role: string;
  period: string;
  duration: string;
  current?: boolean;
  points: string[];
};

const glassCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow:
    "0 2px 6px rgba(0,0,0,0.2), inset 3px 3px 0.5px -3px rgba(255,255,255,0.9), inset -3px -3px 0.5px -3px rgba(255,255,255,0.85), inset 1px 1px 1px -0.5px rgba(255,255,255,0.6), inset -1px -1px 1px -0.5px rgba(255,255,255,0.6), inset 0 0 8px 4px rgba(255,255,255,0.06)",
};

function ShimmerPill({
  icon: Icon,
  children,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <span
      className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/10 px-4 py-2 text-xs text-gray-200"
      style={{
        background:
          "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.08) 60%, transparent 80%), linear-gradient(to right, #1a1a1a, #2a2a2a)",
        backgroundSize: "200% auto, 100%",
        animation: "shimmer 3s linear infinite",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 1px 3px rgba(0,0,0,0.4)",
      }}
    >
      <span className="pointer-events-none absolute inset-x-3 top-[1px] h-px rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      {Icon ? <Icon className="h-4 w-4 text-white" /> : null}
      {children}
    </span>
  );
}

export function ExperienceSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const experiences: Experience[] = [
    {
      company: "PhotonX Technologies",
      role: "Frontend Developer",
      period: "Present",
      duration: "1.8+ years",
      current: true,
      points: [
        "Build responsive, accessible UI screens and reusable component patterns.",
        "Collaborate with product and design to ship polished, animation-rich experiences.",
      ],
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
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
    <section
      id="experience"
      ref={ref}
      className="relative w-full overflow-hidden bg-black px-6 py-28 md:px-16 md:py-36"
    >
      {/* orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #38BDF8 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-40 right-0 h-[520px] w-[520px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #A855F7 0%, transparent 70%)" }}
        />
      </div>

      {/* grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
          backgroundSize: "5rem 5rem",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-12 flex items-center gap-3" style={anim(0)}>
          <span className="h-px w-8 bg-white/30" />
          <p className="text-xs uppercase tracking-[0.3em] text-gray-100">Experience</p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h2
              className="text-4xl font-bold tracking-tight text-white leading-tight sm:text-5xl"
              style={anim(100)}
            >
              Experience across{" "}
              <span
                className="relative inline-block"
                style={{
                  background: "linear-gradient(135deg,#fff 30%,rgba(255,255,255,0.3))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                multiple teams
              </span>
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-300" style={anim(200)}>
              I work as a Frontend Developer at{" "}
              <span className="text-white font-medium">PhotonX Technologies</span>, with{" "}
              <span className="text-white font-medium">1.8+ years</span> of experience building
              responsive, accessible, and animation-rich interfaces.
            </p>

            <div className="mt-6 flex flex-wrap gap-3" style={anim(300)}>
              <ShimmerPill icon={BriefcaseBusiness}>Frontend Developer</ShimmerPill>
            </div>
          </div>

          <div className="relative" style={anim(200)}>
            <div
              className="pointer-events-none absolute left-3 top-0 hidden h-full w-px md:block"
              style={{ background: "rgba(255,255,255,0.10)" }}
            />
            <div className="flex flex-col gap-4">
              {experiences.map((exp, idx) => (
                <div key={`${exp.company}-${idx}`} className="relative pl-0 md:pl-10">
                  <div
                    className="absolute left-3 top-7 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white/40 md:block"
                    style={{
                      background: exp.current ? "rgba(34,197,94,0.95)" : "rgba(255,255,255,0.9)",
                      boxShadow: exp.current
                        ? "0 0 10px rgba(34,197,94,0.5), 0 0 22px rgba(34,197,94,0.25)"
                        : "0 0 10px rgba(255,255,255,0.35)",
                    }}
                  />

                  <div
                    className="relative overflow-hidden rounded-2xl p-6"
                    style={{
                      ...glassCard,
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateY(0)" : "translateY(18px)",
                      transition: `opacity 0.7s ease ${260 + idx * 110}ms, transform 0.7s ease ${
                        260 + idx * 110
                      }ms`,
                    }}
                  >
                    <span className="pointer-events-none absolute inset-x-6 top-[1px] h-px rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    <span className="pointer-events-none absolute inset-x-10 bottom-[1px] h-px rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">{exp.company}</p>
                        <p className="mt-1 text-xs text-gray-300">
                          {exp.role} · {exp.period}
                        </p>
                      </div>
                      {exp.current ? (
                        <span
                          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-[10px] uppercase tracking-wider text-green-200"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                          Current
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <ShimmerPill icon={BriefcaseBusiness}>{exp.role}</ShimmerPill>
                      <ShimmerPill icon={Calendar}>{exp.duration}</ShimmerPill>
                    </div>

                    <ul className="mt-4 space-y-2 text-sm text-gray-300">
                      {exp.points.map((p, pi) => (
                        <li key={pi} className="flex gap-3">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
