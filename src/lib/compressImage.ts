/**
 * Utility untuk kompresi gambar di sisi browser sebelum dikirim ke server.
 * Mencegah error "Ukuran gambar maksimal", error Vercel 413 (Payload Too Large),
 * dan menstandarkan format JPG dari kamera HP/iPhone yang berukuran besar.
 */
export async function compressImage(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.82
): Promise<File> {
  // Biarkan SVG atau GIF animasi tanpa kompresi
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  // Jika file sudah kecil (< 400KB) dan bertipe standar, langsung pakai
  if (file.size < 400 * 1024 && (file.type === "image/jpeg" || file.type === "image/webp" || file.type === "image/png")) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const cleanName = (file.name || "image").replace(/\.[^/.]+$/, "") + ".jpg";
            const compressed = new File([blob], cleanName, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressed);
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

/**
 * Kompresi sekaligus pemotongan (crop) gambar berdasarkan fokus posisi.
 * Menghasilkan file gambar dengan rasio aspek target (misal 4:3 untuk menu)
 * sehingga tampilan di HP pelanggan pasti pas dan rapi tanpa terpotong sembarangan.
 */
export async function cropAndCompressImage(
  source: File | string,
  focalY: number = 0.5, // 0 = atas, 0.5 = tengah, 1 = bawah
  focalX: number = 0.5, // 0 = kiri, 0.5 = tengah, 1 = kanan
  targetAspect: number = 4 / 3, // Rasio 4:3 untuk kartu menu
  quality = 0.85
): Promise<{ file: File; previewUrl: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    const processImage = () => {
      const origW = img.naturalWidth || img.width;
      const origH = img.naturalHeight || img.height;

      let cropW: number;
      let cropH: number;
      let startX: number;
      let startY: number;

      const currentAspect = origW / origH;

      if (currentAspect > targetAspect) {
        // Foto lebih lebar dari target
        cropH = origH;
        cropW = Math.round(origH * targetAspect);
        startX = Math.round((origW - cropW) * Math.max(0, Math.min(1, focalX)));
        startY = 0;
      } else {
        // Foto lebih tinggi dari target (misal portrait dari kamera HP)
        cropW = origW;
        cropH = Math.round(origW / targetAspect);
        startX = 0;
        startY = Math.round((origH - cropH) * Math.max(0, Math.min(1, focalY)));
      }

      const targetW = Math.min(cropW, 1200);
      const targetH = Math.round(targetW / targetAspect);

      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Gagal menginisialisasi canvas"));
        return;
      }

      ctx.drawImage(img, startX, startY, cropW, cropH, 0, 0, targetW, targetH);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Gagal membuat blob gambar"));
            return;
          }
          const fileName =
            source instanceof File
              ? source.name.replace(/\.[^/.]+$/, "") + ".jpg"
              : "cropped-image.jpg";

          const file = new File([blob], fileName, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          const previewUrl = URL.createObjectURL(file);
          resolve({ file, previewUrl });
        },
        "image/jpeg",
        quality
      );
    };

    img.onload = processImage;
    img.onerror = (err) => reject(err);

    if (source instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(source);
    } else {
      img.src = source;
    }
  });
}
