"use client"
import React, { useEffect, useState, memo, useRef } from 'react';

type IconType = 'html' | 'css' | 'javascript' | 'react' | 'tailwind' | 'redux' | 'materialui' | 'bootstrap' | 'webflow' | 'git' | 'shadcn' | 'twentyfirst';
type GlowColor = 'cyan' | 'purple' | 'orange';

interface SkillConfig {
  id: string;
  orbitRadius: number;
  size: number;
  speed: number;
  iconType: IconType;
  phaseShift: number;
  glowColor: GlowColor;
  label: string;
}

const iconComponents: Record<IconType, { component: () => React.JSX.Element; color: string }> = {
  html: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z" fill="#E34F26"/>
      </svg>
    ), color: '#E34F26'
  },
  css: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.751L12 19.351l5.379-1.443.744-8.157z" fill="#1572B6"/>
      </svg>
    ), color: '#1572B6'
  },
  javascript: {
    component: () => (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <rect width="24" height="24" fill="#F7DF1E"/>
        <path d="M22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" fill="#323330"/>
      </svg>
    ), color: '#F7DF1E'
  },
  react: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <circle cx="12" cy="12" r="2.05" fill="#61DAFB"/>
        <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="#61DAFB" strokeWidth="1" fill="none"/>
        <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="#61DAFB" strokeWidth="1" fill="none" transform="rotate(60 12 12)"/>
        <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="#61DAFB" strokeWidth="1" fill="none" transform="rotate(120 12 12)"/>
      </svg>
    ), color: '#61DAFB'
  },
  tailwind: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" fill="#06B6D4"/>
      </svg>
    ), color: '#06B6D4'
  },
  redux: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M16.634 16.504c.87-.075 1.543-.84 1.5-1.754-.043-.914-.796-1.635-1.714-1.635h-.057c-.944.043-1.677.84-1.634 1.8.043.463.214.85.471 1.14-1 1.97-2.514 3.416-4.8 4.627-1.542.84-3.143 1.155-4.714.986-1.314-.143-2.357-.614-3-1.411-.959-1.198-1.043-2.51-.271-3.795.557-.928 1.414-1.64 1.97-2.097-.114-.37-.285-.985-.371-1.44-4.2 3.048-3.77 7.17-2.485 9.11 .943 1.427 2.871 2.326 4.999 2.326.571 0 1.157-.057 1.742-.185 3.728-.756 6.557-3.04 8.364-7.668zm3.357-3.115c-2.214-2.597-5.485-4.026-9.228-4.026h-.47c-.27-.557-.856-.928-1.513-.928h-.056c-.944.043-1.677.84-1.634 1.8.043.914.796 1.635 1.714 1.635h.057c.699-.043 1.313-.5 1.57-1.14h.527c2.214 0 4.313.643 6.199 1.897 1.456.984 2.5 2.267 3.086 3.837.499 1.27.47 2.54-.028 3.624-.77 1.626-2.057 2.512-3.77 2.512-1.1 0-2.143-.342-2.671-.599-.3.285-.856.742-1.243 1.027 1.185.542 2.385.856 3.542.856 2.628 0 4.57-1.455 5.313-2.911.8-1.598.757-4.338-1.195-6.584zM7.648 17.378c.043.914.796 1.635 1.714 1.635h.057c.943-.043 1.677-.84 1.634-1.8-.043-.914-.797-1.635-1.715-1.635h-.056c-.071 0-.143.014-.214.028-1.228-2.04-1.742-4.239-1.585-6.595.1-1.784.67-3.34 1.67-4.596.842-1.099 2.485-1.641 3.585-1.669 3.086-.057 4.385 3.795 4.47 5.337l1.37.414C18.336 3.54 15.493 1 12.364 1 9.79 1 7.434 2.668 6.391 5.208 4.92 8.8 5.733 12.382 7.477 15.53c-.142.27-.228.585-.214.928l.385 1.92z" fill="#764ABC"/>
      </svg>
    ), color: '#764ABC'
  },
  materialui: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M0 21V3l9 5.25v3.5L3 8.5v7L9 19l6-3.5v-7l-3 1.75V7l3-1.75L24 11v4l-9 5.25v-3.5l6-3.5v-3.5L15 13v7z" fill="#007FFF"/>
      </svg>
    ), color: '#007FFF'
  },
  bootstrap: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M11.77 11.24H9.956V8.202h2.152c1.17 0 1.834.522 1.834 1.466 0 1.008-.773 1.572-2.174 1.572zm.324 1.206H9.956v3.348h2.231c1.459 0 2.232-.585 2.232-1.685s-.795-1.663-2.325-1.663zM24 11.39v1.218C24 18.485 18.485 24 11.608 24H0V0h11.61C18.485 0 24 5.515 24 12.39zM13.088 5H7.01v14h6.095c2.637 0 4.332-1.298 4.332-3.502 0-1.553-.87-2.753-2.313-3.235C16.2 11.77 16.9 10.7 16.9 9.3c0-2.66-1.574-4.3-3.812-4.3z" fill="#7952B3"/>
      </svg>
    ), color: '#7952B3'
  },
  webflow: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M17.803 7.563c-1.404 0-2.543.902-2.94 2.17l-1.485-4.51H9.617L7.49 12.18l-1.27-4.957H2.4L5.47 19.22h3.76l2.127-6.957 2.127 6.957h3.76l3.07-11.997h-2.51zm-5.803 0z" fill="#4353FF"/>
      </svg>
    ), color: '#4353FF'
  },
  git: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187" fill="#F05032"/>
      </svg>
    ), color: '#F05032'
  },
  shadcn: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path d="M22.219 11.784L11.784 22.219c-.407.407-.407 1.068 0 1.476.407.407 1.068.407 1.476 0L23.695 13.26c.407-.408.407-1.069 0-1.476-.408-.407-1.069-.407-1.476 0zM.305 13.26c-.407.407-.407 1.068 0 1.476l10.435 10.435c.408.407 1.069.407 1.476 0 .407-.408.407-1.069 0-1.476L1.781 13.26c-.407-.407-1.068-.407-1.476 0z" fill="white"/>
        <path d="M12 2L2 12l10 10L22 12 12 2z" stroke="white" strokeWidth="1.5" fill="none"/>
      </svg>
    ), color: '#ffffff'
  },
  twentyfirst: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <text x="2" y="17" fontSize="11" fontWeight="bold" fill="white" fontFamily="monospace">21st</text>
      </svg>
    ), color: '#a855f7'
  },
};

