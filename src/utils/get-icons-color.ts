function waitForImageLoad(img: HTMLImageElement): Promise<void> {
  return new Promise((resolve, reject) => {
    if (img.complete && img.naturalWidth !== 0) {
      resolve();
    } else {
      img.onload = () => resolve();
      img.onerror = () => {
        reject(new Error("Image failed to load"));
      };
    }
  });
}

function getPrevalentColor({
  img,
  x,
  y,
  canvas,
  defaultColor = "rgba(12, 233, 122, 1)",
}: {
  img: HTMLImageElement;
  x: number;
  y: number;
  canvas: HTMLCanvasElement;
  defaultColor?: string;
}) {
  const colorExists = localStorage.getItem(
    `prevalent-color-${img.src}-${x}-${y}`
  );

  if (colorExists) return colorExists;

  const ctx = canvas.getContext("2d", {
    willReadFrequently: true,
  }) as CanvasRenderingContext2D;

  if (!ctx) {
    return defaultColor;
  }

  // Use natural dimensions for better quality
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const safeX = Math.max(0, Math.min(x, canvas.width - 50));
  const safeY = Math.max(0, Math.min(y, canvas.height - 50));

  try {
    const pixelData = ctx.getImageData(safeX, safeY, 900, 300).data;
    let r = 0,
      g = 0,
      b = 0,
      count = 0;
    for (let i = 0; i < pixelData.length; i += 4) {
      if (pixelData[i + 3] > 0) {
        r += pixelData[i];
        g += pixelData[i + 1];
        b += pixelData[i + 2];
        count++;
      }
    }

    if (count === 0) {
      return defaultColor;
    }

    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);

    const colorRender = `rgb(${r}, ${g}, ${b})`;

    localStorage.setItem(`prevalent-color-${img.src}-${x}-${y}`, colorRender);
    return colorRender;
  } catch (error) {
    return defaultColor;
  }
}

function getPrevalentColorValues({
  img,
  x,
  y,
  canvas,
  defaultColor = { r: 12, g: 233, b: 122},
}: {
  img: HTMLImageElement;
  x: number;
  y: number;
  canvas: HTMLCanvasElement;
  defaultColor?: { r: number; g: number; b: number };
}) : { r: number; g: number; b: number } {

  const ctx = canvas.getContext("2d", {
    willReadFrequently: true,
  }) as CanvasRenderingContext2D;

  if (!ctx) {
    return defaultColor;
  }

  // Use natural dimensions for better quality
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const safeX = Math.max(0, Math.min(x, canvas.width - 50));
  const safeY = Math.max(0, Math.min(y, canvas.height - 50));

  try {
    const pixelData = ctx.getImageData(safeX, safeY, 900, 300).data;
    let r = 0,
      g = 0,
      b = 0,
      count = 0;
    for (let i = 0; i < pixelData.length; i += 4) {
      if (pixelData[i + 3] > 0) {
        r += pixelData[i];
        g += pixelData[i + 1];
        b += pixelData[i + 2];
        count++;
      }
    }

    if (count === 0) {
      return defaultColor;
    }

    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);

    return {
      r,
      g,
      b,
    };
  } catch (error) {
    return defaultColor;
  }
}
export { waitForImageLoad, getPrevalentColor, getPrevalentColorValues };
