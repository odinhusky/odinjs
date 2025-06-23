import { cx, useDeepEffect } from '@libs/commonUtils';
import { FLEX_CENTER } from '@libs/constant/style';
import { PrizeWheelType } from '@libs/mode2/@types/prizeWheelType';
import { useDepositJackpotWheelModalActions } from '@libs/mode2/action/model/DepositJackpotWheelModalAction/useDepositJackpotWheelModalAction';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';
import { getImgUrl, EResourceLevel } from '@libs/mode2/utils';
import useDepositJackpotWheelModalStore from '@libs/mode2/zustand/modal/DepositJackpotWheelModal';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { handleDepositJackpotWheelModalMaskClick } from '@mode2/action/actionTypes';

export const DepositJackpotWheelModalSpinWheel = () => {
  const { t } = useTranslation();
  const { handleWheelSpinAnimation, handleDepositJackpotWheelModalClick } =
    useDepositJackpotWheelModalActions();

  const spinWheelRef = useRef<HTMLDivElement>(null);

  const prizeWheelType = useDepositJackpotWheelModalStore(
    (state) => state.prizeWheelType
  );
  const prizeWheelIndex = useDepositJackpotWheelModalStore(
    (state) => state.prizeWheelIndex
  );

  const depositJackpotWheelRemainSpin = useDepositJackpotWheelModalStore(
    (state) => state.depositJackpotWheelRemainSpin
  );
  const depositJackpotWheelSpinList = useDepositJackpotWheelModalStore(
    (state) => state.depositJackpotWheelSpinList
  );

  const startSpinAnimation = useDepositJackpotWheelModalStore(
    (state) => state.startSpinAnimation
  );

  const lastPrizeWheelRotate = useDepositJackpotWheelModalStore(
    (state) => state.lastPrizeWheelRotate
  );

  // const spinAnimationFinish = useDepositJackpotWheelModalStore(
  //   (state) => state.spinAnimationFinish
  // );

  // 沒有 spin 次數 和 得獎的時候，指針與文字需要變灰色，等動畫結束再變灰
  const isDisabled =
    prizeWheelType !== PrizeWheelType.NONE ||
    depositJackpotWheelRemainSpin === 0;
  // ||(spinAnimationFinish && prizeWheelType !== PrizeWheelType.NONE); // 等動畫結束再變灰會閃一下

  useDeepEffect(() => {
    // TODO desp 過多 spin過一次後，下次打開 Modal 造成直接執行轉盤動畫
    if (startSpinAnimation && prizeWheelIndex >= 0) {
      handleWheelSpinAnimation({
        ref: spinWheelRef,
        selectedIdx: prizeWheelIndex,
        rouletteRotateOffset: -66,
      });
    }
  }, [startSpinAnimation, prizeWheelIndex]);

  return (
    <div
      className={cx(FLEX_CENTER)}
      onClick={() => {
        handleDepositJackpotWheelModalClick({
          actionName: handleDepositJackpotWheelModalMaskClick,
        });
      }}
    >
      <div className={cx('w-[436px] h-[436px] relative')}>
        {/* 外環 */}
        <BaseCacheImg
          src={getImgUrl(
            EResourceLevel.POPUP_BANNER,
            'popup_deposit_wheel_frame'
          )}
          className={cx('w-full h-full', 'absolute top-0 left-0')}
        />

        {/* 指針  */}
        <div
          className={cx('w-full h-full', 'absolute top-0 left-0 z-30')}
          // onClick={() => {
          //   handleDepositJackpotWheelModalClick({
          //     actionName: handleDepositJackpotWheelModalSpinStart,
          //   });
          // }}
        >
          <BaseCacheImg
            src={getImgUrl(
              EResourceLevel.POPUP_BANNER,
              isDisabled
                ? 'popup_deposit_wheel_button_disabled' // 指針停留在得獎的獎品時，按鈕變灰
                : 'popup_deposit_wheel_button_default'
            )}
            className={cx('w-full h-full')}
          />
          <p
            className={cx(
              'text-base font-bold',
              FLEX_CENTER,
              'flex-col',
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              {
                'bgi-text-[var(--base-1-60)]': !isDisabled,
                'bgi-text-[var(--grayscale-60)]': isDisabled, // 指針停留在得獎的獎品時，變灰
              }
            )}
          >
            <span className="mt-1 leading-4">
              {t('deposit_wheel_spin_button').toLocaleUpperCase()}
            </span>
            {depositJackpotWheelRemainSpin > 1 ? (
              <span className="text-xl font-bold leading-5">
                x{depositJackpotWheelRemainSpin}
              </span>
            ) : null}
          </p>
        </div>

        {/* 獎勵區域 */}
        <div
          className={cx('w-full h-full overflow-hidden rounded-full')}
          ref={spinWheelRef}
          style={
            lastPrizeWheelRotate === 0
              ? {}
              : {
                  transform: `rotate(${lastPrizeWheelRotate}deg)`,
                }
          }
        >
          {/* 底盤 */}
          <BaseCacheImg
            src={getImgUrl(
              EResourceLevel.POPUP_BANNER,
              'popup_deposit_wheel_surface'
            )}
            className={cx('w-full h-full', 'absolute top-0 left-0')}
          />
          {depositJackpotWheelSpinList.map((item, index) => {
            return (
              <div
                key={item.indexKey}
                className={cx(
                  'w-full h-full',
                  'absolute',
                  'transform origin-center'
                )}
                style={{
                  clipPath: 'polygon(0% 2%, 50% 50%, 0% 50%, 0% 0%)',
                  transform: `rotate(${45 * index + 66}deg)`,
                  transition: 'transform 4s cubic-bezier(0.33, 1, 0.68, 1)',
                }}
              >
                <div
                  className={cx(
                    'w-28 h-12',
                    'text-base font-bold text-center',
                    FLEX_CENTER,
                    'absolute top-[29%] left-[4%] -rotate-[66deg]',
                    {
                      'bgi-text-[var(--base-1-40)]': index % 2 === 0,
                      'bgi-text-[var(--base-1-90)]': index % 2 === 1,
                    }
                  )}
                  style={{
                    textShadow: index % 2 === 1 ? 'var(--text-shadow-40)' : '',
                  }}
                >
                  {item.name}
                </div>
                <BaseCacheImg
                  src={getImgUrl(
                    EResourceLevel.ICONS,
                    'icon_popup_deposit_wheel_bonus' + (index + 1)
                  )}
                  className={cx(
                    'w-16 h-16',
                    'absolute top-[33%] left-[20%] -rotate-[66deg]'
                  )}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DepositJackpotWheelModalSpinWheel;
