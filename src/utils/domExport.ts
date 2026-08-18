/**
 * Shared DOM-to-PNG export helper.
 *
 * Every download and social share rasterizes the exact DOM the user is looking at, so
 * the exported PNG has to be a faithful copy of the on-screen card/banner.
 *
 * `html2canvas` reimplements layout and text painting itself, which makes it drift from
 * the browser. It paints every text run at `textRect.top + <its own font baseline
 * probe>`, and with the Monaspace Neon / Mona Sans webfonts used here that probe
 * overshoots the real ascent by roughly half an em. The result was that every label
 * sank a few pixels inside its pill or stat cell (issue #59). It also cannot parse the
 * `oklch()` colors Tailwind v4 emits, and it drops CSS filters such as the avatar glow.
 *
 * Instead we serialize the node into an SVG `<foreignObject>` and let the browser
 * rasterize it. Layout, font metrics, filters and colors are then produced by the very
 * same engine that painted the preview, so the export matches the preview by
 * construction rather than by per-element pixel nudging.
 */

import { canvasToPngBlob, downloadBlob, yieldToBrowser } from "./imageExport";

/** Default scale so downloads stay crisp on hi-dpi displays. */
export const DEFAULT_EXPORT_SCALE = 3;

export interface ExportOptions {
  /** Pixel ratio of the exported image. */
  scale?: number;
}

/**
 * Render a DOM element to a canvas using the browser's own rendering engine.
 */
export async function elementToCanvas(
  element: HTMLElement,
  { scale = DEFAULT_EXPORT_SCALE }: ExportOptions = {},
): Promise<HTMLCanvasElement> {
  await yieldToBrowser();

  const { domToCanvas } = await import("modern-screenshot");

  return domToCanvas(element, {
    scale,
    backgroundColor: null,
  });
}

/**
 * Render a DOM element to a PNG blob.
 */
export async function elementToPngBlob(
  element: HTMLElement,
  options: ExportOptions = {},
): Promise<Blob> {
  let canvas: HTMLCanvasElement | undefined;

  try {
    canvas = await elementToCanvas(element, options);
    return await canvasToPngBlob(canvas);
  } finally {
    if (canvas) {
      canvas.width = 0;
      canvas.height = 0;
    }
  }
}

/**
 * Render a DOM element to a PNG and trigger a browser download.
 */
export async function downloadElementAsPng(
  element: HTMLElement,
  fileName: string,
  options: ExportOptions = {},
): Promise<void> {
  const blob = await elementToPngBlob(element, options);
  downloadBlob(blob, fileName);
}
