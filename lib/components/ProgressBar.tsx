'use client';

import { motion, useScroll } from 'framer-motion';

export function ProgressBar() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-rose-600 origin-left z-[10001]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
