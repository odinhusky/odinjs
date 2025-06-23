import { cx, useObserverElementMetrics } from '@libs/commonUtils';
import { remToPx } from '@libs/constant/style';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useEffect, useState } from 'react';
import { AnimationFlipNumbersDigitProps } from '../AnimationFlipNumbersDigitProps';
import { FlipNumbersResType } from '@mode2/@types/flipNumbersResType';

// export enum FlipNumbersResType {
//   AMOUNT_NUMBER = 'AMOUNT_NUMBER',
//   NUMBER = 'NUMBER',
// }

const numberImgsV1 = {
  '.': getImgUrl(EResourceLevel.NUMBER_IMGS, 'number_imgs_v1_period'),
  ',': getImgUrl(EResourceLevel.NUMBER_IMGS, 'number_imgs_v1_comma'),
  '9': getImgUrl(EResourceLevel.NUMBER_IMGS, 'number_imgs_v1_9'),
  '8': getImgUrl(EResourceLevel.NUMBER_IMGS, 'number_imgs_v1_8'),
  '7': getImgUrl(EResourceLevel.NUMBER_IMGS, 'number_imgs_v1_7'),
  '6': getImgUrl(EResourceLevel.NUMBER_IMGS, 'number_imgs_v1_6'),
  '5': getImgUrl(EResourceLevel.NUMBER_IMGS, 'number_imgs_v1_5'),
  '4': getImgUrl(EResourceLevel.NUMBER_IMGS, 'number_imgs_v1_4'),
  '3': getImgUrl(EResourceLevel.NUMBER_IMGS, 'number_imgs_v1_3'),
  '2': getImgUrl(EResourceLevel.NUMBER_IMGS, 'number_imgs_v1_2'),
  '1': getImgUrl(EResourceLevel.NUMBER_IMGS, 'number_imgs_v1_1'),
  '0': getImgUrl(EResourceLevel.NUMBER_IMGS, 'number_imgs_v1_0'),
};

const numberImgsNamesV1 = {
  '.': 'number_imgs_v1_period',
  ',': 'number_imgs_v1_comma',
  '9': 'number_imgs_v1_9',
  '8': 'number_imgs_v1_8',
  '7': 'number_imgs_v1_7',
  '6': 'number_imgs_v1_6',
  '5': 'number_imgs_v1_5',
  '4': 'number_imgs_v1_4',
  '3': 'number_imgs_v1_3',
  '2': 'number_imgs_v1_2',
  '1': 'number_imgs_v1_1',
  '0': 'number_imgs_v1_0',
};

const numberImgsV2 = {
  '.': getImgUrl(EResourceLevel.NUMBER_IMGS, 'number_imgs_v2_period'),
  ',': getImgUrl(EResourceLevel.NUMBER_IMGS, 'number_imgs_v2_comma'),
  '9': getImgUrl(EResourceLevel.NUMBER_IMGS, 'number_imgs_v2_9'),
  '8': getImgUrl(EResourceLevel.NUMBER_IMGS, 'number_imgs_v2_8'),
  '7': getImgUrl(EResourceLevel.NUMBER_IMGS, 'number_imgs_v2_7'),
  '6': getImgUrl(EResourceLevel.NUMBER_IMGS, 'number_imgs_v2_6'),
  '5': getImgUrl(EResourceLevel.NUMBER_IMGS, 'number_imgs_v2_5'),
  '4': getImgUrl(EResourceLevel.NUMBER_IMGS, 'number_imgs_v2_4'),
  '3': getImgUrl(EResourceLevel.NUMBER_IMGS, 'number_imgs_v2_3'),
  '2': getImgUrl(EResourceLevel.NUMBER_IMGS, 'number_imgs_v2_2'),
  '1': getImgUrl(EResourceLevel.NUMBER_IMGS, 'number_imgs_v2_1'),
  '0': getImgUrl(EResourceLevel.NUMBER_IMGS, 'number_imgs_v2_0'),
};

const numberImgsNamesV2 = {
  '.': 'number_imgs_v2_period',
  ',': 'number_imgs_v2_comma',
  '9': 'number_imgs_v2_9',
  '8': 'number_imgs_v2_8',
  '7': 'number_imgs_v2_7',
  '6': 'number_imgs_v2_6',
  '5': 'number_imgs_v2_5',
  '4': 'number_imgs_v2_4',
  '3': 'number_imgs_v2_3',
  '2': 'number_imgs_v2_2',
  '1': 'number_imgs_v2_1',
  '0': 'number_imgs_v2_0',
};

const flipNumbersRes = {
  [FlipNumbersResType.AMOUNT_NUMBER]: numberImgsV1,
  [FlipNumbersResType.AMOUNT_NUMBER_V2]: numberImgsV1,
  [FlipNumbersResType.NUMBER]: numberImgsV2,
};

const flipNumbersResNames = {
  [FlipNumbersResType.AMOUNT_NUMBER]: numberImgsNamesV1,
  [FlipNumbersResType.AMOUNT_NUMBER_V2]: numberImgsNamesV1,
  [FlipNumbersResType.NUMBER]: numberImgsNamesV2,
};

const valueTable: Record<string, number> = {
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  ',': 10,
  '.': 11,
};

// Size 先固定寫死
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

