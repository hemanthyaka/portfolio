"use client";
import { useEffect, useRef, useState } from "react";
import OrbitingSkills from "@/components/ui/orbiting-skills";

const tags = [
  "React.js", "JavaScript", "Integrations", "HTML5", "CSS3", "Tailwind CSS",
  "Material UI", "Bootstrap", "Redux", "Webflow",
  "Git", "GitHub", "shadcn/ui", "21st.dev", "Vite", "Responsive Design", "CSS Animations",
];

export function SkillsSection() {
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
    <section id="skills" ref={ref} className="relative w-full bg-black py-28 md:py-36 px-6 md:px-16 overflow-hidden">
      {/* orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #06B6D4 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #9333EA 0%, transparent 70%)" }} />
      </div>

      {/* grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
          backgroundSize: "5rem 5rem",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* label */}
        <div className="flex items-center gap-3 mb-12" style={anim(0)}>
          <span className="h-px w-8 bg-white/30" />
          <p className="text-xs uppercase tracking-[0.3em] text-gray-100">Skills</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* on mobile: orbit first, text below */}
          <div className="flex items-center justify-center order-1 lg:order-2" style={anim(200)}>
            <OrbitingSkills />
          </div>

          {/* LEFT — text + tags */}
          <div className="flex flex-col gap-8 order-2 lg:order-1">
            <h2
              className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight"
              style={anim(100)}
            >
              Technologies I{" "}
               <span
                className="relative inline-block"
                style={{
                  background: "linear-gradient(135deg,#fff 30%,rgba(255,255,255,0.3))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                work with
              </span>
            </h2>

            <p className="text-gray-300 text-base leading-relaxed" style={anim(200)}>
              Focused entirely on the frontend — building fast, beautiful, and accessible interfaces
              using modern tools and frameworks.
            </p>

            {/* tag cloud */}
            <div className="flex flex-wrap gap-2" style={anim(300)}>
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="relative px-4 py-1.5 rounded-full text-xs text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 cursor-default overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2), inset 2px 2px 0.5px -2px rgba(255,255,255,0.9), inset -2px -2px 0.5px -2px rgba(255,255,255,0.8), inset 1px 1px 1px -0.5px rgba(255,255,255,0.5), inset -1px -1px 1px -0.5px rgba(255,255,255,0.5), inset 0 0 6px 3px rgba(255,255,255,0.05)",
                  }}
                >
                  <span className="pointer-events-none absolute inset-x-2 top-[1px] h-px rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
