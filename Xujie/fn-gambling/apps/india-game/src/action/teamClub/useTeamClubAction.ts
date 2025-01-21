import {
  handleTeamClubLevelSummaryDetailButtonClick,
  handleTeamClubRulesInviteButtonClick,
  handleTeamClubSharesInviteYourFriendsButtonClick,
  handleTeamClubWithDrawClaimButtonClick,
  handleTeamClubWithDrawDetailButtonClick,
  handleTeamClubWithDrawReceivedOKButtonClick,
} from '@/action/teamClub/acitonType';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import handleGlobalClick from '@mode2/action/handleGlobalClick';
import handleAction from '@mode2/action/common/handleAction';
import { TeamClubPageTabType } from '@libs/mode2/@types/teamClubPageTabType';
import { useTeamClubWithDrawStore } from '@libs/mode2/zustand/components/myRewardsContent';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';
import { usePostTeamCollectRewardMutation } from '@libs/mode2/external/api';
import { useEffect } from 'react';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import sdkUtils from '@mode2/utils/sdk';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';

type ActionClickPayloadMap = {
  [handleTeamClubLevelSummaryDetailButtonClick]: { tab: number };
  [handleTeamClubWithDrawClaimButtonClick]: void;
  [handleTeamClubWithDrawDetailButtonClick]: void;
  [handleTeamClubWithDrawReceivedOKButtonClick]: void;
  [handleTeamClubRulesInviteButtonClick]: void;
  [handleTeamClubSharesInviteYourFriendsButtonClick]: void;
};

export interface HandleRechargeConfirmationProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useTeamClubAction = () => {
  const [triggerClaimTeamCollectionReward, { isSuccess: isClaimSuccess }] =
    usePostTeamCollectRewardMutation();
  const {
    navToSharePage,
    navToRewardsDetailPage,
    navToSubordinateDataPage,
    navToLoginPage,
    navToTeamClubPage,
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

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleTeamClubLevelSummaryDetailButtonClick]: ({ tab }) => {
      handleGlobalClick({
        target: handleTeamClubLevelSummaryDetailButtonClick,
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
            navToTeamClubPage('', {
              state: { tab: TeamClubPageTabType.SHARE_FOR_BONUS },
            });
          } else {
            navToLoginPage();
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
