'use client';
import { useEffect, useRef } from 'react';import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createLenis, destroyLenis, getLenis } from '@/lib/lenis';

const LAYERS = [
  {
    layer: '1',
    yPercent: 70,
    src: 'https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795be09b462b2e8ebf71_osmo-parallax-layer-3.webp',
  },
  {
    layer: '2',
    yPercent: 55,
    src: 'https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795b4d5ac529e7d3a562_osmo-parallax-layer-2.webp',
  },
  {
    layer: '4',
    yPercent: 10,
    src: 'https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795bb5aceca85011ad83_osmo-parallax-layer-1.webp',
  },
];

export function ParallaxComponent() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current?.querySelector<HTMLElement>(
      '[data-parallax-layers]'
    );

    if (triggerElement) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: '0% 0%',
          end: '100% 0%',
          scrub: 0,
        },
      });

      const layers = [
        { layer: '1', yPercent: 70 },
        { layer: '2', yPercent: 55 },
        { layer: '3', yPercent: 40 },
        { layer: '4', yPercent: 10 },
      ];

      layers.forEach((layerObj, idx) => {
        tl.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
          { yPercent: layerObj.yPercent, ease: 'none' },
          idx === 0 ? undefined : '<'
        );
      });
    }

    const lenis = createLenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { getLenis()?.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      if (triggerElement) gsap.killTweensOf(triggerElement);
      destroyLenis();
    };
  }, []);

  return (
    <div ref={parallaxRef} id="parallax" className="w-full">
      {/* Hero parallax section — sticky container drives the scroll animation */}
      <section id="parallax-scene" className="relative h-[120vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">


          {/* Parallax layers */}
          <div
            data-parallax-layers
            className="absolute inset-0 w-full h-full"
          >
            {/* Layer 1 — back mountain */}
            <img
              src={LAYERS[0].src}
              data-parallax-layer="1"
              loading="eager"
              alt="parallax background layer"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />

            {/* Layer 2 — mid mountain */}
            <img
              src={LAYERS[1].src}
              data-parallax-layer="2"
              loading="eager"
              alt="parallax mid layer"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />

            {/* Layer 3 — title */}
            <div
              data-parallax-layer="3"
              className="absolute inset-0 flex items-center justify-center z-20"
            >
              <h2 className="text-white font-black uppercase tracking-tighter text-[clamp(4rem,15vw,14rem)] min-[320px]:max-[374px]:text-[50px] leading-none select-none drop-shadow-2xl">
                H e m a n t h
              </h2>
            </div>

            {/* Layer 4 — front mountain */}
            <img
              src={LAYERS[2].src}
              data-parallax-layer="4"
              loading="eager"
              alt="parallax foreground layer"
              className="absolute inset-0 w-full h-full object-cover object-center z-30"
            />
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent z-40 pointer-events-none" />
        </div>
      </section>
    </div>
  );
}
