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
