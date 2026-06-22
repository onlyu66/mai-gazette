import React from 'react';

export default function PhotoSlot({
  img, index, selected, onClick, innerBorder
}: {
  img: string; index: number; selected: boolean; onClick: () => void; innerBorder: string;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        width: '100%', height: '100%', position: 'relative',
        cursor: 'pointer', overflow: 'hidden',
        border: innerBorder, borderRadius: '6px',
        background: img ? '#000' : 'rgba(0,0,0,0.03)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
      }}
    >
      {img ? (
        <img key={img} className="pb-slot-img" src={img} alt={`Slot ${index + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ textAlign: 'center', opacity: 0.4 }}>
          <div style={{ fontSize: '24px' }}>📷</div>
          <div style={{ fontSize: '9px', fontWeight: 700, marginTop: '4px', textTransform: 'uppercase' }}>
            Slot {index + 1}
          </div>
        </div>
      )}
      {selected && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(244,63,94,0.15)',
          border: '4px solid #f43f5e',
          pointerEvents: 'none',
          boxShadow: 'inset 0 0 10px rgba(244,63,94,0.5)'
        }} />
      )}
    </div>
  );
}
