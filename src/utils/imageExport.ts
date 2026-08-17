import type { Options as Html2CanvasOptions } from "html2canvas";

const nextFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

export const yieldToBrowser = async () => {
  await nextFrame();
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 0);
  });
};

export const canvasToPngBlob = async (canvas: HTMLCanvasElement) => {
  await yieldToBrowser();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => {
      if (value) {
        resolve(value);
      } else {
        reject(new Error("Failed to create PNG blob from canvas"));
      }
    }, "image/png");
  });

  await yieldToBrowser();
  return blob;
};

const loadSvgBlobIntoImage = async (svgBlob: Blob) => {
  if ("createImageBitmap" in window) {
    try {
      return await window.createImageBitmap(svgBlob);
    } catch (error) {
      console.warn(
        "createImageBitmap failed for SVG export; using Image fallback.",
        error
      );
    }
  }

  const objectUrl = URL.createObjectURL(svgBlob);
  const image = new Image();

  try {
    await new Promise<void>((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        reject(new Error("Image load timeout after 10 seconds"));
      }, 10000);

      image.onload = () => {
        window.clearTimeout(timeout);
        resolve();
      };

      image.onerror = () => {
        window.clearTimeout(timeout);
        reject(new Error("Failed to load SVG image"));
      };

      image.src = objectUrl;
    });

    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

export const svgToPngBlob = async (
  svgString: string,
  width: number,
  height: number
) => {
  await yieldToBrowser();

  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8",
  });
  const image = await loadSvgBlobIntoImage(svgBlob);

  await yieldToBrowser();

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { willReadFrequently: false });
  if (!context) {
    throw new Error("Failed to get canvas context");
  }

  context.drawImage(image, 0, 0, width, height);
  if ("close" in image && typeof image.close === "function") {
    image.close();
  }

  const blob = await canvasToPngBlob(canvas);
  canvas.width = 0;
  canvas.height = 0;
  return blob;
};

export const captureElementToPngBlob = async (
  element: HTMLElement,
  options: Partial<Html2CanvasOptions>
) => {
  await yieldToBrowser();

  const html2canvas = (await import("html2canvas")).default;
  const canvas = await html2canvas(element, {
    logging: false,
    ...options,
  });
  const blob = await canvasToPngBlob(canvas);

  canvas.width = 0;
  canvas.height = 0;
  return blob;
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.setTimeout(() => URL.revokeObjectURL(url), 100);
};

export const copyPngBlobToClipboard = async (blob: Blob) => {
  await navigator.clipboard.write([
    new ClipboardItem({
      "image/png": blob,
    }),
  ]);
};
