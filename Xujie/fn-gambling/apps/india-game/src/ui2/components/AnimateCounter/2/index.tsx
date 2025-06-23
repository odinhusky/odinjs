import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { BaseCacheImgOrigin } from '@libs/mode2/components/BaseCacheImgOrigin';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useEffect, useRef, useState } from 'react';
import { AnimateCounterProps } from '../AnimateCounterProps';

const NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '.'];
const DIGIT_COUNT = 20;
const DIGIT_INDEXES = Array.from({ length: DIGIT_COUNT }, (_, i) => i);

export const AnimateCounter = ({
  from = 0,
  to,
  isImage,
  isFormatByDecimalPlaces = true,
  duration = 2000,
  decimalPlaces = isImage ? 0 : 2,
  className,
  trigger,
  digitClass,
  digitWidthSettings,
  isUserFormatterInImage = false,
  formatter,
  updateInterval = 70, // 最低更新毫秒數是 16.67 ms
  leadingUnitImgName = 'number_imgs_v3_unit',
  endUnitImgName,
  leadingUnitImgClass,
  endUnitImgClass,
  imageDigitNameFn,
}: AnimateCounterProps) => {
  const [count, setCount] = useState(from);
  const step = Math.pow(10, -decimalPlaces); // 計算步進值
  const animationRef = useRef<number | null>(null); // 用來存動畫 ID

  useEffect(() => {
    if (from === to) {
      setCount(to); // 直接設置數值，跳過動畫
      return;
    }

    setCount(from); // 重置 count

    const startTime = performance.now();
    let lastUpdateTime = startTime; // 記錄上次更新的時間

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1); // 計算進度，按線性方式增長

      // 計算當前值，直接使用 progress
      let value = from + (to - from) * progress;

      if (isFormatByDecimalPlaces) {
        // 限制數字變化範圍，只允許 `decimalPlaces` 控制的精度
        value = Math.round(value / step) * step;
        // 解決浮點數問題
        value = parseFloat(value.toFixed(decimalPlaces));
      }

      // 只有當更新間隔超過 updateInterval 時，才更新 count
      if (currentTime - lastUpdateTime >= updateInterval) {
        setCount(value);
        lastUpdateTime = currentTime; // 更新 lastUpdateTime
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(updateCounter);
      } else {
        setCount(to); // 強制確保最終值
      }
    };

    animationRef.current = requestAnimationFrame(updateCounter);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [trigger, from, to, duration]);

  // 使用自訂格式化函數（如果沒有則使用預設格式）
  const formattedCount = formatter
    ? formatter(count)
    : count.toFixed(decimalPlaces);

  const paddedDigits = Array.from({ length: 20 }, (_, i) => {
    const strIndex = formattedCount.length - 20 + i;
    return strIndex >= 0 ? formattedCount[strIndex] : '';
  });

  return !isImage ? (
    <span className={className}>{formattedCount}</span>
  ) : (
    <div className={cx(FLEX_ITEMS_CENTER)}>
      {/* 前單位 */}
      {leadingUnitImgName ? (
        <div key={`Animated - leading - unit`}>
          <BaseCacheImgOrigin
            src={getImgUrl(EResourceLevel.NUMBER_IMGS, `${leadingUnitImgName}`)}
            imgName={leadingUnitImgName}
            alt="Number"
            className={cx('h-[96px]', digitClass, leadingUnitImgClass)}
          />
        </div>
      ) : null}

      {/* 數字 */}
      {/* {`${isUserFormatterInImage ? formattedCount : count}`
        .split('')
        .map((char, index) => {
          return NUMBERS.map((item, itemIndex) => (
            <div key={`Animated - ${char} - ${index * itemIndex} - ${item}`}>
              <BaseCacheImgOrigin
                src={getImgUrl(
                  EResourceLevel.NUMBER_IMGS,
                  imageDigitNameFn instanceof Function
                    ? imageDigitNameFn(char)
                    : `number_imgs_v3_${char}`
                )}
                imgName={
                  imageDigitNameFn instanceof Function
                    ? imageDigitNameFn(char)
                    : `number_imgs_v3_${char}`
                }
                alt={`Animated Counter Image ${char}`}
                className={cx('h-[96px]', 'hidden', digitClass, {
                  block: item === char,
                })}
              />
            </div>
          ));
        })} */}

      {DIGIT_INDEXES.map((digitIndex) => {
        return (
          <div
            key={`digit-${digitIndex}`}
            className={cx(
              `relative odin-${digitIndex} w-fit h-fit hidden`,
              digitClass,
              {
                block: paddedDigits[digitIndex],
              }
            )}
          >
            {NUMBERS.map((item) => {
              const imgName =
                imageDigitNameFn?.(item) ?? `number_imgs_v3_${item}`;

              return (
                <div key={`digit-${digitIndex}-${item}`}>
                  <BaseCacheImgOrigin
                    key={`digit-${digitIndex}-${item}-dummy`}
                    ckey={`digit-${digitIndex}-${item}-dummy`}
                    src={getImgUrl(EResourceLevel.NUMBER_IMGS, imgName)}
                    imgName={imgName}
                    alt={`Digit ${item}`}
                    className={cx(
                      'h-[96px]',
                      digitClass,
                      'opacity-0',
                      paddedDigits[digitIndex] === item ? 'block' : 'hidden'
                    )}
                  />

                  <BaseCacheImgOrigin
                    key={`digit-${digitIndex}-${item}`}
                    src={getImgUrl(EResourceLevel.NUMBER_IMGS, imgName)}
                    imgName={imgName}
                    alt={`Digit ${item}`}
                    className={cx(
                      'h-[96px]',
                      digitClass,
                      paddedDigits[digitIndex] === item ? 'block' : 'hidden',
                      'absolute left-0 top-0'
                    )}
                  />
                </div>
              );
            })}
          </div>
        );
      })}

      {/* 後單位 */}
      {endUnitImgName ? (
        <div key={`Animated - after - unit`}>
          <BaseCacheImgOrigin
            src={getImgUrl(EResourceLevel.NUMBER_IMGS, `${endUnitImgName}`)}
            imgName={endUnitImgName}
            alt="Number"
            className={cx('h-[96px]', digitClass, endUnitImgClass)}
          />
        </div>
      ) : null}
    </div>
  );
};

export default AnimateCounter;
