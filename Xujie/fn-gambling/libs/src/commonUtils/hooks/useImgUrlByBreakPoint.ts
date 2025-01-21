import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { useBreakPoint } from './useBreakPoint';

// Evan 語意調整
export const useImgUrlByBreakPoint = () => {
  const { isMobile, isTablet } = useBreakPoint();

  const getImgUrlByBreakPoint = (
    picName: string,
    level: EResourceLevel = EResourceLevel.V,
    haveTablet: boolean = isMobile,
    haveMobile: boolean = isTablet
  ) => {
    return getImgUrl(
      level,
      `${picName}${
        isMobile
          ? haveMobile
            ? '_m'
            : ''
          : isTablet
          ? haveTablet
            ? '_t'
            : ''
          : ''
      }`
    );
  };

  return {
    getImgUrlByBreakPoint,
  };
};

export default useImgUrlByBreakPoint;
