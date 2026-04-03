"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ExternalLink, GitFork, Mail } from "lucide-react";

const CONTACT = {
  email: "yakahemanth3@gmail.com",
  github: "https://github.com/hemanthyaka",
  linkedin: "https://www.linkedin.com/in/yaka-hemanth-ba111227a/",
};

const gloss: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow:
    "inset 3px 3px 0.5px -3px rgba(255,255,255,0.9), inset -3px -3px 0.5px -3px rgba(255,255,255,0.85), inset 1px 1px 1px -0.5px rgba(255,255,255,0.5), inset -1px -1px 1px -0.5px rgba(255,255,255,0.5), inset 0 0 6px 3px rgba(255,255,255,0.04)",
};

export function ContactSection() {
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
    <section id="contact" ref={ref} className="relative w-full bg-black py-28 md:py-36 px-6 md:px-16 overflow-hidden">
      {/* orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle,#fff 0%,transparent 70%)" }} />
      </div>
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
          <p className="text-xs uppercase tracking-[0.3em] text-gray-200">Contact</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* LEFT — info */}
          <div className="flex flex-col gap-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight" style={anim(100)}>
              Let's build something{" "}
              <span style={{
                background: "linear-gradient(135deg,#fff 30%,rgba(255,255,255,0.3))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                great together
              </span>
            </h2>

            <p className="text-gray-300 text-base leading-relaxed" style={anim(200)}>
              Have a project in mind or just want to say hi? My inbox is always open. I'll get back to you within 24 hours.
            </p>

            {/* availability */}
            <div
              className="relative inline-flex items-center gap-2 self-start overflow-hidden rounded-full border border-white/10 px-4 py-2 text-xs text-gray-300"
              style={{
                background:
                  "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.08) 60%, transparent 80%), linear-gradient(to right, #1a1a1a, #2a2a2a)",
                backgroundSize: "200% auto, 100%",
                animation: "shimmer 3s linear infinite",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 1px 3px rgba(0,0,0,0.4)",
                ...anim(500),
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Available for new projects
            </div>
          </div>

          {/* quick links */}
            <div className="flex flex-col gap-3" style={anim(400)}>
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: CONTACT.email,
                  href: `mailto:${CONTACT.email}`,
                },
                {
                  icon: ExternalLink,
                  label: "LinkedIn",
                  value: "Connect with me",
                  href: CONTACT.linkedin,
                },
                {
                  icon: GitFork,
                  label: "GitHub",
                  value: "See my work",
                  href: CONTACT.github,
                },
              ].map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group relative flex items-center justify-between gap-4 rounded-2xl p-4 overflow-hidden transition-all duration-300 hover:scale-[1.01]"
                  style={gloss}
                >
                  <span className="pointer-events-none absolute inset-x-6 top-[1px] h-px rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  <div className="flex items-center gap-3">
                    <div
                      className="shrink-0 rounded-xl p-2.5"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">{label}</p>
                      <p className="truncate text-xs text-gray-300">{value}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-400 transition-colors group-hover:text-white" />
                </a>
              ))}
            </div>
        </div>
      </div>
    </section>
  );
}
