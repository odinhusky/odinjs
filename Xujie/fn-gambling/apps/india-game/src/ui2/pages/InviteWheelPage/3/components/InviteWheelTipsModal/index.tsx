import AnimationFlipNumbers from '@components/AnimationFlipNumbers';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import Icon from '@components/Icon';
import { cx } from '@libs/commonUtils';
import BaseModal from '@libs/components/Modal';
import { FLEX_CENTER, FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import {
  handleInviteWheelPageCashOutClickAction,
  handleInviteWheelPageNavToShareClickAction,
} from '@mode2/action/actionTypes';
import { useInviteWheelPageActions } from '@libs/mode2/action/inviteWheelPageAction/useInviteWheelPageActions';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';
import BaseProgress from '@libs/mode2/components/BaseProgress';
import {
  EResourceLevel,
  formatCountdownTime,
  formatMoney,
  getImgUrl,
} from '@libs/mode2/utils';
import { useInviteWheelPageStoreStore } from '@libs/mode2/zustand/page/inviteWheelPageStore';
import { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

// = classNames
const titleClass = cx(
  'text-lg text-center font-semibold',
  'bgi-text-[var(--grayscale-100)]',
  'relative z-[1]'
);

// export const BASE_REWARD_AMOUNT = 500;

// 時間點對應的秒數
const timeStages = [15, 60, 180];

// const timeStages = [5, 5, 5];

// interface InviteWheelTipsModalProps {}

// TODO i18n TODO Evan check 暫時以isWithdrawal為判斷是否顯示可以提現的樣式
export const InviteWheelTipsModal = () => {
  const { t } = useTranslation();

  const { handleInviteWheelAction } = useInviteWheelPageActions();

  const [isShow, setIsShow] = useState(false);

  const isShowInviteWheelTipsModal = useInviteWheelPageStoreStore(
    (state) => state.isShowInviteWheelTipsModal
  );

  const setIsShowInviteWheelTipsModal = useInviteWheelPageStoreStore(
    (state) => state.setIsShowInviteWheelTipsModal
  );

  const withdrawCompletionRate = useInviteWheelPageStoreStore(
    (state) => state.withdrawCompletionRate
  );

  const requireCumulativeAmount = useInviteWheelPageStoreStore(
    (state) => state.requireCumulativeAmount
  );

  const remainFreeSpinCountDown = useInviteWheelPageStoreStore(
    (state) => state.remainFreeSpinCountDown
  );

  const cashOutRewardDifference = useInviteWheelPageStoreStore(
    (state) => state.cashOutRewardDifference
  );

  const inviteWheelPortalInfo = useInviteWheelPageStoreStore(
    (state) => state.inviteWheelPortalInfo
  );

  // const cumulativeReward = get(inviteWheelPortalInfo, 'cumulativeReward', 0);
  const isWithdrawal = inviteWheelPortalInfo.isWithdrawal;
  const inviteWheelSpinToastFinish = useInviteWheelPageStoreStore(
    (state) => state.inviteWheelSpinToastFinish
  );
  // const isMeetBaseMoney = cumulativeReward >= BASE_REWARD_AMOUNT;

  // 計算待在邀請頁面的時候每隔一段時間，有滿足條件的話就跳出 Modal
  const [stage, setStage] = useState(0); // 當前階段，0 表示尚未開始
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 若所有階段完成 || modal 為開啟的狀態 || 符合領獎條件 || remainFreeSpinCountDown 是 0 的話，則停止計時
    if (stage >= timeStages.length || isShowInviteWheelTipsModal) {
      return;
    }

    // 設置計時器
    timerRef.current = setTimeout(() => {
      // 執行回調函式並移至下一階段
      setIsShowInviteWheelTipsModal(
        !isWithdrawal && inviteWheelSpinToastFinish
      );
      setStage((prevStage) => prevStage + 1); // 更新階段
    }, timeStages[stage] * 1000);

    return () => {
      // 清除計時器以避免重複執行
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [
    stage,
    timeStages,
    isShowInviteWheelTipsModal,
    isWithdrawal,
    inviteWheelSpinToastFinish,
  ]);

  // progress 動畫效果
  const [withdrawCompletionRateProgress, setWithdrawCompletionRateProgress] =
    useState(0);

  useEffect(() => {
    // const userRole = useUserProfileStore.getState().userRole;

    setIsShow(
      isShowInviteWheelTipsModal
      // && userRole === UserRoleType.USER
    );
    if (
      isShowInviteWheelTipsModal
      // && userRole === UserRoleType.USER
    ) {
      setTimeout(() => {
        setWithdrawCompletionRateProgress(withdrawCompletionRate);
      }, 100);
    } else {
      setWithdrawCompletionRateProgress(0);
    }
  }, [withdrawCompletionRate, isShowInviteWheelTipsModal]);

  return isShow ? (
    <BaseModal
      className="!bgi-[var(--transparent-gray-90)]"
      children={
        <div
          className={cx(
            'max-w-96 w-96 h-auto',
            'rounded-lg after-rounded-lg',
            'px-4 py-5',
            'relative'
          )}
        >
          {inviteWheelPortalInfo.cumulativeReward >= 500 ? (
            <div
              className={cx(
                'w-full',
                'text-center -mb-20',
                'bgi-text-[var(--grayscale-100)]'
              )}
            >
              <img
                src={getImgUrl(EResourceLevel.POPUP_BANNER, 'reward_title')}
                alt="reward_title"
              />
              <div className="text-sm bgi-text-[var(--base-2-variant1)]">
                Successfully obtained
              </div>
            </div>
          ) : (
            <>
              <h3
                className={cx(titleClass, '!bgi-text-[var(--base-2-variant2)]')}
              >
                {t(
                  'spin_and_share_wheel_withdrawal_time_remaining_popup_title'
                )}
              </h3>

              <h3 className={cx(titleClass, '-mb-16 text-4xl font-medium')}>
                {remainFreeSpinCountDown
                  ? formatCountdownTime(remainFreeSpinCountDown!)
                  : '00:00:00'}
              </h3>
            </>
          )}

          <div className={cx('w-full', FLEX_CENTER, 'relative z-[0]')}>
            <BaseCacheImg
              src={getImgUrl(
                EResourceLevel.V,
                'invitation_wheel_remaining',
                '.webp'
              )}
              imgName="invitation_wheel_remaining.webp"
              alt="Background light"
              className={cx(
                'block',
                'w-full',
                'object-fit'
                // 'animate-pulse-scale-infinitely'
              )}
            />
          </div>

          <div className={cx('w-full', isWithdrawal ? '-mt-12' : '-mt-[72px]')}>
            <AnimationFlipNumbers
              numbers={`${requireCumulativeAmount}`}
              height={48}
              amountHeight={27}
              dollarClassName="-mb-3"
            />
          </div>

          {inviteWheelPortalInfo.cumulativeReward >= 500 ? (
            <div className="mt-1.5 text-sm bgi-text-[var(--base-2-variant1)]">
              {t(
                'spin_and_share_wheel_withdrawal_time_remaining_popup_title_2'
              )}
            </div>
          ) : (
            <>
              <div
                className={cx(
                  'text-sm mt-9 text-center bgi-text-[var(--base-2-variant1)]'
                )}
              >
                {t(
                  'spin_and_share_wheel_withdrawal_time_remaining_popup_to_withdraw',
                  {
                    requireCumulativeAmount: formatMoney({
                      value: requireCumulativeAmount,
                    }),
                  }
                )}
              </div>
              <div className={cx('w-full', FLEX_COL, 'gap-1.5', 'mt-1.5')}>
                <BaseProgress
                  percent={withdrawCompletionRateProgress}
                  trailClass="overflow-hidden !bgi-[var(--base-2-variant6)]"
                  strokeClass="!bgi-none"
                  strokeWidth={22}
                  strokeStyle={{
                    background:
                      'repeating-linear-gradient(-45deg,rgba(255,255,255,0.3) 0px,rgba(255,255,255,0.3) 0.5rem,transparent 0.5rem,transparent 1rem), linear-gradient(to right,#F8836E,#F9FD6D)',
                  }}
                />

                <div className={cx('w-full', FLEX_ITEMS_CENTER)}>
                  <span
                    className={cx(
                      'mr-auto',
                      'bgi-text-[var(--grayscale-100)]',
                      'text-sm font-medium'
                    )}
                  >
                    <Trans
                      i18nKey="spin_and_share_wheel_withdrawal_time_remaining_popup_left"
                      values={{
                        money: formatMoney({
                          value: cashOutRewardDifference,
                          includeDecimal: true,
                          showCurrency: false,
                        }),
                      }}
                      components={{
                        orangeTag: (
                          <span
                            className={cx('bgi-text-[var(--base-1-main)]')}
                          />
                        ),
                      }}
                    />
                  </span>
                  <span
                    className={cx(
                      'text-right',
                      'text-sm',
                      'bgi-text-[var(--grayscale-100)]'
                    )}
                  >
                    {withdrawCompletionRate.toFixed(2)}%
                  </span>
                </div>
              </div>
            </>
          )}

          <div className={cx('w-full', 'mt-[60px]')}>
            <BasePrimaryBtn
              className={cx(
                'text-base h-12 font-medium relative z-[1] rounded-full'
              )}
              classNameText="!bgi-text-[var(--base-1-40)]"
              children={t(
                isWithdrawal
                  ? 'forgot_password_continue_button'
                  : 'spin_and_share_wheel_withdrawal_time_remaining_popup_invite_button'
              )}
              onClick={() => {
                if (isWithdrawal) {
                  setIsShowInviteWheelTipsModal(false);
                  handleInviteWheelAction({
                    actionName: handleInviteWheelPageCashOutClickAction,
                    payload: {
                      isWithdrawal: true,
                    },
                  });
                } else {
                  handleInviteWheelAction({
                    actionName: handleInviteWheelPageNavToShareClickAction,
                  });
                }
              }}
            />
          </div>

          <Icon
            onClick={() => {
              setIsShowInviteWheelTipsModal(false);
            }}
            name="ic_close"
            className={cx('w-9 h-9', 'absolute -top-9 right-0 cursor-pointer')}
          />
        </div>
      }
    />
  ) : null;
};

export default InviteWheelTipsModal;
