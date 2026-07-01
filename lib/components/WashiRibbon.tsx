import { motion } from 'framer-motion';

export default function WashiRibbon({ color, bottom = false }: { color: string; bottom?: boolean }) {
  return (
    <div className={`relative w-full overflow-hidden bg-white/20 ${bottom ? 'h-1.5 rounded-b-3xl' : 'h-3'}`}>
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `repeating-linear-gradient(-45deg, ${color}, ${color} 4px, transparent 4px, transparent 8px)` }} />
      <div className="absolute inset-0 opacity-30" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      <div className="absolute inset-0 flex mix-blend-overlay">
        <motion.div
          animate={{ x: ['-100%', '0%', '-100%'], opacity: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="h-full w-1/2 rounded-full blur-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0.9) 85%, transparent 100%)' }}
        />
        <motion.div
          animate={{ x: ['100%', '0%', '100%'], opacity: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="h-full w-1/2 rounded-full blur-[1px]"
          style={{ background: 'linear-gradient(270deg, transparent 0%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0.9) 85%, transparent 100%)' }}
        />
      </div>
    </div>
  );
}
