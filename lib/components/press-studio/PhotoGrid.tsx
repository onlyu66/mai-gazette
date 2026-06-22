import React from 'react';
import PhotoSlot from './PhotoSlot';
import { SlotCount } from './types';

export default function PhotoGrid({
  slots, images, selectedSlot, onSlotClick, innerBorder
}: {
  slots: SlotCount;
  images: string[];
  selectedSlot: number;
  onSlotClick: (i: number) => void;
  innerBorder: string;
}) {
  const renderSlot = (i: number) => (
    <PhotoSlot key={i} img={images[i] ?? ''} index={i}
      selected={selectedSlot === i} onClick={() => onSlotClick(i)} innerBorder={innerBorder} />
  );

  const gap = '8px';

  switch (slots) {
    case 1:
      return <div style={{ width: '100%', aspectRatio: '1/1' }}>{renderSlot(0)}</div>;
    case 2:
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap, width: '100%', aspectRatio: '4/3' }}>
          {renderSlot(0)}{renderSlot(1)}
        </div>
      );
    case 3:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap }}>
          <div style={{ width: '100%', aspectRatio: '2/1' }}>{renderSlot(0)}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap, aspectRatio: '2/1' }}>
            {renderSlot(1)}{renderSlot(2)}
          </div>
        </div>
      );
    case 4:
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap, width: '100%', aspectRatio: '1/1' }}>
          {[0, 1, 2, 3].map(renderSlot)}
        </div>
      );
    case 6:
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr 1fr', gap, width: '100%', aspectRatio: '2/3' }}>
          {[0, 1, 2, 3, 4, 5].map(renderSlot)}
        </div>
      );
    default:
      return null;
  }
}
