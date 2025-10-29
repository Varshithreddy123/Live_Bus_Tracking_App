import Svg, {Path} from 'react-native-svg';
import React from 'react';

export function Walking({colors, width, height}: {colors?: string; width?: number; height?: number}) {
  return (
    <Svg width={width || 24} height={height || 24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13.5 5.5C13.5 6.32843 12.8284 7 12 7C11.1716 7 10.5 6.32843 10.5 5.5C10.5 4.67157 11.1716 4 12 4C12.8284 4 13.5 4.67157 13.5 5.5Z"
        stroke={colors || '#065C46'}
        strokeWidth="2"
      />
      <Path
        d="M9 10L7 12L9 14L11 12L9 10Z"
        stroke={colors || '#065C46'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 10L17 12L15 14L13 12L15 10Z"
        stroke={colors || '#065C46'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 7V9"
        stroke={colors || '#065C46'}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M10 12L8 18"
        stroke={colors || '#065C46'}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M14 12L16 18"
        stroke={colors || '#065C46'}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}
