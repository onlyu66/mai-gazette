import React from 'react';
import { LuuButRecord } from '../types';

interface ArchiveFeedProps {
  list: LuuButRecord[];
}

export default function ArchiveFeed({ list }: ArchiveFeedProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {list.map((item) => (
        <div key={item.id} className="bg-white/70 backdrop-blur-md p-6 border rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-500 relative group overflow-hidden">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] font-mono uppercase font-bold">
              <span className="bg-rose-100 text-rose-600 px-2.5 py-1 rounded-md">
                {item.tieu_de?.includes("XUẤT SẮC") ? "#TinTucBanThan" : "#PhongSuThanhXuan"}
              </span>
              <span className="text-gray-400">
                {item.created_at ? new Date(item.created_at).toLocaleDateString('vi-VN') : '18/06/2026'}
              </span>
            </div>
            
            {item.anh_url && (
              <div className="w-full aspect-[16/10] rounded-xl overflow-hidden border border-gray-100 my-3">
                <img src={item.anh_url} alt="Lưu bút" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              </div>
            )}

            <div className="relative pl-3 border-l-2 border-rose-200 group-hover:border-rose-500 transition-colors">
              <p className="text-sm font-serif italic font-medium leading-relaxed text-gray-700">{item.noi_dung}</p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t flex justify-between items-center text-xs">
            <span className="text-gray-400 font-mono text-[11px]">
              Nhuận tống: <span className="text-zinc-700 font-medium">{item.qua_tang}</span>
            </span>
            <span className="font-nghe-thuat font-bold text-rose-600 text-base">{item.tac_gia}</span>
          </div>
        </div>
      ))}
    </div>
  );
}