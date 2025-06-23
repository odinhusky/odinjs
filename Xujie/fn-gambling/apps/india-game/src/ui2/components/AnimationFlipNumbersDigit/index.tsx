import { AnimationFlipNumbersDigitProps } from './AnimationFlipNumbersDigitProps';
import { remToPx } from '@constant/style';
import { FlipNumbersResType } from '@mode2/@types/flipNumbersResType';

export const sizeStyle = (
  resType: FlipNumbersResType,
  height?: number,
  value?: string
) => {
  const heightNum = height || 32;
  const heightRem = heightNum / remToPx;

  const widthRem =
    resType === FlipNumbersResType.AMOUNT_NUMBER
      ? value === '.' || value === ','
        ? heightRem * 0.218
        : heightRem * 0.5
      : value === '.' || value === ','
      ? heightRem * 0.234375
      : heightRem * 0.75;
  // const widthRem =
  //   value === '.' || value === ',' ? heightRem * 0.218 : heightRem * 0.5;
  // const widthRem2 =
  //   value === '.' || value === ',' ? heightRem * 0.234375 : heightRem * 0.75;
  return {
    width: `${widthRem}rem`,
    height: `${heightRem}rem`,
  };
};

export const AnimationFlipNumbersDigit = (
  props: AnimationFlipNumbersDigitProps
) => {
  return null;
};

export default AnimationFlipNumbersDigit;
