import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import handleAction from '../common/handleAction';
import {
  handleSharePageClipboardClick,
  handleSharePagePostTgClick,
  handleSharePagePostWhatsAppClick,
  handleSharePageSaveImageClick,
} from '@mode2/action/actionTypes';
import handleGlobalClick from '../handleGlobalClick';
import { RefObject, useEffect, useMemo } from 'react';
import { useClipboard, useDownloadSnapshotElement } from '@libs/commonUtils';
import { useTeamClubRulesStore } from '@libs/mode2/zustand/page/teamClubRulesPageStore';
import {
  SharePosterType,
  useMode2SharePageStore,
} from '@libs/mode2/zustand/page/sharePageStore';
import { formatMoney } from '@mode2/utils';
import { usePlatformDynamicConfigStore } from '@mode2/zustand/platform/platformDynamicConfig';
import { useToastStore } from '@mode2/zustand/components/toastStore';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { INV6 } from '@libs/constant/versions';
import sdkUtils from '@libs/mode2/utils/sdk';

type ActionClickPayloadMap = {
  [handleSharePageSaveImageClick]: { asImageRef: RefObject<HTMLDivElement> };
  [handleSharePageClipboardClick]: { shareText: string };
  [handleSharePagePostTgClick]: { postLinkText?: string };
  [handleSharePagePostWhatsAppClick]: { postLinkText?: string };
};

export interface HandleSharePageClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useSharePageAction = () => {
  const { downloadElementAsImage } =
    useDownloadSnapshotElement<HTMLDivElement>();

  const { clipboard, copyToClipboard } = useClipboard();

  const inviteDailyRule = useTeamClubRulesStore(
    (state) => state.inviteDailyRule
  );
  const referralLink = useUserProfileStore((state) => state.referralLink);
  const referralCode = useUserProfileStore((state) => state.referralCode);
  const currentShareType: SharePosterType = useMode2SharePageStore(
    (state) => state.currentShareType
  );

  const maxWheelReward = usePlatformDynamicConfigStore(
    (state) => state.maxWheelReward
  );

  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {}, [clipboard]);

  const copywriter = useMemo(() => {
    const teamClubCommission = formatMoney({
      value: inviteDailyRule.commission,
    });
    const teamClubRebate = formatMoney({
      value: inviteDailyRule.validInviteRebates,
    });

    const inviteMaxWheelReward = formatMoney({ value: maxWheelReward });
    return {
      [SharePosterType.SHARETEAMCLUB]: `Your friend has sent you ${teamClubCommission}. Claim an additional ${teamClubRebate} with your first deposit.Claim now by clicking this link ${referralLink} and enter the referral code: ${referralCode}`,

      [SharePosterType.SHAREINVITE]: `Do you want to unlock your ${inviteMaxWheelReward} reward right away? Click the link ${referralLink} and enter the referral code: ${referralCode}`,
    };
  }, [inviteDailyRule, maxWheelReward, referralLink, referralCode]);

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleSharePageSaveImageClick]: ({ asImageRef }) => {
      handleGlobalClick({
        target: handleSharePageSaveImageClick,
        callback: () => {
          downloadElementAsImage(
            asImageRef,
            import.meta.env['VITE_PACKAGENAME'],
            {
              scale: sdkUtils.isIOSKernel() ? window.devicePixelRatio : 2,
            },
            'jpeg'
            // { scale: sdkUtils.isIOSKernel() ? 1.6 : 0.75 } // 1.6 ios在570kb左右 0.75在pc模擬手機是220kb左右
          );
          showToast('Picture saved to album');
        },
      });
    },
    [handleSharePageClipboardClick]: ({ shareText }) => {
      handleGlobalClick({
        target: handleSharePageClipboardClick,
        payload: { shareText },
        callback: () => {
          const version = import.meta.env['VITE_V_VERSION'];
          // const teamClubCommission = formatMoney({
          //   value: inviteDailyRule.commission,
          // });
          // const teamClubRebate = formatMoney({
          //   value: inviteDailyRule.validInviteRebates,
          // });
          //
          // const inviteMaxWheelReward = formatMoney({ value: maxWheelReward });

          // const copywriter = {
          //   [SharePosterType.SHARETEAMCLUB]: `Your friend has sent you ${teamClubCommission}. Claim an additional ${teamClubRebate} with your first deposit.Claim now by clicking this link ${referralLink} and enter the referral code: ${referralCode}`,
          //
          //   [SharePosterType.SHAREINVITE]: `Do you want to unlock your ${inviteMaxWheelReward} reward right away? Click the link ${referralLink} and enter the referral code: ${referralCode}`,
          // };
          const link = shareText ? shareText : copywriter[currentShareType];

          copyToClipboard(link, {
            resetInterval: 100,
            successMessage:
              version === INV6 ? 'spin_and_share_wheel_copied_toast' : '',
          });
        },
        debounceTimer: 300,
      });
    },
    [handleSharePagePostTgClick]: ({ postLinkText }) => {
      handleGlobalClick({
        target: handleSharePagePostTgClick,
        payload: { postLinkText },
        callback: () => {
          const postLink =
            postLinkText || copywriter[currentShareType] || referralLink;
          sdkUtils.openBrowser(`https://t.me/share/url?url=${postLink}`);
        },
      });
    },
    [handleSharePagePostWhatsAppClick]: ({ postLinkText }) => {
      handleGlobalClick({
        target: handleSharePagePostWhatsAppClick,
        payload: { postLinkText },
        callback: () => {
          const postLink =
            postLinkText || copywriter[currentShareType] || referralLink;
          sdkUtils.openBrowser(
            `https://api.whatsapp.com/send/?text=${postLink}&type=custom_url&app_absent=0`
          );
        },
      });
    },
  };

  const handleSharePageClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleSharePageClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleSharePageClick,
  };
};

export default useSharePageAction;
