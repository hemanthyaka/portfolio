'use client'

import { Suspense, lazy } from 'react'
import { cn } from '@/lib/utils'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
  active?: boolean
}

export function SplineScene({ scene, className, active = true }: SplineSceneProps) {
  if (!active) {
    return (
      <div
        className={cn(
          'flex h-full w-full items-center justify-center bg-black/40',
          className
        )}
      >
        <span className="loader" />
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <div className={cn('flex h-full w-full items-center justify-center', className)}>
          <span className="loader" />
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  )
}
