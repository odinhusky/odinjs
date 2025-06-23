import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx } from '@libs/commonUtils';
import BaseModal from '@libs/components/Modal';
import { FIT, FLEX_COL, XY_CENTER, X_CENTER } from '@libs/constant/style';
import { PrizeWheelType } from '@libs/mode2/@types/prizeWheelType';
import {
  handleDepositJackpotWheelRewardModalCashCloseBtnClick,
  handleDepositJackpotWheelRewardModalDoubleBonusCloseBtnClick,
  handleDepositJackpotWheelRewardModalEmptyClick,
  handleDepositJackpotWheelRewardModalGoToDepositBtnClick,
  handleDepositJackpotWheelRewardModalSpinCloseBtnClick,
  handleDepositJackpotWheelRewardModalSpinNowBtnClick,
} from '@libs/mode2/action/actionTypes';
import { useDepositJackpotWheelModalActions } from '@libs/mode2/action/model/DepositJackpotWheelModalAction/useDepositJackpotWheelModalAction';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import useDepositJackpotWheelModalStore from '@libs/mode2/zustand/modal/DepositJackpotWheelModal';
import { CloseBtnUnit } from '@modals/BaseModalCloseButton';
import DepositJackpotWheelRewardModalCountDown from './components/DepositJackpotWheelRewardModalCountDown';

