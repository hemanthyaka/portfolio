"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import affirmedAiImage from "@/assets/projects/affirmed-ai.png";
import bpcImage from "@/assets/projects/bpc.png";
import fashionImage from "@/assets/projects/fashion.png";
import kgfImage from "@/assets/projects/kgf.png";
import meeamiImage from "@/assets/projects/meeami.png";
// import portfolioImage from "@/assets/projects/portfolio.png";

type Project = {
  title: string;
  description: string;
  highlights: string[];
  tags: string[];
  live: string | null;
  github: string;
  image: string;
};

const hasLiveLink = (href: string | null | undefined) =>
  Boolean(href && href.trim().length > 0 && href !== "#");

const projects: Project[] = [
  {
    title: "Affirmed AI (AI-Powered Vulnerability Management Platform)",
    description:
      "Enterprise vulnerability management frontend with scalable UI architecture and data-heavy dashboard workflows.",
    highlights: [
      "Developed the user interface for an enterprise vulnerability management platform built on DefectDojo.",
      "Built responsive, data-heavy dashboards and management screens using React and Material UI (MUI).",
      "Created reusable MUI-based components and layouts to handle large tables, filters, and detailed vulnerability views.",
      "Implemented consistent theming and design patterns to support scalable and maintainable frontend architecture.",
    ],
    tags: ["React", "TypeScript", "Material UI"],
    live: null,
    github: "#",
    image: affirmedAiImage,
  },
  {
    title: "Baptist Health",
    description:
      "Healthcare and pharmacist workflow frontend focused on synchronized state, modular dashboards, and scalable architecture.",
    highlights: [
      "Implemented application-wide state management to synchronize data and interactions across interconnected panels.",
      "Built complex, responsive dashboards and workflows using React and Material UI (MUI) for dynamic healthcare datasets.",
      "Created reusable, composable UI components enabling consistent behavior across tables, filters, detail views, and edit flows.",
      "Structured scalable frontend architecture to support cross-panel communication, navigation, and real-time UI updates.",
    ],
    tags: ["React", "Material UI", "TypeScript",],
    live: null,
    github: "#",
    image: bpcImage,
  },
  {
    title: "Fashion E-Commerce",
    description:
      "A responsive e-commerce frontend focused on discoverability, fast browsing, and smooth checkout interactions.",
    highlights: [
      "Developed category, product detail, cart, and checkout interfaces with consistent responsive behavior.",
      "Built reusable UI patterns for filters, sort controls, product cards, and promotional sections.",
      "Implemented optimized image loading and skeleton states for faster perceived performance.",
      "Created scalable component architecture to support rapid campaign and catalog updates.",
    ],
    tags: ["React", "TypeScript", "Tailwind", "21st Dev"],
    live: "https://srigayatrifashions.vercel.app/",
    github: "#",
    image: fashionImage,
  },
  {
   title: "KGF",
description:
  "Built a digital platform for Kamma Global Federation (KGF) to unify and empower a global community of Kammas, Kammardukas, and Chowdary families. Designed a scalable frontend with clear information hierarchy, enabling networking, cultural engagement, and professional collaboration.",
    highlights: [
      "Built responsive landing and detail pages with animation-driven storytelling sections.",
      "Implemented reusable media components for banners, highlights, cast blocks, and timelines.",
      "Optimized layout rendering and transitions to maintain smooth UI performance across devices.",
      "Structured frontend code for maintainability with reusable sections and shared style primitives.",
    ],
    tags: ["React", "TypeScript", "MUI", "Responsive UI"],
    live: "https://kammaglobal.com/",
    github: "#",
    image: kgfImage,
  },
  {
    title: "Meeami Technologies",
    description:
      "A modern product-style website frontend with strong visual branding and polished interactions.",
    highlights: [
      "Designed and implemented modular sections for hero, offerings, testimonials, and contact conversion.",
      "Created reusable typography and spacing systems to keep design consistency across all pages.",
      "Added interaction states and subtle motion to improve user engagement and perceived quality.",
      "Ensured accessibility and responsiveness across mobile, tablet, and desktop breakpoints.",
    ],
    tags: ["Webflow"],
    live: "https://www.meeamitech.com/",
    github: "#",
    image: meeamiImage,
  },
  // {
  //   title: "Portfolio Website",
  //   description:
  //     "A personal frontend portfolio highlighting projects, skills, and experience with modern visual effects.",
  //   highlights: [
  //     "Built responsive sections for hero, about, skills, projects, and contact with smooth scroll navigation.",
  //     "Implemented reusable glassmorphism components and animation patterns for a cohesive UI language.",
  //     "Integrated scalable component structure using React, TypeScript, and utility-first styling.",
  //     "Optimized responsiveness and interaction performance for polished cross-device experience.",
  //   ],
  //   tags: ["React", "TypeScript", "Tailwind", "GSAP", "Vite"],
  //   live: "#",
  //   github: "#",
  //   image: portfolioImage,
  // },
];

const glassCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow:
    "0 2px 6px rgba(0,0,0,0.2), inset 3px 3px 0.5px -3px rgba(255,255,255,0.9), inset -3px -3px 0.5px -3px rgba(255,255,255,0.85), inset 1px 1px 1px -0.5px rgba(255,255,255,0.6), inset -1px -1px 1px -0.5px rgba(255,255,255,0.6), inset 0 0 8px 4px rgba(255,255,255,0.06)",
};

function ProjectCard({
  project,
  index,
  visible,
}: {
  project: Project;
  index: number;
  visible: boolean;
}) {
  const isLeft = index % 2 === 0;

  return (
    <div
      className={`relative flex w-full items-center gap-0 md:gap-8 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      } flex-col`}
    >
      <div
        className="relative w-full overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-[1] md:w-[calc(50%-2rem)]"
        style={{
          ...glassCard,
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateY(0)"
            : `translateY(30px) translateX(${isLeft ? "-20px" : "20px"})`,
          transition: `opacity 0.7s ease ${index * 150}ms, transform 0.7s ease ${index * 150}ms`,
        }}
      >
        <span className="pointer-events-none absolute inset-x-6 top-[1px] h-px rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        <span className="pointer-events-none absolute inset-x-10 bottom-[1px] h-px rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="-mx-0 mb-4 h-44 w-full overflow-hidden rounded-xl">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover brightness-90"
            loading="lazy"
          />
        </div>

        <div className="mb-3 flex items-start justify-between">
          <span className="font-mono text-md text-gray-300">
            {index + 1 < 10 ? `0${index + 1}` : index + 1}
          </span>
          <div className="flex gap-2">
            {/* <a
              href={project.github}
              className="rounded-full p-1.5 text-gray-500 transition-colors hover:text-white"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <GitFork className="h-3.5 w-3.5" />
            </a> */}
            {hasLiveLink(project.live) && (
              <a
                href={project.live ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-1.5 text-gray-500 transition-colors hover:text-white"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>

        <h3 className="mb-2 text-base font-semibold text-white">{project.title}</h3>
        <p className="mb-4 overflow-hidden text-xs leading-relaxed text-gray-300 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((t, i) => (
            <span
              key={i}
              className="relative overflow-hidden rounded-full px-2.5 py-1 text-[10px] text-gray-400"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "inset 1px 1px 0.5px -1px rgba(255,255,255,0.6)",
              }}
            >
              <span className="pointer-events-none absolute inset-x-1 top-[1px] h-px rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="z-10 hidden w-16 shrink-0 items-center justify-center md:flex">
        <div
          className="h-3 w-3 rounded-full border-2 border-white/40 transition-all duration-500"
          style={{
            background: visible ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.1)",
            boxShadow: visible
              ? "0 0 12px rgba(255,255,255,0.6), 0 0 24px rgba(255,255,255,0.2)"
              : "none",
            transitionDelay: `${index * 150 + 200}ms`,
          }}
        />
      </div>

      <div className="hidden w-[calc(50%-2rem)] md:block" />
    </div>
  );
}

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [lineHeight, setLineHeight] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const windowH = window.innerHeight;
      const scrolled = windowH - rect.top;
      const total = rect.height + windowH;
      const pct = Math.max(0, Math.min(100, (scrolled / total) * 100));
      setLineHeight(pct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const anim = (delay: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black px-6 py-28 md:px-16 md:py-36"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle,#fff 0%,transparent 70%)" }}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
          backgroundSize: "5rem 5rem",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-12 flex items-center gap-3" style={anim(0)}>
          <span className="h-px w-8 bg-white/30" />
          <p className="text-xs uppercase tracking-[0.3em] text-gray-200">Projects</p>
        </div>
        <h2
          className="mb-20 text-4xl font-bold tracking-tight text-white md:text-5xl"
          style={anim(100)}
        >
          Things I've built
        </h2>

        <div ref={trackRef} className="relative">
          <div
            className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 md:block"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />

          <div
            ref={lineRef}
            className="absolute left-1/2 top-0 hidden w-px -translate-x-1/2 origin-top transition-none md:block"
            style={{
              height: `${lineHeight}%`,
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.15))",
              boxShadow: "0 0 8px rgba(255,255,255,0.3)",
            }}
          />

          <div
            className="absolute bottom-0 left-4 top-0 w-px md:hidden"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
          <div
            className="absolute left-4 top-0 w-px origin-top md:hidden"
            style={{
              height: `${lineHeight}%`,
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.15))",
            }}
          />

          <div className="flex flex-col gap-12 md:gap-16">
            {projects.map((p, i) => (
              <div key={i} className="md:contents">
                <div className="flex items-start gap-6 pl-10 md:hidden">
                  <div
                    className="absolute left-[13px] mt-5 h-2.5 w-2.5 rounded-full border-2 border-white/40"
                    style={{
                      background: visible
                        ? "rgba(255,255,255,0.9)"
                        : "rgba(255,255,255,0.1)",
                      boxShadow: visible ? "0 0 8px rgba(255,255,255,0.5)" : "none",
                      transition: `all 0.5s ease ${i * 150 + 200}ms`,
                    }}
                  />
                  <div
                    className="relative w-full overflow-hidden rounded-2xl p-6"
                    style={{
                      ...glassCard,
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateY(0)" : "translateY(20px)",
                      transition: `opacity 0.7s ease ${i * 150}ms, transform 0.7s ease ${i * 150}ms`,
                    }}
                  >
                    <span className="pointer-events-none absolute inset-x-6 top-[1px] h-px rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent" />

                    <div className="mb-4 h-40 w-full overflow-hidden rounded-xl">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="h-full w-full object-cover brightness-90"
                        loading="lazy"
                      />
                    </div>

                    <div className="mb-3 flex items-start justify-between">
                      <span className="font-mono text-xs text-gray-300">
                        {i + 1 < 10 ? `0${i + 1}` : i + 1}
                      </span>
                      <div className="flex gap-2">
                        {/* <a
                          href={p.github}
                          className="rounded-full p-1.5 text-gray-500 transition-colors hover:text-white"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                          }}
                        >
                          <GitFork className="h-3.5 w-3.5" />
                        </a> */}
                        {hasLiveLink(p.live) && (
                          <a
                            href={p.live ?? undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full p-1.5 text-gray-500 transition-colors hover:text-white"
                            style={{
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.1)",
                            }}
                          >
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                    <h3 className="mb-2 text-base font-semibold text-white">{p.title}</h3>
                    <p className="mb-4 overflow-hidden text-xs leading-relaxed text-gray-300 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                      {p.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.map((t, ti) => (
                        <span
                          key={ti}
                          className="relative overflow-hidden rounded-full px-2.5 py-1 text-[10px] text-gray-400"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            boxShadow: "inset 1px 1px 0.5px -1px rgba(255,255,255,0.6)",
                          }}
                        >
                          <span className="pointer-events-none absolute inset-x-1 top-[1px] h-px rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="hidden md:block">
                  <ProjectCard project={p} index={i} visible={visible} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
