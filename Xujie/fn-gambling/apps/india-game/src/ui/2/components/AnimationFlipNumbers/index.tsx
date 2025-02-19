import { cx } from '@libs/commonUtils';
import { FLEX_CENTER } from '@libs/constant/style';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import AnimationFlipNumbersDigit, {
  FlipNumbersResType,
  sizeStyle,
} from '@components/AnimationFlipNumbersDigit';

interface AnimationFlipNumbersProps {
  numbers: string; // 只能包含 0~9 的數字字串,以及.
  hasDollarSign?: boolean;
  height?: number; // 以 px 為單位
  resType?: FlipNumbersResType;
}

export const AnimationFlipNumbers = ({
  height,
  numbers,
  hasDollarSign = true,
  resType = FlipNumbersResType.AMOUNT_NUMBER,
}: AnimationFlipNumbersProps) => {
  const currencyRes =
    resType === FlipNumbersResType.AMOUNT_NUMBER
      ? getImgUrl(EResourceLevel.V, 'amount_number_inr')
      : getImgUrl(EResourceLevel.V, 'number_inr');

  return (
    <div className={cx('animation-flip-numbers-container', FLEX_CENTER)}>
      {hasDollarSign ? (
        <img
          className={cx('block')}
          style={{
            ...sizeStyle(resType, height),
          }}
          src={currencyRes}
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
