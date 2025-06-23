import { usePostRechargeTutorialRewardClaimMutation } from '@mode2API/index';
import { useCallback, useEffect } from 'react';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { useToastStore } from '@mode2/zustand/components/toastStore';
import { useTranslation } from 'react-i18next';
import { useWalletGuidePageStore } from '@mode2/zustand/page/WalletGuidePage/useWalletGuidePageStore';

export const useTutorialReward = () => {
  const [postRechargeTutorialRewardClaim, { isSuccess, isLoading }] =
    usePostRechargeTutorialRewardClaimMutation();
  const refreshUserData = useUserProfileStore((state) => state.refreshUserData);
  const { t } = useTranslation();
  const showToast = useToastStore((state) => state.showToast);

  const claimReward = useCallback(() => {
    if (!isLoading) {
      postRechargeTutorialRewardClaim();
    }
  }, [isLoading]);

  // TODO Evan 獎勵金額
  // TODO Odin I18N文案
  useEffect(() => {
    if (isSuccess) {
      // showToast(`${2}has been claimed`);
      showToast(t('mission_bonus_received'));
      useWalletGuidePageStore.getState().refreshTutorialStatus();
      refreshUserData();
    }
  }, [isSuccess]);

  return {
    claimReward,
  };
};

export default useTutorialReward;
