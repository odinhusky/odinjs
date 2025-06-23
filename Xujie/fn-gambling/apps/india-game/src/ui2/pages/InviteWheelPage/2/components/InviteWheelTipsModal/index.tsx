import AnimationFlipNumbers from '@components/AnimationFlipNumbers';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx } from '@libs/commonUtils';
import BaseModal from '@libs/components/Modal';
import { FLEX_CENTER, FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { handleInviteWheelPageNavToShareClickAction } from '@mode2/action/actionTypes';
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
import BaseModalCloseButton from '@modals/BaseModalCloseButton';
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

interface InviteWheelTipsModalProps {}

export const InviteWheelTipsModal = ({}: InviteWheelTipsModalProps) => {
  const { t } = useTranslation();

  const { handleInviteWheelAction } = useInviteWheelPageActions();

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
    if (isShowInviteWheelTipsModal) {
      setTimeout(() => {
        setWithdrawCompletionRateProgress(withdrawCompletionRate);
      }, 100);
    } else {
      setWithdrawCompletionRateProgress(0);
    }
  }, [withdrawCompletionRate, isShowInviteWheelTipsModal]);

  return isShowInviteWheelTipsModal ? (
    <BaseModal
      children={
        <div
          className={cx(
            'max-w-[650px] w-[calc(100%-2rem)] h-auto',
            'bgi-[var(--base-1-dark)]',
            'bgi-border-[var(--base-1-light)]',
            'rounded-lg after-rounded-lg',
            'px-4 py-5',
            'relative'
          )}
        >
          <h3 className={cx(titleClass)}>
            {t('spin_and_share_wheel_withdrawal_time_remaining_popup_title')}
          </h3>

          <h3 className={cx(titleClass, '-mb-12')}>
            {remainFreeSpinCountDown
              ? formatCountdownTime(remainFreeSpinCountDown!)
              : '00:00:00'}
          </h3>

          <div className={cx('w-full', FLEX_CENTER, 'relative z-[0]')}>
            <BaseCacheImg
              src={getImgUrl(EResourceLevel.V, 'invitation_wheel_remaining')}
              imgName="invitation_wheel_remaining"
              alt="Background light image"
              className={cx(
                'block',
                'w-[342px]',
                'object-fit',
                'animate-pulse-scale-infinitely'
              )}
            />
          </div>

          <div className={cx('w-full', '-mt-12')}>
            <AnimationFlipNumbers
              numbers={`${requireCumulativeAmount}`}
              height={64}
            />
          </div>

          <div className={cx('w-full', FLEX_COL, 'gap-1', 'mt-3')}>
            <BaseProgress percent={withdrawCompletionRateProgress} />

            <div className={cx('w-full', FLEX_ITEMS_CENTER)}>
              <span
                className={cx(
                  'mr-auto',
                  'bgi-text-[var(--grayscale-100)]',
                  'text-sm'
                )}
              >
                <Trans
                  i18nKey="spin_and_share_wheel_withdrawal_time_remaining_popup_left"
                  values={{
                    money: formatMoney({
                      value: cashOutRewardDifference,
                      includeDecimal: true,
                    }),
                  }}
                  components={{
                    orangeTag: (
                      <span className={cx('bgi-text-[var(--base-2-main)]')} />
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
                {Math.floor(withdrawCompletionRate)}%
              </span>
            </div>
          </div>

          <div className={cx('w-full', 'mt-5')}>
            <BasePrimaryBtn
              className={cx('relative z-[1]')}
              children={t(
                'spin_and_share_wheel_withdrawal_time_remaining_popup_invite_button'
              )}
              onClick={() => {
                handleInviteWheelAction({
                  actionName: handleInviteWheelPageNavToShareClickAction,
                });
              }}
            />
          </div>

          <BaseModalCloseButton
            onClose={() => {
              setIsShowInviteWheelTipsModal(false);
            }}
          />
        </div>
      }
    />
  ) : null;
};

export default InviteWheelTipsModal;
