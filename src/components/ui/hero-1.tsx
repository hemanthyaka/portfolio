"use client"
import { useEffect, useRef, useState } from "react"
import { LiquidButton } from "@/components/ui/liquid-glass-button"
import { trackEvent } from "@/lib/analytics"
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { SplineScene } from "@/components/ui/splite"

interface HeroProps {
  eyebrow?: string
  title: string
  subtitle: string
  ctaLabel?: string
  ctaHref?: string
}

export function Hero({
  eyebrow = "Innovate Without Limits",
  title,
  subtitle,
  ctaLabel = "Explore Now",
  ctaHref = "#",
}: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [hasEnteredView, setHasEnteredView] = useState(false)

  const handleCtaClick = () => {
    trackEvent("contact_click", { label: ctaLabel });
    if (!ctaHref) return

    if (ctaHref === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    if (ctaHref.startsWith("#")) {
      const target =
        document.querySelector<HTMLElement>(ctaHref) ??
        document.getElementById(ctaHref.slice(1))

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" })
        return
      }
    }

    window.location.href = ctaHref
  }

  useEffect(() => {
    const element = sectionRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true)
        }
      },
      { threshold: 0.35 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100vh] w-full overflow-hidden"
    >
      <Card className="relative min-h-[100vh] w-full overflow-hidden rounded-none border-0 bg-black/[0.96]">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

        <div className="grid min-h-[100vh] grid-rows-[auto_minmax(24rem,1fr)] lg:grid-cols-[minmax(420px,0.88fr)_minmax(0,1.12fr)] lg:grid-rows-1">
          <div
            className={`relative z-10 flex min-h-0 flex-col justify-center px-4 pb-3 pt-12 transition-all duration-700 sm:px-6 sm:pt-14 md:px-8 md:py-8 lg:px-12 lg:py-10 ${
              hasEnteredView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            {eyebrow && (
              <span
                className="relative mb-4 inline-flex w-fit overflow-hidden rounded-full border border-white/10 px-4 py-1.5 text-[10px] uppercase tracking-wider text-neutral-300 sm:text-xs"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.08) 60%, transparent 80%), linear-gradient(to right, #1a1a1a, #2a2a2a)",
                  backgroundSize: "200% auto, 100%",
                  animation: "shimmer 3s linear infinite",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 1px 3px rgba(0,0,0,0.4)",
                }}
              >
                {eyebrow}
              </span>
            )}

            <h1 className="max-w-[20ch] bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-[clamp(1.65rem,5.8vw,3.9rem)] font-bold leading-[0.98] tracking-tight text-transparent lg:text-[clamp(2.4rem,4.3vw,4.5rem)]">
              {title}
            </h1>

            <p className="mt-3 max-w-xl text-[clamp(0.8rem,2.2vw,1.125rem)] text-neutral-300">
              {subtitle}
            </p>

            {ctaLabel && (
              <div className="mt-6 sm:mt-8">
                <LiquidButton
                  size="xl"
                  className="px-6 font-semibold tracking-tight text-white sm:px-10"
                  onClick={handleCtaClick}
                >
                  {ctaLabel}
                </LiquidButton>
              </div>
            )}
          </div>

          <div className="relative h-full min-h-[52vh] w-full lg:min-h-0">
            <div className="absolute inset-0 flex items-center justify-center px-2 sm:px-4 lg:px-0">
              <div className="-translate-y-4 h-[96%] w-[96%] sm:-translate-y-6 sm:h-[98%] sm:w-[98%] md:-translate-y-8 md:h-full md:w-full lg:h-[88%] lg:w-[88%] lg:-translate-x-4 lg:translate-y-0 xl:h-[92%] xl:w-[92%]">
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="h-full w-full"
                  active={hasEnteredView}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}
