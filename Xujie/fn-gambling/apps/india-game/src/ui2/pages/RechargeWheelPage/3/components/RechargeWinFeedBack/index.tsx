import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_COL, XY_CENTER } from '@libs/constant/style';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import AnimateCounter from '@components/AnimateCounter';
import rechargeWheelWinFeedBackStore, {
  RechargeWheelWinType,
} from '@mode2/zustand/components/rechargeWheelWinFeedBackStore';
import { useEffect } from 'react';
import fullAnimationStore, {
  AnimationType,
} from '@mode2/zustand/components/fullAnimationStore';

export const RechargeWinFeedBack = () => {
  const isShowWinFeedBack = rechargeWheelWinFeedBackStore(
    (state) => state.isShowWinFeedBack
  );
  const winType = rechargeWheelWinFeedBackStore((state) => state.winType);
  const moneyValue = rechargeWheelWinFeedBackStore((state) => state.moneyValue);
  const spinLevel = rechargeWheelWinFeedBackStore((state) => state.spinLevel);
  const winSpinNumber = rechargeWheelWinFeedBackStore(
    (state) => state.winSpinNumber
  );

  const setIsShowWinFeedBack = rechargeWheelWinFeedBackStore(
    (state) => state.setIsShowWinFeedBack
  );

  const openFullAnimation = fullAnimationStore(
    (state) => state.openFullAnimation
  );

  const commonHeight = 'h-[62px]';

  // 兩秒後關閉並且如果是金錢的話就開啟金錢的全螢幕動畫(FullAnimation)
  useEffect(() => {
    if (isShowWinFeedBack) {
      const x = setTimeout(() => {
        setIsShowWinFeedBack(false);

        // 把開啟金幣圖的邏輯寫在這裡
        if (winType === RechargeWheelWinType.MONEY) {
          openFullAnimation({
            type: AnimationType.RECHARGE_WHEEL_GET_MONEY,
            duration: 1500,
          });
        }
      }, 2000);

      return () => {
        clearTimeout(x);
      };
    }
  }, [isShowWinFeedBack]);

  return isShowWinFeedBack ? (
    <>
      {/* 遮罩 */}
      <div
        id="recharge-win-feedback-mask"
        className={cx(
          'w-screen h-screen',
          'fixed inset-0 z-[1008]',
          'bgi-[var(--transparent-gray-80)]'
        )}
      ></div>

      {/* 光的背景 */}
      <div
        className={cx('w-[480px] h-[480px]', 'absolute z-[1009]', XY_CENTER)}
      >
        <img
          src={getImgUrl(EResourceLevel.V, 'deposit_wheel_light')}
          alt="Light background image"
          className={cx(
            'block',
            'w-full h-full'
            // 'animate__animated animate__bounceIn'
          )}
        />
      </div>

      {/* 抽中數值 */}
      <div
        className={cx('w-auto ', commonHeight, 'absolute z-[1010]', XY_CENTER, {
          hidden: winType !== RechargeWheelWinType.MONEY,
        })}
      >
        <div
          className={cx('animate__animated', {
            animate__bounceIn:
              isShowWinFeedBack && winType === RechargeWheelWinType.MONEY,
            animate__fadeOut:
              !isShowWinFeedBack || winType !== RechargeWheelWinType.MONEY,
          })}
        >
          <AnimateCounter
            to={moneyValue}
            trigger={isShowWinFeedBack}
            duration={1000}
            isImage={true}
            digitClass={cx(commonHeight)}
          />
        </div>
      </div>

      {/* 抽中Spin */}
      <div
        className={cx('absolute z-[1010]', XY_CENTER, {
          hidden: winType !== RechargeWheelWinType.SPIN,
        })}
      >
        <div
          className={cx(FLEX_COL, 'gap-3', 'animate__animated', {
            animate__bounceIn:
              isShowWinFeedBack && winType === RechargeWheelWinType.SPIN,
            animate__fadeOut:
              !isShowWinFeedBack || winType !== RechargeWheelWinType.SPIN,
          })}
        >
          <img
            src={getImgUrl(EResourceLevel.V, `${spinLevel}_spin`)}
            alt="Spin level text image"
            className={cx('block', 'w-full h-[48px]')}
          />

          <div className={cx(FLEX_CENTER, commonHeight)}>
            <AnimateCounter
              to={winSpinNumber}
              trigger={isShowWinFeedBack}
              duration={1000}
              isImage={true}
              digitClass={cx(commonHeight)}
              leadingUnitImgName="number_imgs_v3_plus"
            />
          </div>
        </div>
      </div>
    </>
  ) : null;
};

export default RechargeWinFeedBack;
