import React from 'react';

export type SlotCount = 1 | 2 | 3 | 4 | 6;

export interface Theme {
  id: string;
  label: string;
  emoji: string;
  selectorBg: string;

  cardStyle: React.CSSProperties;
  headerText: string;
  headerTextColor: string;

  gridWrapperBg: string;
  gridInnerBorder: string;

  message: string;
  messageColor: string;

  nameColor: string;
  dateColor: string;
  bottomBoxBg: string;

  decorLeft: string;
  decorRight: string;

  /** Two accent stops driving every animated element: ribbon, glow, sweep, tape, sparkles */
  accent: string;
  accent2: string;
  /** true = header ribbon sits on a light/translucent surface, so shimmer text stays colourful instead of going white */
  lightHeader?: boolean;
  /** true = dark card background, so the shine sweep uses 'screen' blend instead of 'overlay' */
  dark?: boolean;
  logo?: string;
}
