import Svg, {Path} from 'react-native-svg';
import React from 'react';

export function Cash({colors, width, height}: {colors?: string; width?: number; height?: number}) {
  return (
    <Svg width={width || 24} height={height || 24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 9V7C17 5.89543 16.1046 5 15 5H9C7.89543 5 7 5.89543 7 7V9"
        stroke={colors || '#065C46'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 9H19C20.1046 9 21 9.89543 21 11V15C21 16.1046 20.1046 17 19 17H5C3.89543 17 3 16.1046 3 15V11C3 9.89543 3.89543 9 5 9H7"
        stroke={colors || '#065C46'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 9V7C7 5.89543 7.89543 5 9 5H15C16.1046 5 17 5.89543 17 7V9"
        stroke={colors || '#065C46'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 12C13.1046 12 14 12.8954 14 14C14 15.1046 13.1046 16 12 16C10.8954 16 10 15.1046 10 14C10 12.8954 10.8954 12 12 12Z"
        stroke={colors || '#065C46'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
