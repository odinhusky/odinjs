import { usePlatformNotifyStore } from '@mode2/zustand/platform/platformNotifyStore';
import { useDeepEffect } from '@libs/commonUtils';
import hallAdModelInvoker from '@mode2/usecase/announcement/command/HallAdModelInvoker';
import { AnnouncementType } from '@mode2/@types/announcementType';
import {
  AdModelCommandType,
  HallAdModelCommand,
  SocketNotice,
  SourceFrom,
} from '@mode2/usecase/announcement/command/HallAdModelCommand';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { UserRoleType } from '@mode2/@types/userRoleTypes';
import useSurpriseRewardModalStore from '@mode2/zustand/modal/SurpriseRewardModal';
import { useMode2FirstChargeModalStore } from '@mode2/zustand/components/firstChargeStore';
import useInviteWheelModalStore from '@mode2/zustand/modal/InviteWheelModal';
import useTeamClubModalStore from '@mode2/zustand/modal/TeamClubModal';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import useModalLayoutStore from '@mode2/zustand/template/modalLayoutStore';
import useDailyRebateModalStore from '@mode2/zustand/modal/DailyRebateModal';
import usePostTGActivityModalStore from '@mode2/zustand/modal/PostTGActivityModal';
import useRankingActivityModalStore from '@mode2/zustand/modal/RankingActivityModal';
import { useLocation } from 'react-router';
import useWinningsShareModelStore from '@mode2/zustand/modal/WinningsShareModel';
import useGlobalAnnouncementStore from '@mode2/zustand/modal/GlobalAnnouncementModal';
import useDynamicActivityModalStore from '@mode2/zustand/modal/DynamicActivityModal';
import useTaskListModalStore from '@libs/mode2/zustand/modal/TaskListModal/useTaskListModalStore';
import { useRebateRewardModalStore } from '@mode2/zustand/components/rebateRewardModalStore';
import useLowBalanceRechargeModalStore from '@mode2/zustand/modal/LowBalanceRechargeModal';
import useLowBalanceRescueBoxModalStore from '@mode2/zustand/modal/LowBalanceRescueBoxModal';
import useDepositJackpotWheelModalStore from '@mode2/zustand/modal/DepositJackpotWheelModal';

// 角色可以顯示的公告類型 白名單
const userRoleSupportTypeWhitelist: Record<UserRoleType, AdModelCommandType[]> =
  {
    [UserRoleType.NONE]: [],
    [UserRoleType.GUEST]: [SocketNotice.GLOBAL_NOTICE],
    [UserRoleType.PLAYER]: [
      SocketNotice.GLOBAL_NOTICE,
      AnnouncementType.SURPRISE_REWARD, // 驚喜
      AnnouncementType.VIP_REBATE, // 每日反水
      AnnouncementType.FIRST_CHARGE, // 首次充值
      AnnouncementType.INVITE_WHEEL, // 邀請輪盤
      AnnouncementType.TEAM_CLUB, // 俱樂部
      AnnouncementType.GIFT_CODE, // GIFT_CODE
      AnnouncementType.RANKINGS, // Ranking 排行榜
      AnnouncementType.WINNINGS_SHARE, // 贏錢分享
      AnnouncementType.DYNAMIC_ACTIVITY,
      AnnouncementType.NEW_PLAYER_TASK, // 新手任務
      AnnouncementType.DAILY_TASK, // 每日任務
      AnnouncementType.PIGGY_BANK, // 存錢罐
      AnnouncementType.DEPOSIT_JACKPOT_WHEEL, // 充值大獎輪盤
    ],
    [UserRoleType.USER]: [
      SocketNotice.GLOBAL_NOTICE,
      AnnouncementType.SURPRISE_REWARD, // 驚喜
      AnnouncementType.VIP_REBATE, // 每日反水
      AnnouncementType.FIRST_CHARGE, // 首次充值
      AnnouncementType.INVITE_WHEEL, // 邀請輪盤
      AnnouncementType.TEAM_CLUB, // 俱樂部
      AnnouncementType.GIFT_CODE, // GIFT_CODE
      AnnouncementType.RANKINGS, // Ranking 排行榜
      AnnouncementType.WINNINGS_SHARE, // 贏錢分享
      AnnouncementType.DYNAMIC_ACTIVITY, //
      AnnouncementType.NEW_PLAYER_TASK, // 新手任務
      AnnouncementType.DAILY_TASK, // 每日任務
      AnnouncementType.PIGGY_BANK, // 存錢罐
      AnnouncementType.LOW_BALANCE_RECHARGE, // 破產充值優惠彈窗
      AnnouncementType.LOW_BALANCE_RESCUE_BOX, // 破產寶箱彈窗
      AnnouncementType.DEPOSIT_JACKPOT_WHEEL, // 充值大獎輪盤
    ],
  };