const SkillIcon = memo(({ type }: { type: IconType }) => {
  const IconComponent = iconComponents[type]?.component;
  return IconComponent ? <IconComponent /> : null;
});
SkillIcon.displayName = 'SkillIcon';

const skillsConfig: SkillConfig[] = [
  // Inner orbit — core web
  { id: 'html',        orbitRadius: 90,  size: 36, speed: 0.8,  iconType: 'html',        phaseShift: 0,                  glowColor: 'cyan',   label: 'HTML5' },
  { id: 'css',         orbitRadius: 90,  size: 36, speed: 0.8,  iconType: 'css',         phaseShift: (2*Math.PI)/3,      glowColor: 'cyan',   label: 'CSS3' },
  { id: 'javascript',  orbitRadius: 90,  size: 36, speed: 0.8,  iconType: 'javascript',  phaseShift: (4*Math.PI)/3,      glowColor: 'cyan',   label: 'JavaScript' },
  // Middle orbit — frameworks
  { id: 'react',       orbitRadius: 155, size: 40, speed: -0.5, iconType: 'react',       phaseShift: 0,                  glowColor: 'purple', label: 'React.js' },
  { id: 'tailwind',    orbitRadius: 155, size: 38, speed: -0.5, iconType: 'tailwind',    phaseShift: Math.PI/3,          glowColor: 'purple', label: 'Tailwind CSS' },
  { id: 'redux',       orbitRadius: 155, size: 38, speed: -0.5, iconType: 'redux',       phaseShift: (2*Math.PI)/3,      glowColor: 'purple', label: 'Redux' },
  { id: 'materialui',  orbitRadius: 155, size: 38, speed: -0.5, iconType: 'materialui',  phaseShift: Math.PI,            glowColor: 'purple', label: 'Material UI' },
  { id: 'bootstrap',   orbitRadius: 155, size: 38, speed: -0.5, iconType: 'bootstrap',   phaseShift: (4*Math.PI)/3,      glowColor: 'purple', label: 'Bootstrap' },
  { id: 'webflow',     orbitRadius: 155, size: 36, speed: -0.5, iconType: 'webflow',     phaseShift: (5*Math.PI)/3,      glowColor: 'purple', label: 'Webflow' },
  // Outer orbit — tools
  { id: 'git',         orbitRadius: 215, size: 36, speed: 0.3,  iconType: 'git',         phaseShift: 0,                  glowColor: 'orange', label: 'Git' },
  { id: 'shadcn',      orbitRadius: 215, size: 36, speed: 0.3,  iconType: 'shadcn',      phaseShift: (2*Math.PI)/3,      glowColor: 'orange', label: 'shadcn/ui' },
  { id: 'twentyfirst', orbitRadius: 215, size: 36, speed: 0.3,  iconType: 'twentyfirst', phaseShift: (4*Math.PI)/3,      glowColor: 'orange', label: '21st.dev' },
];

