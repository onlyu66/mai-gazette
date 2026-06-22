import { useState } from 'react';
import toast from 'react-hot-toast';
import { updateGalleryOrder } from '@/lib/services/api';
import { GalleryImageRecord } from '@/lib/types';

export function useGalleryReorder(
  images: GalleryImageRecord[],
  setImages: React.Dispatch<React.SetStateAction<GalleryImageRecord[]>>
) {
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const handleSaveOrder = async () => {
    try {
      setReordering(true);
      const updates = images.map((img, index) => ({ id: img.id, order_index: index }));
      await updateGalleryOrder(updates);
      toast.success("Đã lưu lại vị trí mới của ảnh! 📸");
      setIsReorderMode(false);
    } catch (error: unknown) {
      toast.error("Lỗi khi lưu vị trí: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setReordering(false);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (isReorderMode) {
      setDraggedItemIndex(index);
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (isReorderMode) e.preventDefault();
  };

  const handleDragEnter = (index: number) => {
    if (!isReorderMode || draggedItemIndex === null || draggedItemIndex === index) return;
    const newImages = [...images];
    const draggedItem = newImages[draggedItemIndex];
    newImages.splice(draggedItemIndex, 1);
    newImages.splice(index, 0, draggedItem);
    setImages(newImages);
    setDraggedItemIndex(index);
  };

  const handleDragEnd = () => setDraggedItemIndex(null);

  const handleTouchStart = (index: number) => {
    if (isReorderMode) {
      setDraggedItemIndex(index);
      document.body.style.overflow = 'hidden';
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isReorderMode || draggedItemIndex === null) return;
    
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!target) return;
    
    const targetItem = target.closest('[data-index]');
    if (targetItem) {
      const targetIndex = parseInt(targetItem.getAttribute('data-index') || '-1', 10);
      if (targetIndex !== -1 && targetIndex !== draggedItemIndex) {
        const rect = targetItem.getBoundingClientRect();
        const thresholdX = rect.width * 0.25;
        const thresholdY = rect.height * 0.25;
        
        if (
          touch.clientX > rect.left + thresholdX &&
          touch.clientX < rect.right - thresholdX &&
          touch.clientY > rect.top + thresholdY &&
          touch.clientY < rect.bottom - thresholdY
        ) {
          const newImages = [...images];
          const draggedItem = newImages[draggedItemIndex];
          newImages.splice(draggedItemIndex, 1);
          newImages.splice(targetIndex, 0, draggedItem);
          setImages(newImages);
          setDraggedItemIndex(targetIndex);
        }
      }
    }
  };

  const handleTouchEnd = () => {
    setDraggedItemIndex(null);
    document.body.style.overflow = '';
  };

  return {
    isReorderMode,
    setIsReorderMode,
    reordering,
    draggedItemIndex,
    handleSaveOrder,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragEnd,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
