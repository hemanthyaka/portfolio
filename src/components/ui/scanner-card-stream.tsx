'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

const ASCII_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]<>;:,._-+=!@#$%^&*|\\/\"'`~?";

const generateCode = (width: number, height: number): string => {
  let text = '';
  for (let i = 0; i < width * height; i++) text += ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
  let out = '';
  for (let i = 0; i < height; i++) out += text.substring(i * width, (i + 1) * width) + '';
  return out;
};

type ScannerCardStreamProps = {
  initialSpeed?: number;
  direction?: -1 | 1;
  cardImages?: string[];
  repeat?: number;
  cardGap?: number;
  friction?: number;
  scanEffect?: 'clip' | 'scramble';
};

export function ScannerCardStream({
  initialSpeed = 150,
  direction = -1,
  cardImages = [],
  repeat = 6,
  cardGap = 60,
  friction = 0.95,
  scanEffect = 'scramble',
}: ScannerCardStreamProps) {
  const [isScanning, setIsScanning] = useState(false);

  const cards = useMemo(() => {
    const total = cardImages.length * repeat;
    return Array.from({ length: total }, (_, i) => ({
      id: i,
      image: cardImages[i % cardImages.length],
      ascii: generateCode(Math.floor(400 / 6.5), Math.floor(250 / 13)),
    }));
  }, [cardImages, repeat]);

  const cardLineRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const scannerCanvasRef = useRef<HTMLCanvasElement>(null);
  const originalAscii = useRef(new Map<number, string>());
  const scannerState = useRef({ isScanning: false });

  const streamState = useRef({
    position: 0,
    velocity: initialSpeed,
    direction,
    isDragging: false,
    lastMouseX: 0,
    lastTime: performance.now(),
    cardLineWidth: (400 + cardGap) * cards.length,
    minVelocity: 30,
  });

  useEffect(() => {
    cards.forEach(c => originalAscii.current.set(c.id, c.ascii));
  }, [cards]);

  useEffect(() => {
    const cardLine = cardLineRef.current;
    const particleCanvas = particleCanvasRef.current;
    const scannerCanvas = scannerCanvasRef.current;
    if (!cardLine || !particleCanvas || !scannerCanvas) return;

    // ── Three.js particle background ──────────────────────────────────────
    const scene = new THREE.Scene();
    const W = window.innerWidth;
    const camera = new THREE.OrthographicCamera(-W / 2, W / 2, 125, -125, 1, 1000);
    camera.position.z = 100;
    const renderer = new THREE.WebGLRenderer({ canvas: particleCanvas, alpha: true, antialias: true });
    renderer.setSize(W, 250);
    renderer.setClearColor(0x000000, 0);

    const COUNT = 400;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(COUNT * 3);
    const vel = new Float32Array(COUNT);
    const alp = new Float32Array(COUNT);

    const tc = document.createElement('canvas');
    tc.width = tc.height = 100;
    const tx = tc.getContext('2d')!;
    const g = tx.createRadialGradient(50, 50, 0, 50, 50, 50);
    g.addColorStop(0.025, '#fff');
    g.addColorStop(0.1, 'hsl(217,61%,33%)');
    g.addColorStop(0.25, 'hsl(217,64%,6%)');
    g.addColorStop(1, 'transparent');
    tx.fillStyle = g;
    tx.arc(50, 50, 50, 0, Math.PI * 2);
    tx.fill();
    const tex = new THREE.CanvasTexture(tc);

    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * W * 2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 250;
      vel[i] = Math.random() * 60 + 30;
      alp[i] = (Math.random() * 8 + 2) / 10;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('alpha', new THREE.BufferAttribute(alp, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: { pointTexture: { value: tex } },
      vertexShader: `attribute float alpha; varying float vAlpha; void main() { vAlpha = alpha; vec4 mvPosition = modelViewMatrix * vec4(position,1.0); gl_PointSize = 15.0; gl_Position = projectionMatrix * mvPosition; }`,
      fragmentShader: `uniform sampler2D pointTexture; varying float vAlpha; void main() { gl_FragColor = vec4(1.0,1.0,1.0,vAlpha) * texture2D(pointTexture, gl_PointCoord); }`,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    scene.add(new THREE.Points(geo, mat));

    // ── Scanner canvas particles ───────────────────────────────────────────
    const ctx = scannerCanvas.getContext('2d')!;
    scannerCanvas.width = W;
    scannerCanvas.height = 300;

    type SP = { x: number; y: number; vx: number; vy: number; radius: number; alpha: number; life: number; decay: number };
    const mkP = (): SP => ({
      x: W / 2 + (Math.random() - 0.5) * 3,
      y: Math.random() * 300,
      vx: Math.random() * 0.8 + 0.2,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 0.6 + 0.4,
      alpha: Math.random() * 0.4 + 0.6,
      life: 1.0,
      decay: Math.random() * 0.02 + 0.005,
    });

    const BASE = 800, SCAN_MAX = 2500;
    let curMax = BASE;
    let sParticles: SP[] = Array.from({ length: BASE }, mkP);

    // ── Scramble effect ────────────────────────────────────────────────────
    const runScramble = (el: HTMLElement, id: number) => {
      if (el.dataset.scrambling === 'true') return;
      el.dataset.scrambling = 'true';
      const orig = originalAscii.current.get(id) || '';
      let n = 0;
      const iv = setInterval(() => {
        el.textContent = generateCode(Math.floor(400 / 6.5), Math.floor(250 / 13));
        if (++n >= 10) { clearInterval(iv); el.textContent = orig; delete el.dataset.scrambling; }
      }, 30);
    };

    // ── Card clip update ───────────────────────────────────────────────────
    const updateCards = () => {
      const sx = W / 2, sw = 8;
      let any = false;
      cardLine.querySelectorAll<HTMLElement>('.card-wrapper').forEach((wrap, idx) => {
        const r = wrap.getBoundingClientRect();
        const norm = wrap.querySelector<HTMLElement>('.card-normal')!;
        const asc  = wrap.querySelector<HTMLElement>('.card-ascii')!;
        const pre  = asc.querySelector<HTMLElement>('pre')!;
        if (r.left < sx + sw / 2 && r.right > sx - sw / 2) {
          any = true;
          if (scanEffect === 'scramble' && wrap.dataset.scanned !== 'true') runScramble(pre, idx);
          wrap.dataset.scanned = 'true';
          const il = Math.max(sx - sw / 2 - r.left, 0);
          const ir = Math.min(sx + sw / 2 - r.left, r.width);
          norm.style.setProperty('--clip-right', `${(il / r.width) * 100}%`);
          asc.style.setProperty('--clip-left',  `${(ir / r.width) * 100}%`);
        } else {
          delete wrap.dataset.scanned;
          if (r.right < sx - sw / 2) {
            norm.style.setProperty('--clip-right', '100%');
            asc.style.setProperty('--clip-left',  '100%');
          } else {
            norm.style.setProperty('--clip-right', '0%');
            asc.style.setProperty('--clip-left',  '0%');
          }
        }
      });
      scannerState.current.isScanning = any;
      setIsScanning(any);
    };

    // ── Drag / wheel ───────────────────────────────────────────────────────
    const onDown = (e: MouseEvent | TouchEvent) => {
      streamState.current.isDragging = true;
      streamState.current.lastMouseX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!streamState.current.isDragging) return;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const dx = x - streamState.current.lastMouseX;
      streamState.current.position += dx;
      streamState.current.velocity = Math.abs(dx) / 0.016;
      streamState.current.direction = dx < 0 ? -1 : 1;
      streamState.current.lastMouseX = x;
    };
    const onUp = () => { streamState.current.isDragging = false; };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      streamState.current.velocity = Math.min(Math.abs(e.deltaY) * 2, 600);
      streamState.current.direction = e.deltaY > 0 ? -1 : 1;
    };

    cardLine.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    cardLine.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    cardLine.addEventListener('wheel', onWheel, { passive: false });

    // ── Animation loop ─────────────────────────────────────────────────────
    let rafId: number;
    const animate = (now: number) => {
      const dt = (now - streamState.current.lastTime) / 1000;
      streamState.current.lastTime = now;

      if (!streamState.current.isDragging) {
        streamState.current.velocity = Math.max(streamState.current.velocity * friction, streamState.current.minVelocity);
        streamState.current.position += streamState.current.velocity * streamState.current.direction * dt;
      }

      const cw = streamState.current.cardLineWidth;
      const pw = cardLine.parentElement?.offsetWidth || 0;
      if (streamState.current.position < -cw) streamState.current.position = pw;
      else if (streamState.current.position > pw) streamState.current.position = -cw;
      cardLine.style.transform = `translateX(${streamState.current.position}px)`;
      updateCards();

      // three.js
      const t = now * 0.001;
      for (let i = 0; i < COUNT; i++) {
        pos[i * 3] += vel[i] * 0.016;
        if (pos[i * 3] > W / 2 + 100) pos[i * 3] = -W / 2 - 100;
        pos[i * 3 + 1] += Math.sin(t + i * 0.1) * 0.5;
        alp[i] = Math.max(0.1, Math.min(1, alp[i] + (Math.random() - 0.5) * 0.05));
      }
      geo.attributes.position.needsUpdate = true;
      geo.attributes.alpha.needsUpdate = true;
      renderer.render(scene, camera);

      // scanner particles
      ctx.clearRect(0, 0, W, 300);
      const target = scannerState.current.isScanning ? SCAN_MAX : BASE;
      curMax += (target - curMax) * 0.05;
      while (sParticles.length < curMax) sParticles.push(mkP());
      while (sParticles.length > curMax) sParticles.pop();
      sParticles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        if (p.life <= 0 || p.x > W) Object.assign(p, mkP());
        ctx.globalAlpha = p.alpha * p.life;
        ctx.fillStyle = 'white';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
      });

      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      renderer.dispose();
      cardLine.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      cardLine.removeEventListener('touchstart', onDown);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      cardLine.removeEventListener('wheel', onWheel);
    };
  }, [cards, cardGap, friction, scanEffect]);

  return (
    <div className="relative w-full h-[250px] overflow-hidden">
      <style>{`
        @keyframes glitch{0%,16%,50%,100%{opacity:1}15%,99%{opacity:.9}49%{opacity:.8}}
        .animate-glitch{animation:glitch .1s infinite linear alternate-reverse}
        @keyframes scanPulse{0%{opacity:.75;transform:translateX(-50%) translateY(-50%) scaleY(1)}100%{opacity:1;transform:translateX(-50%) translateY(-50%) scaleY(1.03)}}
        .animate-scan-pulse{animation:scanPulse 1.5s infinite alternate ease-in-out}
      `}</style>

      <canvas ref={particleCanvasRef} className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[250px] z-0 pointer-events-none" />
      <canvas ref={scannerCanvasRef} className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[300px] z-10 pointer-events-none" />

      {/* violet scanner line */}
      <div
        className={`absolute top-1/2 left-1/2 h-[280px] w-0.5 rounded-full z-20 pointer-events-none animate-scan-pulse transition-opacity duration-300 ${isScanning ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: 'linear-gradient(to bottom, transparent, #a78bfa, transparent)',
          boxShadow: '0 0 10px #a78bfa, 0 0 20px #a78bfa, 0 0 30px #8b5cf6, 0 0 50px #6366f1',
        }}
      />

      {/* card stream */}
      <div className="absolute w-full h-[250px] flex items-center">
        <div
          ref={cardLineRef}
          className="flex items-center whitespace-nowrap cursor-grab select-none will-change-transform"
          style={{ gap: `${cardGap}px` }}
        >
          {cards.map(card => (
            <div key={card.id} className="card-wrapper relative w-[400px] h-[250px] shrink-0">
              {/* image side */}
              <div
                className="card-normal absolute inset-0 rounded-[15px] overflow-hidden z-[2] shadow-[0_15px_40px_rgba(0,0,0,0.4)]"
                style={{ clipPath: 'inset(0 0 0 var(--clip-right,0%))' }}
              >
                <img src={card.image} alt="" className="w-full h-full object-cover brightness-110 contrast-110" />
              </div>
              {/* ascii side */}
              <div
                className="card-ascii absolute inset-0 rounded-[15px] overflow-hidden z-[1]"
                style={{ clipPath: 'inset(0 calc(100% - var(--clip-left,0%)) 0 0)' }}
              >
                <pre
                  className="animate-glitch absolute inset-0 text-[rgba(220,210,255,0.6)] font-mono text-[11px] leading-[13px] overflow-hidden whitespace-pre m-0 p-0"
                  style={{ maskImage: 'linear-gradient(to right,rgba(0,0,0,1) 0%,rgba(0,0,0,0.8) 30%,rgba(0,0,0,0.6) 50%,rgba(0,0,0,0.4) 80%,rgba(0,0,0,0.2) 100%)' }}
                >
                  {card.ascii}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
