import React from 'react';
import { hexToRgba } from './constants';

export default function WashiTape({ accent, side }: { accent: string; side: 'left' | 'right' }) {
  const rot = side === 'left' ? '-8deg' : '7deg';
  return (
    <div
      className="pb-tape"
      style={{
        top: '-14px',
        [side]: '26px',
        width: '74px',
        height: '26px',
        background: `repeating-linear-gradient(45deg, ${hexToRgba(accent, 0.55)} 0px, ${hexToRgba(accent, 0.55)} 6px, ${hexToRgba('#ffffff', 0.45)} 6px, ${hexToRgba('#ffffff', 0.45)} 12px)`,
        boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ['--pb-tape-rot' as any]: rot,
        borderRadius: '2px',
        zIndex: 5,
      } as React.CSSProperties}
    />
  );
}
