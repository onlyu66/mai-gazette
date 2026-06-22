import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { insertGalleryImage, uploadGalleryImage } from '@/lib/services/api';
import { compressImage } from '@/lib/utils/compressImage';
import { GalleryImageRecord } from '@/lib/types';

export function useGalleryUpload(
  categoryId: string,
  images: GalleryImageRecord[],
  setImages: React.Dispatch<React.SetStateAction<GalleryImageRecord[]>>
) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        toast.error(`File "${file.name}" không phải là ảnh hợp lệ.`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`Ảnh "${file.name}" quá lớn (tối đa 10MB).`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    setUploadProgress({ done: 0, total: validFiles.length });

    const newRecords: GalleryImageRecord[] = [];
    const currentMaxOrder = images.length > 0 ? Math.max(...images.map(img => img.order_index || 0)) : 0;

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      try {
        const compressedBlob = await compressImage(file);
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';

        const uploadedUrl = await uploadGalleryImage(compressedBlob, mimeType);
        if (!uploadedUrl) throw new Error('Không nhận được URL sau khi upload');

        const newOrderIndex = currentMaxOrder + 1 + i;
        const newRecord = await insertGalleryImage(categoryId, uploadedUrl, newOrderIndex);
        newRecords.push(newRecord);

        setUploadProgress({ done: i + 1, total: validFiles.length });
      } catch (err: unknown) {
        console.error(err);
        const message = err instanceof Error ? err.message : String(err);
        toast.error(`Lỗi khi tải ảnh "${file.name}": ${message}`);
      }
    }

    if (newRecords.length > 0) {
      setImages(prev => [...prev, ...newRecords]);
      toast.success(`Đã tải lên ${newRecords.length}/${validFiles.length} ảnh thành công! 📸`);
    }

    setUploading(false);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return {
    uploading,
    uploadProgress,
    fileInputRef,
    handleFileChange,
  };
}
