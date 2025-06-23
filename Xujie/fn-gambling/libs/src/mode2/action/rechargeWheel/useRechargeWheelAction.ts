import {
  handleRechargeQuestionIconClick,
  handleRechargeDataIconClick,
  handleRechargeDepositNowButtonClick,
  handleRechargeWheelTabClick,
  handleRechargeWheelSpinButtonClick,
} from '@mode2/action/actionTypes';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import handleGlobalClick from '@mode2/action/handleGlobalClick';
import handleAction from '@mode2/action/common/handleAction';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';
import { WalletPageTabType } from '@libs/mode2/@types/walletPageTabType';
import { ActivityRulesContentTypes } from '@libs/mode2/zustand/page/activityRulesPageStore';
import {
  RechargeWheelType,
  useRechargeWheelTabStore,
} from '@libs/mode2/zustand/components/rechargeWheelTabStore';
import { useToastStore } from '@libs/mode2/zustand/components/toastStore';
import { RefObject, useCallback } from 'react';
import {
  BASE_ROTATE_DEG,
  RECHARGE_ZONE_DEG,
  RECHARGE_ZONE_DEG_OFFSET,
  LOOP_ANIMATION_OPTIONS,
} from '@libs/constant/wheelConst';
import { formatMoney } from '@libs/mode2/utils';
import { ActivityRecordPageTypes } from '@libs/mode2/zustand/page/activityRecordPageStore';
import useMode2RechargeWheelPageStore from '@libs/mode2/zustand/page/rechargeWheelPage';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { WalletDashboardType } from '@libs/mode2/@types/walletDashboardTypes';
import { useWalletPageStore } from '@libs/mode2/zustand/page/WalletPage/walletPageStore';
import { useWalletPageSwitchContentTabsStore } from '@libs/mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';

interface HandleWheelSpinAnimationCallbackParams {
  isMoney: boolean;
}

interface HandleWheelSpinAnimationParams {
  ref: RefObject<HTMLDivElement>;
  isMoney: boolean;
  selectedIdx: number;
  rewardAmount: number;
  isShowToast?: boolean;
  callback?: ({ isMoney }: HandleWheelSpinAnimationCallbackParams) => void;
}

type ActionClickPayloadMap = {
  [handleRechargeQuestionIconClick]: void;
  [handleRechargeDataIconClick]: void;
  [handleRechargeDepositNowButtonClick]: void;
  [handleRechargeWheelTabClick]: { type: RechargeWheelType; isLocked: boolean };
  [handleRechargeWheelSpinButtonClick]: {
    type: RechargeWheelType;
  };
};

export interface HandleRechargeWheelActionProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useRechargeWheelAction = () => {
  const { t } = useTranslation();

  const { navToActivityRulePage, navToActivityRecordPage, navToWalletPage } =
    useNavPageClick();

  const activeRechargeActiveTab = useRechargeWheelTabStore(
    (state) => state.activeRechargeActiveTab
  );

  const setActiveRechargeActiveTab = useRechargeWheelTabStore(
    (state) => state.setActiveRechargeActiveTab
  );

  const showToast = useToastStore((state) => state.showToast);

  const setIsAnimatingObj = useMode2RechargeWheelPageStore(
    (state) => state.setIsAnimatingObj
  );

  const spinWheel = useMode2RechargeWheelPageStore((state) => state.spinWheel);

  const setSpinWheelLevel = useMode2RechargeWheelPageStore(
    (state) => state.setSpinWheelLevel
  );

  const setDisplayDashboardType = useWalletPageStore(
    (state) => state.setDisplayDashboardType
  );

  const setCurSwitchContentTabId = useWalletPageSwitchContentTabsStore(
    (state) => state.setCurSwitchContentTabId
  );

  // will remove
  // console.log('!! render');

