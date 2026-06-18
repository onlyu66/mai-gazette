import { useState, useRef } from "react";
import * as htmlToImage from "html-to-image";

export const useWebcamCard = () => {
  const [tenThe, setTenThe] = useState<string>("BẠN THÂN");
  const [streamCamera, setStreamCamera] = useState<MediaStream | null>(null);
  const [anhChupThe, setAnhChupThe] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theCardRef = useRef<HTMLDivElement>(null);

  const moCamera = async () => {
    try {
      if (streamCamera) {
        streamCamera.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStreamCamera(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Không thể kết nối camera.");
    }
  };

  const chupAnh = () => {
    if (!streamCamera) return alert("Hãy bấm bật camera trước!");
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setAnhChupThe(canvas.toDataURL("image/png"));
      }
    }
  };

  const taiThePhongVien = () => {
    if (!theCardRef.current) return;
    const tenFile = tenThe.trim() || "phong_vien_danh_du";

    htmlToImage
      .toPng(theCardRef.current, { quality: 0.95, pixelRatio: 3 })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `The_Nha_Bao_${tenFile.replace(/\s+/g, "_")}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch(() => alert("Hệ thống đang xử lý, vui lòng bấm lại lần nữa!"));
  };

  return {
    tenThe,
    setTenThe,
    anhChupThe,
    videoRef,
    canvasRef,
    theCardRef,
    moCamera,
    chupAnh,
    taiThePhongVien,
    streamCamera,
  };
};
