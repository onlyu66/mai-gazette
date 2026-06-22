import { useState, useRef, useCallback, ChangeEvent } from 'react';
import toast from 'react-hot-toast';

export function useCamera(selectedGrid: number, selectedSlot: number, setSelectedSlot: (slot: number) => void) {
  const [images, setImages] = useState<string[]>(Array(6).fill(''));
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openCamera = async () => {
    try {
      if (stream) stream.getTracks().forEach(t => t.stop());
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch { toast.error('Không thể kết nối camera. Vui lòng cấp quyền truy cập.'); }
  };

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!stream) return toast.error('Hãy bật camera trước!');
    if (!video || !canvas) return;

    const size = Math.min(video.videoWidth, video.videoHeight);
    const targetSize = Math.min(size, 800); // Limit size to max 800x800 to prevent OOM
    
    canvas.width = targetSize;
    canvas.height = targetSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;

    ctx.translate(targetSize, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, startX, startY, size, size, 0, 0, targetSize, targetSize);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setImages(prev => { const next = [...prev]; next[selectedSlot] = dataUrl; return next; });

    if (selectedSlot < selectedGrid - 1) {
      setSelectedSlot(selectedSlot + 1);
    }
  }, [stream, selectedSlot, selectedGrid, setSelectedSlot]);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const result = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 800;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxSize) { height = Math.round((height * maxSize) / width); width = maxSize; }
        } else {
          if (height > maxSize) { width = Math.round((width * maxSize) / height); height = maxSize; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setImages(prev => { const next = [...prev]; next[selectedSlot] = resizedDataUrl; return next; });
          if (selectedSlot < selectedGrid - 1) setSelectedSlot(selectedSlot + 1);
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const clearSlot = () => {
    setImages(prev => { const next = [...prev]; next[selectedSlot] = ''; return next; });
  };

  return {
    images,
    setImages,
    stream,
    videoRef,
    canvasRef,
    fileInputRef,
    openCamera,
    capturePhoto,
    handleUpload,
    clearSlot,
  };
}
