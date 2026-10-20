/**
 * Utility crop gambar menggunakan HTML5 Canvas
 * Bekerja sama dengan pixel crop yang dihasilkan oleh react-easy-crop
 */

export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = (rotation * Math.PI) / 180;
  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: PixelCrop,
  rotation = 0,
  fileName = "cropped.jpg",
  maxDimension = 1200,
  quality = 0.85
): Promise<{ file: File; previewUrl: string }> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Tidak dapat membuat 2D context pada Canvas");
  }

  const rotRad = (rotation * Math.PI) / 180;

  // Hitung ukuran canvas untuk menampung gambar terotasi
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Putar kanvas dari titik tengah
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  // Buat kanvas kedua khusus hasil crop
  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    throw new Error("Tidak dapat membuat 2D context untuk hasil crop");
  }

  // Batasi dimensi maksimum agar file tetap ringan dan satset
  let targetW = Math.round(pixelCrop.width);
  let targetH = Math.round(pixelCrop.height);

  if (targetW > maxDimension || targetH > maxDimension) {
    if (targetW > targetH) {
      targetH = Math.round((targetH * maxDimension) / targetW);
      targetW = maxDimension;
    } else {
      targetW = Math.round((targetW * maxDimension) / targetH);
      targetH = maxDimension;
    }
  }

  // Minimal 50px agar tidak terjadi invalid dimension
  targetW = Math.max(50, targetW);
  targetH = Math.max(50, targetH);

  croppedCanvas.width = targetW;
  croppedCanvas.height = targetH;

  // Gambar area crop ke kanvas akhir
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetW,
    targetH
  );

  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Gagal membuat blob gambar hasil crop"));
          return;
        }

        const cleanName =
          (fileName || "image").replace(/\.[^/.]+$/, "") + ".jpg";

        const file = new File([blob], cleanName, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });

        const previewUrl = URL.createObjectURL(file);
        resolve({ file, previewUrl });
      },
      "image/jpeg",
      quality
    );
  });
}
