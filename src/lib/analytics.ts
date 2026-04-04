declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    google_tag_manager?: Record<string, unknown>;
  }
}

export function trackEvent(event: string, params?: Record<string, unknown>) {
  if (!window.dataLayer) {
    console.error("❌ dataLayer not initialized — GTM NOT LOADED");
    return;
  }

  // Check if GTM exists
  if (!window.google_tag_manager) {
    console.warn("⚠️ GTM script not detected");
  } else {
    console.log("✅ GTM detected");
  }

  const payload = { event, ...params };

  console.log("🚀 Pushing event:", payload);

  window.dataLayer.push(payload);
}