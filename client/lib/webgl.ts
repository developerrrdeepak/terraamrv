export function supportsWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

export function supportsWebGL2(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!canvas.getContext("webgl2");
  } catch {
    return false;
  }
}

// Heuristics to detect low-end or constrained environments
export function isLowEndDevice(): boolean {
  if (typeof window === "undefined") return true;
  const ua = navigator.userAgent || "";
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const dm = (navigator as any).deviceMemory as number | undefined;
  const cores = navigator.hardwareConcurrency || 0;
  const saveData = (navigator as any).connection?.saveData === true;
  const effectiveType = (navigator as any).connection?.effectiveType as string | undefined;
  const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Consider low-end if any of these indicate constraints
  if (saveData || prefersReducedMotion) return true;
  if (effectiveType && ["slow-2g", "2g"].includes(effectiveType)) return true;
  if (typeof dm === "number" && dm > 0 && dm <= 2) return true; // <= 2GB reported
  if (cores && cores <= 2) return true;
  if (isMobile && (dm === undefined || dm <= 3)) return true;
  return false;
}

export function shouldEnable3D(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get("safe") === "1") return false;
  if (params.get("effects") === "off") return false;
  if (params.get("effects") === "on") return supportsWebGL();
  // Default: disable in production on low-end devices
  if (import.meta.env.PROD && isLowEndDevice()) return false;
  return supportsWebGL();
}

export function shouldEnableAssistant(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get("safe") === "1") return false;
  if (params.get("assistant") === "off") return false;
  if (params.get("assistant") === "on") return true;
  if (import.meta.env.PROD && isLowEndDevice()) return false;
  return true;
}