/**
 *  動態控制  HallPage 顯示順序，parameter, 顯示判斷邏輯
 */
export const useMobileExclusiveModalLayoutOverride = () => {
  const location = useLocation();
  const hallPopupAnnouncementsItems = usePlatformNotifyStore(
    (state) => state.hallPopupAnnouncementsItems
  );

  const setHallAdModelCommandTypes = useModalLayoutStore(
    (state) => state.setHallAdModelCommandTypes
  );
  const resetHallAdModelCommandTypes = useModalLayoutStore(
    (state) => state.resetHallAdModelCommandTypes
  );

  const verifyNextStepCount = useModalLayoutStore(
    (state) => state.verifyNextStepCount
  );

  const userRole = useUserProfileStore((state) => state.userRole);

  const closeAllAdModal = () => {
    const setShowStores = [
      // AnnouncementType.SURPRISE_REWARD
      useSurpriseRewardModalStore.getState().setShowSurpriseRewardModal,
      // AnnouncementType.SURPRISE_REWARD
      useDailyRebateModalStore.getState().setShowDailyRebateModal,
      // AnnouncementType.FIRST_CHARGE
      useMode2FirstChargeModalStore.getState()
        .setIsShowFirstChargeDiscountModal,
      // AnnouncementType.INVITE_WHEEL
      useInviteWheelModalStore.getState().setShowInviteWheelModal,
      // AnnouncementType.TEAM_CLUB
      useTeamClubModalStore.getState().setShowTeamClubModal,
      // AnnouncementType.TEAM_CLUB
      usePostTGActivityModalStore.getState().setShowPostTGActivityModal,
      // AnnouncementType.RANKINGS
      useRankingActivityModalStore.getState().setShowRankingActivityModal,
      // AnnouncementType.DYNAMIC_ACTIVITY
      useDynamicActivityModalStore.getState().setShowDynamicActivityModal,
      // AnnouncementType.WINNINGS_SHARE
      // useWinningsShareModelStore.getState().setShowWinningsShareModel,
      // SocketNotice.GLOBAL_NOTICE
      // useGlobalAnnouncementStore.getState().setShowGlobalAnnouncementModal, // 备用
      // AnnouncementType.NEW_PLAYER_TASK || AnnouncementType.DAILY_TASK
      useTaskListModalStore.getState().setShowTaskListModal,
      // AnnouncementType.PIGGY_BANK
      useRebateRewardModalStore.getState().setIsShowRebateRewardModal,
      // AnnouncementType.LOW_BALANCE_RECHARGE,
      useLowBalanceRechargeModalStore.getState().setShowLowBalanceRechargeModal,
      // AnnouncementType.LOW_BALANCE_RESCUE_BOX
      useLowBalanceRescueBoxModalStore.getState()
        .setShowLowBalanceRescueBoxModal,
      // AnnouncementType.DEPOSIT_JACKPOT_WHEEL
      useDepositJackpotWheelModalStore.getState()
        .setShowDepositJackpotWheelModal,
    ];

    setShowStores.forEach((item) => item(false));
  };

  /**
   * 針對 hallAdModelInvoker [insertCommandToFront, addCommand] 單筆進入列隊情況，
   * 如果當前都沒有modal 顯示將無法觸發 [executeNext]
   */
  const verifyExecuteNextStep = () => {
    const isShowStates = [
      // AnnouncementType.SURPRISE_REWARD
      useSurpriseRewardModalStore.getState().isShowSurpriseRewardModal,
      // AnnouncementType.VIP_REBATE
      useDailyRebateModalStore.getState().isShowDailyRebateModal,
      // AnnouncementType.FIRST_CHARGE
      useMode2FirstChargeModalStore.getState().isShowFirstChargeDiscountModal,
      // AnnouncementType.INVITE_WHEEL
      useInviteWheelModalStore.getState().isShowInviteWheelModal,
      // AnnouncementType.TEAM_CLUB
      useTeamClubModalStore.getState().isShowTeamClubModal,
      // AnnouncementType.TELEGRAM
      usePostTGActivityModalStore.getState().isShowPostTGActivityModal,
      // AnnouncementType.RANKINGS
      useRankingActivityModalStore.getState().isShowRankingActivityModal,

      // AnnouncementType.DYNAMIC_ACTIVITY
      useDynamicActivityModalStore.getState().isShowDynamicActivityModal,
      // AnnouncementType.WINNINGS_SHARE
      useWinningsShareModelStore.getState().isShowWinningsShareModel,
      // SocketNotice.GLOBAL_NOTICE
      useGlobalAnnouncementStore.getState().isShowGlobalAnnouncementModal,
      // AnnouncementType.TASK_LIST
      useTaskListModalStore.getState().isShowTaskListModal,
      // AnnouncementType.PIGGY_BANK
      useRebateRewardModalStore.getState().isShowRebateRewardModal,
      // AnnouncementType.LOW_BALANCE_RECHARGE,
      useLowBalanceRechargeModalStore.getState().isShowLowBalanceRechargeModal,
      // AnnouncementType.LOW_BALANCE_RESCUE_BOX
      useLowBalanceRescueBoxModalStore.getState()
        .isShowLowBalanceRescueBoxModal,
      // AnnouncementType.DEPOSIT_JACKPOT_WHEEL
      useDepositJackpotWheelModalStore.getState()
        .isShowDepositJackpotWheelModal,
    ];
    const isAllFalse = isShowStates.every((state) => !state);
    if (isAllFalse) {
      hallAdModelInvoker.executeNext('verifyExecuteNextStep');
    }
  };

  useDeepEffect(() => {
    if (
      [UserRoleType.USER, UserRoleType.PLAYER].includes(userRole) &&
      location?.pathname === BasePagePathObj.HallPage
    ) {
      const announcementsItems = hallPopupAnnouncementsItems.filter(
        (item) => userRoleSupportTypeWhitelist[userRole].includes(item.type) // 過濾只支援已經實作的 Modal
      );

      // Evan 不檔空 array 可能有來自 webSocket 的 Command 需要  .verifyNextStep  觸發顯示
      // if (announcementsItems.length === 0) {
      //   return; // 沒有就不處理
      // }
      // 重要的 Command Pattern 組裝及指令
      const hallAdModelCommands = announcementsItems.map((item) => {
        return new HallAdModelCommand({
          uniqueId: `${item.id}`,
          orderId: item.orderId,
          parameter: item.popupParameterJson,
          type: item.type,
          from: SourceFrom.ANNOUNCEMENTS,
          onShowAction: (uniqueId, type) => {
            setHallAdModelCommandTypes({
              uniqueId: uniqueId,
              type: type,
              parameterJson: item.popupParameterJson,
              from: SourceFrom.ANNOUNCEMENTS,
            });
          },
        });
      });

      resetHallAdModelCommandTypes();
      hallAdModelInvoker.addAllCommand(hallAdModelCommands);
      useModalLayoutStore
        .getState()
        .verifyNextStep('useMobileExclusiveModalLayoutOverride');
    } else {
      closeAllAdModal();
      resetHallAdModelCommandTypes();
      hallAdModelInvoker.clearAll();
    }
  }, [hallPopupAnnouncementsItems, userRole, location]);

  useDeepEffect(() => {
    if (verifyNextStepCount >= 0) {
      verifyExecuteNextStep();
    }
  }, [verifyNextStepCount]);
};

export default useMobileExclusiveModalLayoutOverride;
