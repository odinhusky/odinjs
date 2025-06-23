import {
  ScreenOrientationType,
  useTemplateLayoutStore,
} from '@libs/mode2/zustand/template/templateLayoutStore';
import { useEffect } from 'react';
import { useOrientation } from 'react-use';

export const useDetectOrientation = () => {
  const { type: orientationType } = useOrientation();
  useEffect(() => {
    console.log('!! orientationType', orientationType);
    useTemplateLayoutStore
      .getState()
      .setScreenOrientation(
        orientationType?.includes('landscape')
          ? ScreenOrientationType.Landscape
          : ScreenOrientationType.Portrait
      );
  }, [orientationType]);
};

export default useDetectOrientation;
