import React from 'react';
import { motion } from 'framer-motion';

export default function GallerySlider() {
  const items = [
    { icon: "📸", label: "[ Giờ thực tế săn tin ]" },
    { icon: "📝", label: "[ Đêm trắng chạy bài ]" },
    { icon: "🏫", label: "[ Giảng đường AJC ]" },
    { icon: "💐", label: "[ Rực rỡ mùa hoa đỏ ]" },
    { icon: "☕", label: "[ Những buổi họp tin ]" }
  ];

  return (
    <section id="goc-trien-lam" className="py-10 overflow-hidden border-t border-b border-rose-200/20 bg-black/5 select-none">
      <div className="mb-6 px-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span className="font-mono text-xs uppercase tracking-widest opacity-60">Thanh xuân qua lăng kính phóng viên</span>
        </div>
        <span className="text-[10px] font-mono opacity-40 italic">Thời gian chuyển động vô tận mượt mà ⏸</span>
      </div>
      
      <div className="flex w-max flex-nowrap">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity }}
          className="flex flex-nowrap pr-6 space-x-6"
        >
          {[...items, ...items].map((item, idx) => (
            <div key={idx} className="w-72 h-48 bg-zinc-800 rounded-2xl flex-shrink-0 flex flex-col items-center justify-center text-white/30 border border-white/5 relative overflow-hidden shadow-md">
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-[10px] font-mono tracking-wider uppercase">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}