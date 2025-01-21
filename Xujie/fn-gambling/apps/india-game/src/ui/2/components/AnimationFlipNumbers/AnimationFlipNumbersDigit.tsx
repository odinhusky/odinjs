import { cx, useObserverElementMetrics } from '@libs/commonUtils';
import { remToPx } from '@libs/constant/style';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useEffect, useState } from 'react';

export enum FlipNumbersResType {
  AMOUNT_NUMBER = 'AMOUNT_NUMBER',
  NUMBER = 'NUMBER',
}

const amountNumberRes = {
  '.': getImgUrl(EResourceLevel.V, 'amount_number_period'),
  ',': getImgUrl(EResourceLevel.V, 'amount_number_comma'),
  '9': getImgUrl(EResourceLevel.V, 'amount_number_9'),
  '8': getImgUrl(EResourceLevel.V, 'amount_number_8'),
  '7': getImgUrl(EResourceLevel.V, 'amount_number_7'),
  '6': getImgUrl(EResourceLevel.V, 'amount_number_6'),
  '5': getImgUrl(EResourceLevel.V, 'amount_number_5'),
  '4': getImgUrl(EResourceLevel.V, 'amount_number_4'),
  '3': getImgUrl(EResourceLevel.V, 'amount_number_3'),
  '2': getImgUrl(EResourceLevel.V, 'amount_number_2'),
  '1': getImgUrl(EResourceLevel.V, 'amount_number_1'),
  '0': getImgUrl(EResourceLevel.V, 'amount_number_0'),
};

const numberRes = {
  '.': getImgUrl(EResourceLevel.V, 'number_period'),
  ',': getImgUrl(EResourceLevel.V, 'number_comma'),
  '9': getImgUrl(EResourceLevel.V, 'number_9'),
  '8': getImgUrl(EResourceLevel.V, 'number_8'),
  '7': getImgUrl(EResourceLevel.V, 'number_7'),
  '6': getImgUrl(EResourceLevel.V, 'number_6'),
  '5': getImgUrl(EResourceLevel.V, 'number_5'),
  '4': getImgUrl(EResourceLevel.V, 'number_4'),
  '3': getImgUrl(EResourceLevel.V, 'number_3'),
  '2': getImgUrl(EResourceLevel.V, 'number_2'),
  '1': getImgUrl(EResourceLevel.V, 'number_1'),
  '0': getImgUrl(EResourceLevel.V, 'number_0'),
};

const flipNumbersRes = {
  [FlipNumbersResType.AMOUNT_NUMBER]: amountNumberRes,
  [FlipNumbersResType.NUMBER]: numberRes,
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

interface AnimationFlipNumbersDigitProps {
  height?: number; // 以 px 為單位
  value: string;
  delay?: string;
  resType?: FlipNumbersResType;
}

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
        <img
          className={cx(digitClass)}
          style={{
            ...sizeStyle(resType, height, '.'),
          }}
          src={flipNumbersRes[resType]['.'] || ''}
          // src={getImgUrl(EResourceLevel.V, 'amount_number_period')}
          alt="Number dot image"
        />

        {/* , */}
        <img
          className={cx(digitClass)}
          style={{
            ...sizeStyle(resType, height, ','),
          }}
          src={flipNumbersRes[resType][','] || ''}
          // src={getImgUrl(EResourceLevel.V, 'amount_number_comma')}
          alt="Number comma image"
        />

        {/* 9 */}
        <img
          className={digitClass}
          style={{
            ...sizeStyle(resType, height, '9'),
          }}
          src={flipNumbersRes[resType]['9'] || ''}
          // src={getImgUrl(EResourceLevel.V, 'amount_number_9')}
          alt="Number nine image"
        />

        {/* 8 */}
        <img
          className={digitClass}
          style={{
            ...sizeStyle(resType, height, '8'),
          }}
          src={flipNumbersRes[resType]['8'] || ''}
          // src={getImgUrl(EResourceLevel.V, 'amount_number_8')}
          alt="Number eight image"
        />

        {/* 7 */}
        <img
          className={digitClass}
          style={{
            ...sizeStyle(resType, height, '7'),
          }}
          src={flipNumbersRes[resType]['7'] || ''}
          // src={getImgUrl(EResourceLevel.V, 'amount_number_7')}
          alt="Number seven image"
        />

        {/* 6 */}
        <img
          className={digitClass}
          style={{
            ...sizeStyle(resType, height, '6'),
          }}
          src={flipNumbersRes[resType]['6'] || ''}
          // src={getImgUrl(EResourceLevel.V, 'amount_number_6')}
          alt="Number six image"
        />

        {/* 5 */}
        <img
          className={digitClass}
          style={{
            ...sizeStyle(resType, height, '5'),
          }}
          src={flipNumbersRes[resType]['5'] || ''}
          // src={getImgUrl(EResourceLevel.V, 'amount_number_5')}
          alt="Number five image"
        />

        {/* 4 */}
        <img
          className={digitClass}
          style={{
            ...sizeStyle(resType, height, '4'),
          }}
          src={flipNumbersRes[resType]['4'] || ''}
          // src={getImgUrl(EResourceLevel.V, 'amount_number_4')}
          alt="Number four image"
        />

        {/* 3 */}
        <img
          className={digitClass}
          style={{
            ...sizeStyle(resType, height, '3'),
          }}
          src={flipNumbersRes[resType]['3'] || ''}
          // src={getImgUrl(EResourceLevel.V, 'amount_number_3')}
          alt="Number three image"
        />

        {/* 2 */}
        <img
          className={digitClass}
          style={{
            ...sizeStyle(resType, height, '2'),
          }}
          src={flipNumbersRes[resType]['2'] || ''}
          // src={getImgUrl(EResourceLevel.V, 'amount_number_2')}
          alt="Number two image"
        />

        {/* 1 */}
        <img
          className={digitClass}
          style={{
            ...sizeStyle(resType, height, '1'),
          }}
          src={flipNumbersRes[resType]['1'] || ''}
          // src={getImgUrl(EResourceLevel.V, 'amount_number_1')}
          alt="Number one image"
        />

        {/* 0 */}
        <img
          className={digitClass}
          style={{
            ...sizeStyle(resType, height, '0'),
          }}
          src={flipNumbersRes[resType]['0'] || ''}
          // src={getImgUrl(EResourceLevel.V, 'amount_number_0')}
          alt="Number zero image"
        />
      </div>
    </div>
  );
};

export default AnimationFlipNumbersDigit;
