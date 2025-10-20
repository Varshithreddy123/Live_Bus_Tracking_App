import Svg, {Path} from 'react-native-svg';
import React from 'react';

export function Swap({colors, width, height}: {colors?: string; width?: number; height?: number}) {
  return (
    <Svg width={width || 20} height={height || 20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 3L13 6L10 9"
        stroke={colors || '#065C46'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 17L7 14L10 11"
        stroke={colors || '#065C46'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13 6H4V17"
        stroke={colors || '#065C46'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 14H16V3"
        stroke={colors || '#065C46'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