export const DepositJackpotWheelRewardModal = () => {
  const isShowDepositJackpotWheelRewardModal = useDepositJackpotWheelModalStore(
    (state) => state.isShowDepositJackpotWheelRewardModal
  );

  const prizeWheelType = useDepositJackpotWheelModalStore(
    (state) => state.prizeWheelType
  );

  const prizeWheelName = useDepositJackpotWheelModalStore(
    (state) => state.prizeWheelName
  );

  const prizeWheelIcon = useDepositJackpotWheelModalStore(
    (state) => state.prizeWheelIcon
  );

  // = styles
  const baseBtnClass = cx('w-[196px] h-[44px]', 'text-lg');

  const { handleDepositJackpotWheelModalClick } =
    useDepositJackpotWheelModalActions();

  return isShowDepositJackpotWheelRewardModal &&
    prizeWheelType !== PrizeWheelType.NONE ? (
    <BaseModal className={cx('bgi-[var(--transparent-gray-90)]')}>
      <>
        {/* Deposit Double Bouns */}
        {prizeWheelType === PrizeWheelType.DEPOSIT_BONUS ? (
          <div
            className={cx(
              'max-w-[480px] w-full',
              'absolute',
              X_CENTER,
              'top-[126px]'
            )}
          >
            {/* 關閉按鈕 */}
            <CloseBtnUnit
              onClose={() => {
                handleDepositJackpotWheelModalClick({
                  actionName:
                    handleDepositJackpotWheelRewardModalDoubleBonusCloseBtnClick,
                });
              }}
              customClass={cx(
                'w-9 h-9',
                'absolute top-[-52px] right-[22px]',
                'border-0'
              )}
            />

            {/* 背景光 */}
            <BaseCacheImg
              className={cx('w-full', 'block')}
              src={getImgUrl(
                EResourceLevel.POPUP_BANNER,
                'bg_deposit_wheel_award'
              )}
            />

            {/* Congratulations */}
            <div className={cx(FIT, 'absolute top-0', X_CENTER, 'w-[408px]')}>
              <BaseCacheImg
                className={cx('w-full', 'block')}
                src={getImgUrl(
                  EResourceLevel.POPUP_BANNER,
                  'deposit_wheel_double_bonus_title'
                )}
              />
            </div>

            {/* Icon */}
            <div className={cx(FIT, 'absolute', XY_CENTER)}>
              <BaseCacheImg
                className={cx('w-[152px] h-[152px]', 'block')}
                src={getImgUrl(
                  EResourceLevel.ICONS,
                  `icon_popup_deposit_wheel_bonus${prizeWheelIcon + 1}`
                )}
              />
            </div>

            {/* 文字區塊 */}
            <div
              className={cx(
                'max-w-[438px] w-full',
                'absolute top-[314px]',
                X_CENTER,
                FLEX_COL,
                'items-center'
              )}
            >
              <div
                className={cx('bgi-text-[var(--base-2-variant1)]', 'text-lg')}
              >
                You’ve unlocked the
              </div>
              <div
                className={cx(
                  'bgi-text-[var(--base-1-variant3)]',
                  'text-2xl',
                  'font-bold',
                  'mb-4'
                )}
              >
                {prizeWheelName || '2X Deposit Bonus'}
              </div>
              <div
                className={cx(
                  'bgi-text-[var(--grayscale-100)]',
                  'text-2xl',
                  'font-medium',
                  'mb-3'
                )}
              >
                Ends in <DepositJackpotWheelRewardModalCountDown />
              </div>

              <div className={cx(FIT)}>
                <BasePrimaryBtn
                  className={cx(baseBtnClass)}
                  children="Go to Deposit"
                  onClick={() => {
                    handleDepositJackpotWheelModalClick({
                      actionName:
                        handleDepositJackpotWheelRewardModalGoToDepositBtnClick,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        ) : null}

        {/* Free Spins */}
        {prizeWheelType === PrizeWheelType.SPIN ||
        prizeWheelType === PrizeWheelType.CASH ? (
          <div
            className={cx(
              'max-w-[328px] w-full h-fit',
              'absolute top-[128px]',
              X_CENTER
            )}
          >
            {/* 關閉按鈕 */}
            <CloseBtnUnit
              onClose={() => {
                handleDepositJackpotWheelModalClick({
                  actionName:
                    prizeWheelType === PrizeWheelType.SPIN
                      ? handleDepositJackpotWheelRewardModalSpinCloseBtnClick
                      : prizeWheelType === PrizeWheelType.CASH
                      ? handleDepositJackpotWheelRewardModalCashCloseBtnClick
                      : handleDepositJackpotWheelRewardModalEmptyClick,
                });
              }}
              customClass={cx(
                'w-9 h-9',
                'absolute top-[-48px] right-0',
                'border-0'
              )}
            />

            {/* 背景 */}
            <BaseCacheImg
              className={cx('w-full', 'block')}
              src={getImgUrl(
                EResourceLevel.POPUP_BANNER,
                'bg_deposit_wheel_cash_and_spins'
              )}
            />

            {/* Icon */}
            <div
              className={cx(FIT, 'absolute', X_CENTER, {
                'top-[2px]': prizeWheelType === PrizeWheelType.SPIN,
                'top-[28.5px]': prizeWheelType === PrizeWheelType.CASH,
              })}
            >
              <BaseCacheImg
                className={cx('block', {
                  'w-[136px] h-[136px]': [
                    PrizeWheelType.CASH,
                    PrizeWheelType.SPIN,
                  ].includes(prizeWheelType),
                })}
                src={getImgUrl(
                  EResourceLevel.ICONS,
                  `icon_popup_deposit_wheel_bonus${prizeWheelIcon + 1}`
                )}
              />
            </div>

            {/* 文字部分 */}
            <div
              className={cx(
                'max-w-[200px]',
                FIT,
                'absolute',
                {
                  'top-[146px]': prizeWheelType === PrizeWheelType.SPIN,
                  'top-[172px]': prizeWheelType === PrizeWheelType.CASH,
                },
                X_CENTER,
                FLEX_COL,
                'gap-1',
                'items-center'
              )}
            >
              <div
                className={cx('bgi-text-[var(--base-2-variant1)]', 'text-lg')}
              >
                You've won
              </div>
              <div
                className={cx(
                  'text-2xl',
                  'bgi-text-[var(--base-1-variant3)]',
                  'font-bold'
                )}
              >
                {prizeWheelName || '1 Free Spin'}
              </div>
            </div>

            {/* 按鈕部分 */}
            {prizeWheelType === PrizeWheelType.SPIN ? (
              <div className={cx(FIT, 'absolute top-[226px]', X_CENTER)}>
                <BasePrimaryBtn
                  className={cx(baseBtnClass)}
                  children="Spin Now"
                  onClick={() => {
                    handleDepositJackpotWheelModalClick({
                      actionName:
                        handleDepositJackpotWheelRewardModalSpinNowBtnClick,
                    });
                  }}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </>
    </BaseModal>
  ) : null;
};

export default DepositJackpotWheelRewardModal;
