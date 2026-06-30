'use client';

import { motion } from 'framer-motion';

const MESSAGES = [
  '🌸 Chúc mừng tốt nghiệp Phan Ngọc Mai — Cử nhân Báo chí 2026!',
  '🎓 Hành trình 4 năm kết thúc, nhưng ký ức thanh xuân sẽ mãi còn đây',
  '🌷 Mỗi lời chúc là một bông hoa trong vườn kỷ niệm của chúng ta',
  '✨ Cảm ơn bạn đã ghé thăm lưu bút kỷ yếu tốt nghiệp của Mai',
  '💕 Những tháng năm đại học — rực rỡ, đáng nhớ và thật nhiều yêu thương',
];

const TICKER_CONTENT = [...MESSAGES, ...MESSAGES];

export default function MarqueeTicker() {
  return (
    <div
      className="overflow-hidden py-2.5 select-none"
      style={{
        background: 'linear-gradient(90deg, #fda4af, #f43f5e, #e11d48, #f43f5e, #fda4af)',
        borderBottom: '1px solid rgba(244,63,94,0.3)',
      }}
    >
      <div className="flex w-max flex-nowrap">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 35, ease: 'linear', repeat: Infinity }}
          className="flex space-x-16 pr-16 items-center flex-nowrap whitespace-nowrap text-white text-xs tracking-[0.15em] font-medium"
        >
          {TICKER_CONTENT.map((msg, i) => (
            <span key={i}>{msg}</span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}