'use client'

import { Card } from '@/components/ui/card'
import { Spotlight } from '@/components/ui/spotlight'
import { SplineScene } from '@/components/ui/splite'

export function SplineSceneBasic() {
  return (
    <Card className="relative h-[500px] w-full overflow-hidden border-white/10 bg-black/[0.96]">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

      <div className="flex h-full flex-col md:flex-row">
        <div className="relative z-10 flex flex-1 flex-col justify-center p-6 md:p-8">
          <h1 className="bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-3xl font-bold text-transparent md:text-5xl">
            Interactive 3D
          </h1>
          <p className="mt-4 max-w-lg text-sm text-neutral-300 md:text-base">
            Bring your UI to life with beautiful 3D scenes. Create immersive
            experiences that capture attention and enhance your design.
          </p>
        </div>

        <div className="relative h-[260px] flex-1 md:h-full">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="h-full w-full"
          />
        </div>
      </div>
    </Card>
  )
}
