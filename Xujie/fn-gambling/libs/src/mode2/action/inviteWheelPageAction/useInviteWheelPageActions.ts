import handleAction from '@mode2/action/common/handleAction';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import {
  handleInviteWheelPageCashOutClickAction,
  handleInviteWheelPageNavToRecordClickAction,
  handleInviteWheelPageNavToRuleClickAction,
  handleInviteWheelPageNavToShareClickAction,
  handleInviteWheelSpinButtonClick,
} from '@mode2/action/inviteWheelPageAction/actionType';
import handleGlobalScroll from '@mode2/action/handleGlobalScroll';
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
} from '@libs/mode2/zustand/page/inviteWheelPageStore';
import useInviteWheel from '@libs/mode2/usecase/page/inviteWheel/useInviteWheelWithdraw';

type ActionClickPayloadMap = {
  [handleInviteWheelPageNavToShareClickAction]: void;
  [handleInviteWheelPageCashOutClickAction]: {
    isWithdrawal: boolean;
  };
  [handleInviteWheelPageNavToRuleClickAction]: void;
  [handleInviteWheelPageNavToRecordClickAction]: void;
  [handleInviteWheelSpinButtonClick]: { isSpin: boolean };
};

export interface HandleInviteWheelClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useInviteWheelPageActions = () => {
  const { navToSharePage, navToActivityRulePage, navToActivityRecordPage } =
    useNavPageClick();

  const { onInviteWheelWithdraw } = useInviteWheel();

  const setIsAnimating = useInviteWheelPageAnimateStore(
    (state) => state.setIsAnimating
  );
  const resetSpinWheel = useInviteWheelPageStoreStore(
    (state) => state.resetSpinWheel
  );
  const spinWheel = useInviteWheelPageStoreStore((state) => state.spinWheel);
  const setSpinFastTotate = useInviteWheelPageStoreStore(
    (state) => state.setSpinFastTotate
  );

  const setIsShowInviteWheelTipsModal = useInviteWheelPageStoreStore(
    (state) => state.setIsShowInviteWheelTipsModal
  );

  // const inviteWheelPortalInfo = useInviteWheelPageStoreStore(
  //   (state) => state.inviteWheelPortalInfo
  // );

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleInviteWheelPageNavToShareClickAction]: () => {
      handleGlobalScroll({
        target: handleInviteWheelPageNavToShareClickAction,
        callback: () => {
          navToSharePage('', { state: { tab: SharePosterType.SHAREINVITE } });
        },
      });
    },
    [handleInviteWheelPageCashOutClickAction]: ({ isWithdrawal }) => {
      handleGlobalScroll({
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
      handleGlobalScroll({
        target: handleInviteWheelPageNavToRuleClickAction,
        callback: () => {
          navToActivityRulePage(``, {
            state: {
              tab: ActivityRulesContentTypes.INVITE_WHEEL_RULES_CONTENT,
            },
          });
        },
      });
    },
    [handleInviteWheelPageNavToRecordClickAction]: () => {
      handleGlobalScroll({
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
      handleGlobalScroll({
        target: handleInviteWheelSpinButtonClick,
        callback: () => {
          if (isSpin) {
            spinWheel();
            setSpinFastTotate(true);
          }
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
