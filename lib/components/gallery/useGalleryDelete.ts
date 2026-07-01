import { deleteGalleryImage } from "@/lib/services/api";
import { GalleryImageRecord } from "@/lib/types";
import { useState } from "react";
import toast from "react-hot-toast";

export function useGalleryDelete(
  setImages: React.Dispatch<React.SetStateAction<GalleryImageRecord[]>>,
  selectedIds: string[],
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>,
  setIsSelectionMode: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingMultiple, setDeletingMultiple] = useState(false);

  const requestDelete = (id: string) => {
    setDeletingId(id);
    setDeletingMultiple(false);
  };

  const requestMultipleDelete = () => {
    if (selectedIds.length === 0) return;
    setDeletingMultiple(true);
  };

  const confirmDelete = async () => {
    if (!deletingId && !deletingMultiple) return;

    try {
      if (deletingMultiple) {
        const deletePromises = selectedIds.map((id) => deleteGalleryImage(id));
        await Promise.all(deletePromises);
        setImages((prev) =>
          prev.filter((img) => !selectedIds.includes(img.id)),
        );
        toast.success(`Đã xóa ${selectedIds.length} ảnh thành công 🗑️`);
        setSelectedIds([]);
        setIsSelectionMode(false);
        setDeletingMultiple(false);
      } else if (deletingId) {
        await deleteGalleryImage(deletingId);
        setImages((prev) => prev.filter((img) => img.id !== deletingId));
        toast.success("Đã xóa ảnh thành công 🗑️");
        setDeletingId(null);
      }
    } catch (error: unknown) {
      console.error(error);
      toast.error(
        "Lỗi khi xóa ảnh: " +
          (error instanceof Error ? error.message : String(error)),
      );
    }
  };

  const cancelDelete = () => {
    setDeletingId(null);
    setDeletingMultiple(false);
  };

  return {
    deletingId,
    deletingMultiple,
    requestDelete,
    requestMultipleDelete,
    confirmDelete,
    cancelDelete,
  };
}
