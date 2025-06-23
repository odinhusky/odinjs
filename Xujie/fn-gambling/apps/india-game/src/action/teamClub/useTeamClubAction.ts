import {
  handleTeamClubInviteRewardClaimClick,
  handleTeamClubLevelSummaryDetailButtonClick,
  handleTeamClubRulesInviteButtonClick,
  handleTeamClubSharesInviteYourFriendsButtonClick,
  handleTeamClubWithDrawClaimButtonClick,
  handleTeamClubWithDrawDetailButtonClick,
  handleTeamClubWithDrawReceivedOKButtonClick,
} from '@mode2/action/actionTypes';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import handleGlobalClick from '@mode2/action/handleGlobalClick';
import handleAction from '@mode2/action/common/handleAction';
import { useTeamClubWithDrawStore } from '@libs/mode2/zustand/components/myRewardsContent';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';
import {
  usePostTeamCollectRewardMutation,
  usePostTeamInvitationRewardClaimAllMutation,
  usePostTeamInvitationRewardClaimMutation,
} from '@libs/mode2/external/api';
import { useEffect } from 'react';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import sdkUtils from '@mode2/utils/sdk';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import { useToastStore } from '@libs/mode2/zustand/components/toastStore';
import { useInviteRewardsContentStore } from '@libs/mode2/zustand/components/inviteRewardsContentStore';

type ActionClickPayloadMap = {
  [handleTeamClubLevelSummaryDetailButtonClick]: { tab: number };
  [handleTeamClubWithDrawClaimButtonClick]: void;
  [handleTeamClubWithDrawDetailButtonClick]: void;
  [handleTeamClubWithDrawReceivedOKButtonClick]: void;
  [handleTeamClubRulesInviteButtonClick]: void;
  [handleTeamClubSharesInviteYourFriendsButtonClick]: void;
  [handleTeamClubInviteRewardClaimClick]: { settleId: number };
};

export interface HandleRechargeConfirmationProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useTeamClubAction = () => {
  const [triggerClaimTeamCollectionReward, { isSuccess: isClaimSuccess }] =
    usePostTeamCollectRewardMutation();
  const [
    triggerClaimTeamInviteAllRewardClaimAll,
    { isSuccess: isClaimAllSuccess },
  ] = usePostTeamInvitationRewardClaimAllMutation();
  const [
    triggerClaimTeamInviteRewardClaim,
    { isSuccess: isClaimSingleSuccess },
  ] = usePostTeamInvitationRewardClaimMutation();

  const {
    navToSharePage,
    navToRewardsDetailPage,
    navToSubordinateDataPage,
    navToLoginPage,
    // navToTeamClubPage,
  } = useNavPageClick();

  const setIsShowReceivedModal = useTeamClubWithDrawStore(
    (state) => state.setIsShowReceivedModal
  );

  const setNewJoinNotice = useUserProfileStore(
    (state) => state.setNewJoinNotice
  );

  const setRefreshTeamInformationCount = useTeamClubWithDrawStore(
    (state) => state.setRefreshTeamInformationCount
  );

  const setRefreshInviteRewardsCount = useInviteRewardsContentStore(
    (state) => state.setRefreshInviteRewardsCount
  );

  // 每次點擊清除[新成為加入通知]
  const saveCurrentMemberCount = () => {
    setNewJoinNotice(false);
    const currentMemberCount =
      useUserProfileStore.getState().currentTotalTeamMembers;
    if (currentMemberCount > 0) {
      const userId = useUserProfileStore.getState().id;
      const teamMemberTotalCount: Record<number, number> = JSON.parse(
        sdkUtils.getStorage(AppLocalStorageKey.TEAM_MEMBER_TOTAL_COUNT) || '{}'
      );
      const saveData = {
        ...teamMemberTotalCount,
        [userId]: currentMemberCount,
      };
      sdkUtils.setStorage(
        AppLocalStorageKey.TEAM_MEMBER_TOTAL_COUNT,
        JSON.stringify(saveData)
      );
    }
  };

  useEffect(() => {
    if (isClaimSuccess) setIsShowReceivedModal(true);
  }, [isClaimSuccess]);

  useEffect(() => {
    if (isClaimAllSuccess) {
      // TODO i18n
      setRefreshInviteRewardsCount();
      useToastStore.getState().showToast('The reward has been claimed!');
    }
  }, [isClaimAllSuccess]);

  useEffect(() => {
    if (isClaimSingleSuccess) {
      // TODO i18n
      setRefreshInviteRewardsCount();
      useToastStore.getState().showToast('The reward has been claimed!');
    }
  }, [isClaimSingleSuccess]);

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleTeamClubLevelSummaryDetailButtonClick]: ({ tab }) => {
      handleGlobalClick({
        target: handleTeamClubLevelSummaryDetailButtonClick,
        payload: { tab },
        callback: () => {
          saveCurrentMemberCount();
          navToSubordinateDataPage('', { state: { tab } });
        },
      });
    },
    [handleTeamClubWithDrawClaimButtonClick]: () => {
      handleGlobalClick({
        target: handleTeamClubWithDrawClaimButtonClick,
        callback: () => {
          triggerClaimTeamCollectionReward();
        },
      });
    },
    [handleTeamClubWithDrawDetailButtonClick]: () => {
      handleGlobalClick({
        target: handleTeamClubWithDrawDetailButtonClick,
        callback: () => {
          navToRewardsDetailPage();
        },
      });
    },
    [handleTeamClubWithDrawReceivedOKButtonClick]: () => {
      handleGlobalClick({
        target: handleTeamClubWithDrawReceivedOKButtonClick,
        callback: () => {
          setRefreshTeamInformationCount();
          setIsShowReceivedModal(false);
        },
      });
    },
    [handleTeamClubRulesInviteButtonClick]: () => {
      handleGlobalClick({
        target: handleTeamClubRulesInviteButtonClick,
        callback: () => {
          if (sdkUtils.isCurrentLogin()) {
            // navToTeamClubPage('', {
            //   state: { tab: TeamClubPageTabType.SHARE_FOR_BONUS },
            // });
            navToSharePage();
          } else {
            navToLoginPage(67);
          }
        },
      });
    },
    [handleTeamClubSharesInviteYourFriendsButtonClick]: () => {
      handleGlobalClick({
        target: handleTeamClubSharesInviteYourFriendsButtonClick,
        callback: () => {
          navToSharePage();
        },
      });
    },
    [handleTeamClubInviteRewardClaimClick]: ({ settleId }) => {
      handleGlobalClick({
        target: handleTeamClubInviteRewardClaimClick,
        payload: { settleId },
        callback: () => {
          console.log('@@==> isAll', settleId);
          if (settleId === 0) {
            triggerClaimTeamInviteAllRewardClaimAll();
          } else {
            triggerClaimTeamInviteRewardClaim({ settleId });
          }
        },
      });
    },
  };

  const handleTeamClubClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleRechargeConfirmationProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleTeamClubClick,
  };
};
