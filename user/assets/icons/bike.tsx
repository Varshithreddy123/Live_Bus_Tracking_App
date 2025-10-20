import Svg, {Path} from 'react-native-svg';
import React from 'react';

export function Bike({colors, width, height}: {colors?: string; width?: number; height?: number}) {
  return (
    <Svg width={width || 24} height={height || 24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L14 8L16 6L18 10L20 8L22 12L20 14L18 16L16 14L14 18L12 16L10 20L8 18L6 22L4 20L2 24"
        stroke={colors || '#065C46'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 12L10 14L12 12L14 14L16 12"
        stroke={colors || '#065C46'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 16L8 18L10 16L12 18L14 16L16 18L18 16"
        stroke={colors || '#065C46'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
