"use client"
import { useEffect, useRef } from "react"

interface LiquidEffectAnimationProps {
  className?: string
}

export function LiquidEffectAnimation({ className = "" }: LiquidEffectAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Generate a white/gray gradient as a data URL — no external image needed
    const offscreen = document.createElement("canvas")
    offscreen.width = 512
    offscreen.height = 512
    const ctx = offscreen.getContext("2d")!
    const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 360)
    grad.addColorStop(0, "#ffffff")
    grad.addColorStop(0.4, "#d4d4d4")
    grad.addColorStop(0.75, "#737373")
    grad.addColorStop(1, "#171717")
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 512, 512)
    const dataUrl = offscreen.toDataURL("image/png")

    const script = document.createElement("script")
    script.type = "module"
    script.id = "liquid-script"
    script.textContent = `
      import LiquidBackground from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.22/build/backgrounds/liquid1.min.js';
      const canvas = document.getElementById('liquid-canvas');
      if (canvas && !window.__liquidApp) {
        const app = LiquidBackground(canvas);
        app.loadImage('${dataUrl}');
        app.liquidPlane.material.metalness = 0.95;
        app.liquidPlane.material.roughness = 0.05;
        app.liquidPlane.uniforms.displacementScale.value = 4;
        app.setRain(false);
        window.__liquidApp = app;
      }
    `
    document.body.appendChild(script)

    return () => {
      if (window.__liquidApp?.dispose) {
        window.__liquidApp.dispose()
        window.__liquidApp = undefined
      }
      const existing = document.getElementById("liquid-script")
      if (existing) document.body.removeChild(existing)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="liquid-canvas"
      className={`w-full h-full ${className}`}
    />
  )
}

declare global {
  interface Window {
    __liquidApp?: any
  }
}