  const handleWheelSpinAnimation = useCallback(
    ({
      ref,
      selectedIdx,
      isMoney,
      rewardAmount,
      isShowToast = true,
      callback,
    }: HandleWheelSpinAnimationParams) => {
      // const selectedIdx = Math.floor(Math.random() * 9);
      const additionalDeg =
        90 + (selectedIdx * -RECHARGE_ZONE_DEG + -RECHARGE_ZONE_DEG_OFFSET);
      const totalDeg = BASE_ROTATE_DEG + additionalDeg;
      const loopAnimation = [
        { transform: 'rotate(0deg)' },
        { transform: `rotate(${totalDeg}deg)` },
      ];
      if (ref.current) {
        const animation = ref.current.animate(
          loopAnimation,
          LOOP_ANIMATION_OPTIONS
        );

        animation.onfinish = () => {
          if (ref.current) {
            // 結束後設定在停止的地方
            ref.current.style.transform = `rotate(${totalDeg}deg)`;

            const callbackParams: HandleWheelSpinAnimationCallbackParams = {
              isMoney,
            };

            // 設定 rewardAmount 使其在動畫結束後出現
            if (isMoney) {
              const prizeToastId = uuidv4();
              if (isShowToast) {
                showToast(
                  t('deposit_wheel_win_prize_toast', {
                    rewardAmount: formatMoney({ value: rewardAmount || 200 }),
                  }),
                  (id) => {
                    if (id === prizeToastId) callback?.(callbackParams);
                  },
                  prizeToastId
                );
              } else {
                callback?.(callbackParams);
              }
            } else {
              if (isShowToast) {
                const nextSpinToastId = uuidv4();
                showToast(
                  t('deposit_wheel_win_next_spin_toast'),
                  (id) => {
                    if (id === nextSpinToastId) callback?.(callbackParams);
                  },
                  nextSpinToastId
                );
              } else {
                callback?.(callbackParams);
              }
            }

            // isAnimating 狀態個別更新
            setIsAnimatingObj(activeRechargeActiveTab, false);
          }
        };
      }
    },
    []
  );

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleRechargeQuestionIconClick]: () => {
      handleGlobalClick({
        target: handleRechargeQuestionIconClick,
        callback: () => {
          navToActivityRulePage(``, {
            state: {
              tab: ActivityRulesContentTypes.RECHARGE_WHEEL_RULES_CONTENT,
            },
          });
        },
      });
    },
    [handleRechargeDataIconClick]: () => {
      handleGlobalClick({
        target: handleRechargeDataIconClick,
        callback: () => {
          // navToRechargeWheelRecordsPage();
          navToActivityRecordPage('', {
            state: {
              tab: ActivityRecordPageTypes.RECHARGE_WHEEL_REWARDS_RECORD_CONTENT,
            },
          });
        },
      });
    },
    [handleRechargeDepositNowButtonClick]: () => {
      handleGlobalClick({
        target: handleRechargeDepositNowButtonClick,
        callback: () => {
          if (import.meta.env['VITE_V_VERSION'] === 'v6') {
            setDisplayDashboardType(WalletDashboardType.NONE);
            setCurSwitchContentTabId(WalletPageTabType.DEPOSIT);
          }
          navToWalletPage('', { state: { tab: WalletPageTabType.DEPOSIT } });
        },
      });
    },
    [handleRechargeWheelTabClick]: ({ type, isLocked }) => {
      handleGlobalClick({
        target: handleRechargeWheelTabClick,
        payload: { type, isLocked },
        callback: () => {
          console.log('clicked');
          if (isLocked && type === 'supreme') {
            showToast(t('deposit_wheel_coming_soon_toast'));
          } else {
            setActiveRechargeActiveTab(type);
          }
        },
        debounceTimer: isLocked && type === 'supreme' ? 300 : 0,
      });
    },
    [handleRechargeWheelSpinButtonClick]: ({ type }) => {
      handleGlobalClick({
        target: handleRechargeWheelSpinButtonClick,
        payload: { type },
        callback: () => {
          setSpinWheelLevel(type);
          spinWheel();
        },
      });
    },
  };

  const handleRechargeWheelClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleRechargeWheelActionProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleRechargeWheelClick,
    handleWheelSpinAnimation,
  };
};

export default useRechargeWheelAction;
