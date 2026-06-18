import React, { ReactNode } from 'react';
import { LuuButFormData } from '../types';

interface NewspaperPreviewProps {
  formData: LuuButFormData;
  formatDropCapText: (text: string) => ReactNode;
}

export default function NewspaperPreview({ formData, formatDropCapText }: NewspaperPreviewProps) {
  return (
    <div className="w-full max-w-xl bg-[#FBF9F4] text-[#1A1512] p-8 shadow-2xl border-[3px] border-[#1A1512] flex flex-col space-y-5 relative select-none">
      <div className="absolute inset-2 border border-[#1A1512]/20 pointer-events-none"></div>
      
      <div className="text-center space-y-1">
        <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-gray-500 font-mono">The Daily Graduation Journal</p>
        <h3 className="font-bao-chi text-4xl md:text-5xl font-black tracking-wider border-b-4 border-[#1A1512] pb-1">TẬP SAN THANH XUÂN</h3>
        <div className="flex justify-between items-center text-[9px] font-mono uppercase font-bold py-1.5 border-b border-[#1A1512]">
          <span>N° 2026.MAI</span>
          <span>Thứ Năm, 18 Tháng 6, 2026</span>
          <span className="text-rose-700">Giá: Vô Giá ✦</span>
        </div>
      </div>

      <h4 className="font-bao-chi text-xl md:text-2xl font-black text-center leading-tight uppercase text-zinc-900">
        {formData.tieuDe}
      </h4>

      <div className="grid md:grid-cols-12 gap-4 items-start pt-1">
        <div className="md:col-span-7 space-y-1.5 relative">
          <div className="w-full aspect-[4/3] bg-zinc-100 border border-[#1A1512] p-1.5 flex items-center justify-center overflow-hidden">
            {formData.anhBase64 ? (
              <img src={formData.anhBase64} alt="Phóng sự" className="w-full h-full object-cover" />
            ) : (
              <div className="text-[10px] font-mono text-gray-400 text-center uppercase p-4 tracking-wider">[ 📸 Ảnh phóng sự chưa tải lên ]</div>
            )}
          </div>
        </div>
        <div className="md:col-span-5 border-l border-dashed border-gray-300 pl-4 text-[9px] font-mono text-gray-500">
          <span className="text-rose-700 block font-bold">● LỜI TÒA SOẠN</span>
          <h5 className="font-nghe-thuat font-bold italic text-sm text-gray-800 mt-1">Hành trình vạn dặm bắt đầu từ nét mực đầu tiên.</h5>
        </div>
      </div>

      <div className="border-t border-[#1A1512] pt-3">
        <div className="text-[11px] font-serif text-zinc-800 leading-relaxed text-justify md:columns-2 gap-6">
          {formatDropCapText(formData.noiDung)}
        </div>
      </div>

      <div className="border-t-2 border-[#1A1512] pt-2.5 mt-auto flex justify-between items-center text-[10px] font-mono uppercase font-bold">
        <span>Đặc Phái Viên: <span className="underline decoration-double">{formData.tacGia || "Bạn Thân"}</span></span>
        <span className="text-rose-700">Nhuận bút: {formData.quaTang}</span>
      </div>
    </div>
  );
}