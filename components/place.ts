import type { CSSProperties } from "react";

type Box = { w?: number; h?: number; z?: number };

/**
 * Positions an element on the 1440px Figma canvas. Values are design pixels;
 * the CSS multiplies them by --u so the whole composition scales with the
 * viewport while keeping the exact Figma proportions.
 */
export function place(x: number, y: number, { w, h, z }: Box = {}): CSSProperties {
  const style: Record<string, number> = { "--x": x, "--y": y };
  if (w !== undefined) style["--w"] = w;
  if (h !== undefined) style["--h"] = h;
  if (z !== undefined) style["--z"] = z;
  return style as CSSProperties;
}
