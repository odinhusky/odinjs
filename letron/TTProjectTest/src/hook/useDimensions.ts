import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');

interface DimensionsObj {
  fontScale: number;
  height: number;
  scale: number;
  width: number;
}

interface DimensionsInterface {
  window: DimensionsObj;
  screen: DimensionsObj;
}

export const useDimensions = () => {
  const [dimensions, setDimensions] = useState<DimensionsInterface>({
      window: windowDimensions,
      screen: screenDimensions,
    });

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({window, screen}) => {
        setDimensions({window, screen});
      },
    );
    return () => subscription?.remove();
  });

  return {
    dimensions,
    windowWidth: dimensions.window.width,
    windowHeight: dimensions.window.height,
    screenWidth: dimensions.screen.width,
    screenHeight: dimensions.screen.height,
  }
};

export default useDimensions;
