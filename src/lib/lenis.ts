import Lenis from '@studio-freight/lenis';

let instance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return instance;
}

export function createLenis(): Lenis {
  instance = new Lenis();
  return instance;
}

export function destroyLenis() {
  instance?.destroy();
  instance = null;
}
