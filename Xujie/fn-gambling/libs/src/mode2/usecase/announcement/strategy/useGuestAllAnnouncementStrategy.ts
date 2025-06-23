import { useGameItemBase } from '@mode2/usecase/useGameItemBase';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import { useRebateRewardModalStore } from '@mode2/zustand/components/rebateRewardModalStore';
import { ActionPayload } from '@mode2/usecase/announcement/useAnnouncementActionBase';
import { AnnouncementType } from '@mode2/@types/announcementType';
import sdkUtils from '@mode2/utils/sdk';
import isEmpty from 'lodash/isEmpty';
import { usePostDownloadAwardStartMutation } from '@mode2API/index';
import { ECampaignType } from '@mode2API/endpoint/campaign/PostCampaignLaunchEndpoint';
import { ActivityRulesContentTypes } from '@mode2/zustand/page/activityRulesPageStore';

export const useGuestAllAnnouncementStrategy = () => {
  const { navToLoginPage, navToGiftCodeRedeemPage, navToActivityRulePage } =
    useNavPageClick();

  const setIsShowRebateRewardModal = useRebateRewardModalStore(
    (state) => state.setIsShowRebateRewardModal
  );

  const [postDownloadAwardStart] = usePostDownloadAwardStartMutation();

  const onAction = (payload: ActionPayload) => {
    const type = payload.type;
    switch (type) {
      case AnnouncementType.FIRST_CHARGE:
      case AnnouncementType.RECHARGING:
        navToLoginPage(26);
        break;
      case AnnouncementType.TELEGRAM:
        navToGiftCodeRedeemPage();
        break;
      case AnnouncementType.SIGN:
        // TODO
        break;
      case AnnouncementType.INVITE_NEW_PLAYER:
        navToLoginPage(93);
        break;
      case AnnouncementType.PIGGY_BANK:
        navToLoginPage(26);
        break;
      case AnnouncementType.RED_PACKET:
        navToActivityRulePage(
          `?campaignType=${ECampaignType.RED_ENVELOPE_RAIN}`,
          {
            state: {
              tab: ActivityRulesContentTypes.RED_ENVELOPE_RAIN_RULES_CONTENT,
            },
          }
        );
        break;
      case AnnouncementType.DOWNLOAD:
        if (!sdkUtils.isInNative()) {
          if (sdkUtils.isCurrentLogin()) {
            postDownloadAwardStart();
          }
          const dlUrl = import.meta.env['VITE_DOWNLOAD_APK_URL'];
          if (dlUrl.length > 0) {
            sdkUtils.openBrowser(dlUrl);
          }
        }
        break;
      case AnnouncementType.MONTHLY_REBATE:
        // TODO
        break;
      case AnnouncementType.ENTER_GAME:
        navToLoginPage(25);
        break;
      case AnnouncementType.ENTER_DIRECTORY:
        navToLoginPage(24);
        break;
      case AnnouncementType.CHARGE_WHEEL:
        navToLoginPage(83);
        break;
      case AnnouncementType.INVITE:
        navToLoginPage(94);
        break;
      case AnnouncementType.TEAM_CLUB:
        navToLoginPage(87);
        break;
      case AnnouncementType.VIP:
        navToLoginPage(91);
        break;
      case AnnouncementType.INVITE_WHEEL:
        navToLoginPage(88);
        break;
      case AnnouncementType.WHATS_APP:
        if (!isEmpty(payload.linkUrl)) {
          sdkUtils.openBrowser(payload.linkUrl || '');
        }
        break;
      case AnnouncementType.RANKINGS:
        navToLoginPage(89);
        break;
      case AnnouncementType.INVITE_REWARD:
        navToLoginPage(90);
        break;
      case AnnouncementType.WATCH_VIDEO:
        navToLoginPage(91);
        break;
      case AnnouncementType.WEEK_LUCKY_BONUS:
        navToLoginPage(91);
        break;
      case AnnouncementType.SURPRISE_REWARD:
        navToLoginPage(91);
        break;
      case AnnouncementType.VIP_REBATE:
        navToLoginPage(91);
        break;
      case AnnouncementType.GIFT_CODE:
        navToLoginPage(91);
        break;
      case AnnouncementType.DYNAMIC_ACTIVITY:
        navToLoginPage(91);
        break;
      case AnnouncementType.NOTHING:
        break;
      case AnnouncementType.UNKNOWN:
        break;
    }
  };

  return {
    onAction,
  };
};

export default useGuestAllAnnouncementStrategy;
