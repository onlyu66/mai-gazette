import React from 'react';

export default function Motes({ glyph, accent }: { glyph: string; accent: string }) {
  const motes = [
    { left: '6%', delay: '0s', size: '20px', dx: '14px' },
    { left: '22%', delay: '1.1s', size: '14px', dx: '-18px' },
    { left: '40%', delay: '2.4s', size: '22px', dx: '10px' },
    { left: '58%', delay: '0.5s', size: '15px', dx: '-12px' },
    { left: '76%', delay: '1.8s', size: '24px', dx: '16px' },
    { left: '90%', delay: '3.1s', size: '16px', dx: '-10px' },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', borderRadius: 'inherit', zIndex: 4 }}>
      {motes.map((m, i) => (
        <span
          key={i}
          className="pb-mote"
          style={{
            left: m.left, bottom: '4%', fontSize: m.size,
            animationDelay: m.delay,
            color: accent,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ['--pb-dx' as any]: m.dx,
          } as React.CSSProperties}
        >
          {i % 2 === 0 ? glyph : '✨'}
        </span>
      ))}
    </div>
  );
}
