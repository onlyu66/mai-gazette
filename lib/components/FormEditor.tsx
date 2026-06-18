import React, { ChangeEvent } from 'react';
import { LuuButFormData } from '../types';

interface FormEditorProps {
  formData: LuuButFormData;
  updateField: (field: keyof LuuButFormData, value: string) => void;
  onSubmit: () => Promise<void>;
  loading: boolean;
}

export default function FormEditor({ formData, updateField, onSubmit, loading }: FormEditorProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateField('anhBase64', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bao-chi text-2xl font-bold uppercase">Biên Tập Trang Nhất</h2>
        <p className="text-xs opacity-60">Sáng tạo số báo đặc biệt gửi gắm những lời chúc ý nghĩa</p>
      </div>
      
      <div className="space-y-4 text-xs font-bold text-gray-800">
        <div className="space-y-1">
          <label className="uppercase tracking-widest text-gray-500">1. Tiêu Điểm Báo Chí</label>
          <select 
            value={formData.tieuDe} 
            onChange={(e) => updateField('tieuDe', e.target.value)} 
            className="w-full p-3.5 rounded-xl border border-rose-300/30 bg-white"
          >
            <option value="PHAN NGỌC MAI: NỮ CỬ NHÂN XUẤT SẮC ĐÃ CHÍNH THỨC LỘ DIỆN!">#TinTucBanThan — PHAN NGỌC MAI: NỮ CỬ NHÂN XUẤT SẮC!</option>
            <option value="CHẤN ĐỘNG: NGÒI BÚT VÀNG NGÀNH BÁO CHÍ CHÍNH THỨC RA TRƯỜNG!">#PhongSuThanhXuan — NGÒI BÚT VÀNG CHÍNH THỨC RA TRƯỜNG!</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="uppercase tracking-widest text-gray-500">2. Tải Ảnh Phóng Sự</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full bg-white p-2 rounded-xl" />
        </div>

        <div className="space-y-1">
          <label className="uppercase tracking-widest text-gray-500">3. Nội Dung Lời Chúc</label>
          <textarea 
            rows={5} 
            value={formData.noiDung}
            onChange={(e) => updateField('noiDung', e.target.value)}
            placeholder="Nhập lời chúc của bạn tại đây..." 
            className="w-full p-3.5 rounded-xl font-normal text-sm border resize-none"
          />
        </div>

        <div className="space-y-1">
          <label className="uppercase tracking-widest text-gray-500">4. Đính Kèm Quà Nhuận Bút</label>
          <div className="grid grid-cols-3 gap-2 text-[11px] font-medium text-gray-700">
            {['💐 Đóa hoa tươi', '🧋 Ly trà sữa', '🎙️ Chiếc Micro'].map(qua => (
              <label key={qua} className="flex items-center justify-center space-x-1 bg-white p-3 rounded-xl border cursor-pointer">
                <input 
                  type="radio" 
                  name="qua" 
                  value={qua} 
                  checked={formData.quaTang === qua} 
                  onChange={() => updateField('quaTang', qua)} 
                />
                <span>{qua.split(' ')[1] || qua}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label className="uppercase tracking-widest text-gray-500">5. Ký Tên Phóng Viên</label>
          <input 
            type="text" 
            value={formData.tacGia}
            onChange={(e) => updateField('tacGia', e.target.value)}
            placeholder="Bút danh của bạn..." 
            className="w-full p-3.5 rounded-xl font-normal text-sm border"
          />
        </div>
      </div>

      <button 
        type="button" 
        onClick={onSubmit}
        disabled={loading}
        className="w-full bg-gray-900 text-white font-bold uppercase text-xs py-4 rounded-xl tracking-widest hover:bg-rose-600 transition"
      >
        {loading ? "ĐANG ẤN HÀNH XUẤT BẢN..." : "GỬI BÀI & ẤN HÀNH TRANG NHẤT ➔"}
      </button>
    </div>
  );
}