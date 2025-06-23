import { cx } from '@libs/commonUtils';
import { FLEX_CENTER } from '@libs/constant/style';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import AnimationFlipNumbersDigit, {
  sizeStyle,
} from '@components/AnimationFlipNumbersDigit';
import { AnimationFlipNumbersProps } from '../AnimationFlipNumbersProps';
import { FlipNumbersResType } from '@mode2/@types/flipNumbersResType';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';

export const AnimationFlipNumbers = ({
  height,
  amountHeight,
  numbers,
  hasDollarSign = true,
  resType = FlipNumbersResType.AMOUNT_NUMBER,
  dollarClassName,
}: AnimationFlipNumbersProps) => {
  const imgName =
    resType === FlipNumbersResType.AMOUNT_NUMBER
      ? 'number_imgs_v1_unit'
      : resType === FlipNumbersResType.AMOUNT_NUMBER_V2
      ? 'number_imgs_v2_'
      : 'number_imgs_v2_unit';

  const currencyRes =
    resType === FlipNumbersResType.AMOUNT_NUMBER
      ? getImgUrl(EResourceLevel.NUMBER_IMGS, 'number_imgs_v1_unit')
      : resType === FlipNumbersResType.AMOUNT_NUMBER_V2
      ? getImgUrl(EResourceLevel.NUMBER_IMGS, 'number_imgs_v2_')
      : getImgUrl(EResourceLevel.V, 'number_imgs_v2_unit');

  const dollarHeight = amountHeight || height;

  return (
    <div className={cx('animation-flip-numbers-container', FLEX_CENTER)}>
      {hasDollarSign ? (
        <BaseCacheImg
          className={cx('block', dollarClassName)}
          style={{
            ...sizeStyle(resType, dollarHeight),
          }}
          src={currencyRes}
          imgName={imgName}
          alt="Number nine image"
        />
      ) : null}

      {numbers.split('').map((value, index) => (
        <AnimationFlipNumbersDigit
          key={`Digit-${index}`}
          value={value}
          height={height}
          delay={`${0.1 * index}s`}
          resType={resType}
        />
      ))}
    </div>
  );
};

export default AnimationFlipNumbers;