const OrbitingSkill = memo(({ config, angle }: { config: SkillConfig; angle: number }) => {
  const [hovered, setHovered] = useState(false);
  const { orbitRadius, size, iconType, label } = config;
  const x = Math.cos(angle) * orbitRadius;
  const y = Math.sin(angle) * orbitRadius;

  return (
    <div
      className="absolute top-1/2 left-1/2"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
        zIndex: hovered ? 20 : 10,
        transition: 'z-index 0s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative w-full h-full p-2 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-300"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: hovered
            ? `0 0 20px ${iconComponents[iconType]?.color}60, 0 0 40px ${iconComponents[iconType]?.color}30, inset 0 1px 0 rgba(255,255,255,0.2)`
            : 'inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.3)',
          transform: hovered ? 'scale(1.3)' : 'scale(1)',
        }}
      >
        <SkillIcon type={iconType} />
        {hovered && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[10px] text-white whitespace-nowrap pointer-events-none"
            style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {label}
          </div>
        )}
      </div>
    </div>
  );
});
OrbitingSkill.displayName = 'OrbitingSkill';

const OrbitRing = memo(({ radius, color }: { radius: number; color: string }) => (
  <div
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
    style={{
      width: `${radius * 2}px`,
      height: `${radius * 2}px`,
      border: `1px solid ${color}`,
      boxShadow: `0 0 20px ${color}, inset 0 0 20px ${color}`,
    }}
  />
));
OrbitRing.displayName = 'OrbitRing';

export default function OrbitingSkills() {
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const inViewRef = useRef(false);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setScale(Math.min(1, w / 500));
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // stop animation when out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { inViewRef.current = e.isIntersecting; },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused) return;
    let id: number;
    let last = performance.now();
    const tick = (now: number) => {
      if (inViewRef.current) {
        setTime(t => t + (now - last) / 1000);
      }
      last = now;
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [paused]);

  return (
    <div ref={containerRef} className="w-full flex items-center justify-center">
      <div
        className="relative flex items-center justify-center"
        style={{
          width: '500px',
          height: '500px',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* orbit rings */}
        <OrbitRing radius={90}  color="rgba(6,182,212,0.25)" />
        <OrbitRing radius={155} color="rgba(147,51,234,0.25)" />
        <OrbitRing radius={215} color="rgba(249,115,22,0.2)" />

      {/* center node */}
      <div className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 0 40px rgba(6,182,212,0.2), 0 0 80px rgba(147,51,234,0.15)',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#cg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <defs>
            <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#9333EA" />
            </linearGradient>
          </defs>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </div>

      {/* orbiting icons */}
      {skillsConfig.map(config => (
        <OrbitingSkill
          key={config.id}
          config={config}
          angle={time * config.speed + config.phaseShift}
        />
      ))}
      </div>
    </div>
  );
}
