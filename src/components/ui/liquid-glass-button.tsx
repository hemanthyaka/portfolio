"use client"
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const liquidbuttonVariants = cva(
  "inline-flex items-center transition-colors justify-center cursor-pointer gap-2 whitespace-nowrap rounded-full text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:scale-103 duration-300 transition text-primary",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 text-xs gap-1.5 px-4",
        lg: "h-10 rounded-full px-6",
        xl: "h-12 rounded-full px-8",
        xxl: "h-14 rounded-full px-10",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "xxl",
    },
  }
)

function GlassFilter() {
  return (
    <svg className="hidden" aria-hidden>
      <defs>
        <filter
          id="container-glass"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves={1} seed={1} result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation={2} result="blurredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale={70} xChannelSelector="R" yChannelSelector="B" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation={4} result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  )
}

export interface LiquidButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof liquidbuttonVariants> {
  asChild?: boolean
}

export const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const [hovered, setHovered] = React.useState(false)
    return (
      <>
        <Comp
          ref={ref}
          data-slot="button"
          className={cn("relative", liquidbuttonVariants({ variant, size, className }))}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          {...props}
        >
          {/* liquid glass shadow shell */}
          <div className="absolute top-0 left-0 z-0 h-full w-full rounded-full shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(255,255,255,0.9),inset_-3px_-3px_0.5px_-3px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(255,255,255,0.15)] transition-all" />
          {/* backdrop distortion layer */}
          <div
            className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-full"
            style={{ backdropFilter: 'url("#container-glass") blur(0.5px)' }}
          />
          {/* shimmer sweep on hover */}
          <span
            className="pointer-events-none absolute inset-0 z-20 rounded-full overflow-hidden"
            aria-hidden
          >
            <span
              className="absolute inset-0 rounded-full transition-opacity duration-300"
              style={{
                opacity: hovered ? 1 : 0,
                background:
                  "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.08) 60%, transparent 80%)",
                backgroundSize: "200% auto",
                animation: hovered ? "shimmer 1.2s linear infinite" : "none",
              }}
            />
          </span>
          {/* top gloss line */}
          <span className="pointer-events-none absolute inset-x-4 top-[2px] h-px rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent z-10" />
          {/* bottom gloss line */}
          <span className="pointer-events-none absolute inset-x-6 bottom-[2px] h-px rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
          <div className="pointer-events-none relative z-10">{children}</div>
          <GlassFilter />
        </Comp>
      </>
    )
  }
)
LiquidButton.displayName = "LiquidButton"

export { liquidbuttonVariants }