// interface AnimationFlipNumbersDigitProps {
//   height?: number; // 以 px 為單位
//   value: string;
//   delay?: string;
//   resType?: FlipNumbersResType;
// }

export const AnimationFlipNumbersDigit = ({
  height,
  value,
  delay = '0s',
  resType = FlipNumbersResType.AMOUNT_NUMBER,
}: AnimationFlipNumbersDigitProps) => {
  const [bottomValue, setBottomValue] = useState(0);

  const digitClass = cx('block');
  const bottomTimes = valueTable[value];
  const { elementRef: maskRef, elementMetrics: maskMetrics } =
    useObserverElementMetrics<HTMLDivElement>();

  useEffect(() => {
    if (bottomTimes >= 0 && maskMetrics?.height) {
      setBottomValue(bottomTimes * maskMetrics?.height * -1);
    }
  }, [value, maskMetrics.height]);

  return (
    <div
      ref={maskRef}
      className={cx('mask-container', 'relative', 'overflow-hidden')}
      style={{
        ...sizeStyle(resType, height, value),
      }}
    >
      <div
        className={cx(
          'background-element',
          'absolute bottom-0 left-0 z-[1]',
          value === '.' || value === ','
            ? 'transition-[none]'
            : 'transition-[all]',
          'duration-1000',
          'ease-[cubic-bezier(0.25, 0.1, 0.25, 1)]'
        )}
        style={{
          transitionDelay: delay,
          bottom: bottomValue,
        }}
      >
        {/* <!-- 背景內容，可以是圖片、顏色、或其他元素 --> */}

        {/* . */}
        <BaseCacheImg
          className={cx(digitClass)}
          style={{
            ...sizeStyle(resType, height, '.'),
          }}
          src={flipNumbersRes[resType]['.'] || ''}
          imgName={flipNumbersResNames[resType]['.']}
          alt="Number dot image"
        />

        {/* , */}
        <BaseCacheImg
          className={cx(digitClass)}
          style={{
            ...sizeStyle(resType, height, ','),
          }}
          src={flipNumbersRes[resType][','] || ''}
          imgName={flipNumbersResNames[resType][',']}
          alt="Number comma image"
        />

        {/* 9 */}
        <BaseCacheImg
          className={digitClass}
          style={{
            ...sizeStyle(resType, height, '9'),
          }}
          src={flipNumbersRes[resType]['9'] || ''}
          imgName={flipNumbersResNames[resType]['9']}
          alt="Number nine image"
        />

        {/* 8 */}
        <BaseCacheImg
          className={digitClass}
          style={{
            ...sizeStyle(resType, height, '8'),
          }}
          src={flipNumbersRes[resType]['8'] || ''}
          imgName={flipNumbersResNames[resType]['8']}
          alt="Number eight image"
        />

        {/* 7 */}
        <BaseCacheImg
          className={digitClass}
          style={{
            ...sizeStyle(resType, height, '7'),
          }}
          src={flipNumbersRes[resType]['7'] || ''}
          imgName={flipNumbersResNames[resType]['7']}
          alt="Number seven image"
        />

        {/* 6 */}
        <BaseCacheImg
          className={digitClass}
          style={{
            ...sizeStyle(resType, height, '6'),
          }}
          src={flipNumbersRes[resType]['6'] || ''}
          imgName={flipNumbersResNames[resType]['6']}
          alt="Number six image"
        />

        {/* 5 */}
        <BaseCacheImg
          className={digitClass}
          style={{
            ...sizeStyle(resType, height, '5'),
          }}
          src={flipNumbersRes[resType]['5'] || ''}
          imgName={flipNumbersResNames[resType]['5']}
          alt="Number five image"
        />

        {/* 4 */}
        <BaseCacheImg
          className={digitClass}
          style={{
            ...sizeStyle(resType, height, '4'),
          }}
          src={flipNumbersRes[resType]['4'] || ''}
          imgName={flipNumbersResNames[resType]['4']}
          alt="Number four image"
        />

        {/* 3 */}
        <BaseCacheImg
          className={digitClass}
          style={{
            ...sizeStyle(resType, height, '3'),
          }}
          src={flipNumbersRes[resType]['3'] || ''}
          imgName={flipNumbersResNames[resType]['3']}
          alt="Number three image"
        />

        {/* 2 */}
        <BaseCacheImg
          className={digitClass}
          style={{
            ...sizeStyle(resType, height, '2'),
          }}
          src={flipNumbersRes[resType]['2'] || ''}
          imgName={flipNumbersResNames[resType]['2']}
          alt="Number two image"
        />

        {/* 1 */}
        <BaseCacheImg
          className={digitClass}
          style={{
            ...sizeStyle(resType, height, '1'),
          }}
          src={flipNumbersRes[resType]['1'] || ''}
          imgName={flipNumbersResNames[resType]['1']}
          alt="Number one image"
        />

        {/* 0 */}
        <BaseCacheImg
          className={digitClass}
          style={{
            ...sizeStyle(resType, height, '0'),
          }}
          src={flipNumbersRes[resType]['0'] || ''}
          imgName={flipNumbersResNames[resType]['0']}
          alt="Number zero image"
        />
      </div>
    </div>
  );
};

export default AnimationFlipNumbersDigit;
