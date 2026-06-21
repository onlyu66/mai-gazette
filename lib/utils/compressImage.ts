/**
 * Nén ảnh client-side trước khi upload để giảm tải server.
 * - Giới hạn kích thước tối đa: 1600px (width hoặc height)
 * - Chất lượng JPEG: 80%
 * - Output luôn là JPEG (ngoại trừ PNG có độ trong suốt)
 */
export function compressImage(
  file: File,
  maxDimension = 1600,
  quality = 0.8,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Tính toán lại kích thước nếu vượt giới hạn
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height / width) * maxDimension);
          width = maxDimension;
        } else {
          width = Math.round((width / height) * maxDimension);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Không thể tạo canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Dùng JPEG cho ảnh thường, giữ PNG nếu có độ trong suốt (alpha)
      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Không thể nén ảnh'));
            return;
          }
          resolve(blob);
        },
        mimeType,
        quality,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Không thể tải ảnh để nén'));
    };

    img.src = objectUrl;
  });
}
