import handleAction from '@mode2/action/common/handleAction';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import {
  handleInviteWheelClipboardReferralCodeClick,
  handleInviteWheelPageCashOutClickAction,
  handleInviteWheelPageNavToRecordClickAction,
  handleInviteWheelPageNavToRuleClickAction,
  handleInviteWheelPageNavToShareClickAction,
  handleInviteWheelPageOpenRuleModalClickAction,
  handleInviteWheelSpinButtonClick,
} from '@mode2/action/inviteWheelPageAction/actionType';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import { SharePosterType } from '@mode2/zustand/page/sharePageStore';
import { ActivityRulesContentTypes } from '@mode2/zustand/page/activityRulesPageStore';
import { ActivityRecordPageTypes } from '@libs/mode2/zustand/page/activityRecordPageStore';
import { RefObject } from 'react';
import {
  BASE_ROTATE_DEG,
  LOOP_ANIMATION_OPTIONS,
  RECHARGE_ZONE_DEG,
  RECHARGE_ZONE_DEG_OFFSET,
} from '@libs/constant/wheelConst';
import {
  useInviteWheelPageAnimateStore,
  useInviteWheelPageStoreStore,
  useInviteWheelRuleModalStore,
} from '@libs/mode2/zustand/page/inviteWheelPageStore';
import useInviteWheel from '@libs/mode2/usecase/page/inviteWheel/useInviteWheelWithdraw';
import sdkUtils from '@mode2/utils/sdk';
import { AdjustEventKey } from '@mode2/utils/sdk/persistant/adjust/AdjustEventKey';
import { ClipboardState, useClipboard } from '@libs/commonUtils';
import { useToastStore } from '@mode2/zustand/components/toastStore';
import { useTranslation } from 'react-i18next';
import handleGlobalClick from '@mode2/action/handleGlobalClick';

type ActionClickPayloadMap = {
  [handleInviteWheelPageNavToShareClickAction]: void;
  [handleInviteWheelPageCashOutClickAction]: {
    isWithdrawal: boolean;
  };
  [handleInviteWheelPageNavToRuleClickAction]: void;
  [handleInviteWheelPageNavToRecordClickAction]: void;
  [handleInviteWheelSpinButtonClick]: { isSpin: boolean };
  [handleInviteWheelClipboardReferralCodeClick]: { code: string; link: string };
  [handleInviteWheelPageOpenRuleModalClickAction]: void;
};

export interface HandleInviteWheelClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useInviteWheelPageActions = () => {
  const { navToSharePage, navToActivityRulePage, navToActivityRecordPage } =
    useNavPageClick();
  const { copyToClipboard } = useClipboard();
  const { onInviteWheelWithdraw } = useInviteWheel();
  const { t } = useTranslation();
  const setIsAnimating = useInviteWheelPageAnimateStore(
    (state) => state.setIsAnimating
  );
  const resetSpinWheel = useInviteWheelPageStoreStore(
    (state) => state.resetSpinWheel
  );
  const spinWheel = useInviteWheelPageStoreStore((state) => state.spinWheel);
  // const setSpinFastTotate = useInviteWheelPageStoreStore(
  //   (state) => state.setSpinFastTotate
  // );

  const setIsShowInviteWheelTipsModal = useInviteWheelPageStoreStore(
    (state) => state.setIsShowInviteWheelTipsModal
  );

  // const inviteWheelPortalInfo = useInviteWheelPageStoreStore(
  //   (state) => state.inviteWheelPortalInfo
  // );

  const showInviteWheelRuleModal = useInviteWheelRuleModalStore(
    (state) => state.showInviteWheelRuleModal
  );

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleInviteWheelPageNavToShareClickAction]: () => {
      handleGlobalClick({
        target: handleInviteWheelPageNavToShareClickAction,
        callback: () => {
          navToSharePage('', { state: { tab: SharePosterType.SHAREINVITE } });
        },
      });
    },
    [handleInviteWheelPageCashOutClickAction]: ({ isWithdrawal }) => {
      handleGlobalClick({
        target: handleInviteWheelPageCashOutClickAction,
        callback: () => {
          if (isWithdrawal) {
            onInviteWheelWithdraw();
          } else {
            setIsShowInviteWheelTipsModal(true);
          }
        },
      });
    },
    [handleInviteWheelPageNavToRuleClickAction]: () => {
      handleGlobalClick({
        target: handleInviteWheelPageNavToRuleClickAction,
        callback: () => {
          showInviteWheelRuleModal();
          navToActivityRulePage(``, {
            state: {
              tab: ActivityRulesContentTypes.INVITE_WHEEL_RULES_CONTENT,
            },
          });
        },
      });
    },
    [handleInviteWheelPageNavToRecordClickAction]: () => {
      handleGlobalClick({
        target: handleInviteWheelPageNavToRecordClickAction,
        callback: () => {
          navToActivityRecordPage(``, {
            state: {
              tab: ActivityRecordPageTypes.INVITE_WHEEL_WITHDRAWAL_RECORD_CONTENT,
            },
          });
        },
      });
    },
    [handleInviteWheelSpinButtonClick]: ({ isSpin }) => {
      handleGlobalClick({
        target: handleInviteWheelSpinButtonClick,
        callback: () => {
          if (isSpin) {
            spinWheel();
            // setSpinFastTotate(true);
          }
        },
      });
    },

    [handleInviteWheelClipboardReferralCodeClick]: ({ code, link }) => {
      handleGlobalClick({
        target: handleInviteWheelClipboardReferralCodeClick,
        callback: () => {
          sdkUtils.sendEvent(AdjustEventKey.CLICK_SHARE);
          copyToClipboard(link, true).then((state) => {
            if (state.state === ClipboardState.SUCCESS) {
              useToastStore.getState().showToast(t('Copy Success')); // TODO i18n
            }
          });
        },
      });
    },
    [handleInviteWheelPageOpenRuleModalClickAction]: () => {
      handleGlobalClick({
        target: handleInviteWheelPageOpenRuleModalClickAction,
        callback: () => {
          showInviteWheelRuleModal();
        },
      });
    },
  };

  const handleWheelSpinAnimation = ({
    ref,
    selectedIdx,
    rewardAmount,
  }: {
    ref: RefObject<HTMLDivElement>;
    selectedIdx: number;
    rewardAmount: number;
  }) => {
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
          console.log('@@@===> rewardAmount', rewardAmount);
          setIsAnimating(false);
          resetSpinWheel();
        }
      };
    }
  };

  const handleInviteWheelAction = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleInviteWheelClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };
  return {
    actionClickObj,
    handleInviteWheelAction,
    handleWheelSpinAnimation,
  };
};
