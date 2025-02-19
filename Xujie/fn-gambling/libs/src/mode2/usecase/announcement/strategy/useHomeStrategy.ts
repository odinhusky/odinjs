import { useGameItemBase } from '@mode2/usecase/useGameItemBase';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import { useRebateRewardModalStore } from '@mode2/zustand/components/rebateRewardModalStore';
import { ActionPayload } from '@mode2/usecase/announcement/useAnnouncementActionBase';
import { AnnouncementType } from '@mode2/@types/announcementType';
import { InvitePageTabType } from '@mode2/@types/invitePageTabTyp';
import sdkUtils from '@mode2/utils/sdk';
import { ECampaignType } from '@mode2API/endpoint/campaign/PostCampaignLaunchEndpoint';
import { ActivityRulesContentTypes } from '@mode2/zustand/page/activityRulesPageStore';
import { ActivityPageTabType } from '@mode2/@types/activityPageTabType';
import { TeamClubPageTabType } from '@mode2/@types/teamClubPageTabType';
import { isEmpty } from 'lodash';
import { usePostDownloadAwardStartMutation } from '@mode2API/index';

// TODO Evan 測試完成 移除沒定義的action
export const HomeAnnouncementsTypeMappingStrategy: {
  [key: string]: AnnouncementType;
} = {
  '1': AnnouncementType.FIRST_CHARGE, // 導航到 wallet
  '2': AnnouncementType.RECHARGING, // 導航到 wallet
  '3': AnnouncementType.TELEGRAM, // open telegram
  '4': AnnouncementType.SIGN, // 簽到
  '5': AnnouncementType.INVITE_NEW_PLAYER, // 邀請新玩家
  '6': AnnouncementType.PIGGY_BANK, // 顯示獎勵  popup
  '7': AnnouncementType.RED_PACKET, // 啟動活動
  '8': AnnouncementType.DOWNLOAD, // 下載apk
  '9': AnnouncementType.MONTHLY_REBATE, // ??
  '10': AnnouncementType.ENTER_GAME, // 啟動遊戲
  '11': AnnouncementType.ENTER_DIRECTORY, // 啟動遊戲大廳
  '12': AnnouncementType.CHARGE_WHEEL, //	nav 充值轮盘
  '13': AnnouncementType.INVITE, // 導航到 invite
  '14': AnnouncementType.TEAM_CLUB, // 導航到 team_club
  '15': AnnouncementType.VIP, // nav VIP
  '16': AnnouncementType.INVITE_WHEEL, // nav 進邀请轮盘
  '17': AnnouncementType.WHATS_APP, // open whatsapp
  '18': AnnouncementType.RANKINGS, // nav 排行榜
  '19': AnnouncementType.INVITE_REWARD, // nav team_club 邀请奖励
};

export const useHomeStrategy = () => {
  const { onEnterGame } = useGameItemBase();
  const {
    navToLoginPage,
    navToWalletPage,
    navToInvitePage,
    navToActivityPage,
    navToActivityRulePage,
    navToTeamClubPage,
    navToInviteWheelPage,
    navToRechargeWheelPage,
    navToGiftCodeRedeemPage,
  } = useNavPageClick();

  const setIsShowRebateRewardModal = useRebateRewardModalStore(
    (state) => state.setIsShowRebateRewardModal
  );

  const [postDownloadAwardStart] = usePostDownloadAwardStartMutation();

  const onAction = (payload: ActionPayload) => {
    const type = payload.type;
    switch (type) {
      case AnnouncementType.FIRST_CHARGE:
      case AnnouncementType.RECHARGING:
        navToWalletPage();
        break;
      case AnnouncementType.TELEGRAM:
        navToGiftCodeRedeemPage();
        break;
      case AnnouncementType.SIGN:
        // TODO
        break;
      case AnnouncementType.INVITE_NEW_PLAYER:
        navToInvitePage('', {
          state: { tab: InvitePageTabType.EARN },
        });
        break;
      case AnnouncementType.PIGGY_BANK:
        if (sdkUtils.isCurrentLogin()) {
          setIsShowRebateRewardModal(true);
        } else {
          navToLoginPage(26);
        }
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
        if (!sdkUtils.isCurrentLogin()) {
          navToLoginPage(25);
        } else if (payload.gameObj) {
          onEnterGame(payload.gameObj);
        }
        break;
      case AnnouncementType.ENTER_DIRECTORY:
        if (!sdkUtils.isCurrentLogin()) {
          navToLoginPage(24);
        } else if (payload.gameObj) {
          onEnterGame(payload.gameObj);
        }
        break;
      case AnnouncementType.CHARGE_WHEEL:
        if (!sdkUtils.isCurrentLogin()) {
          navToActivityRulePage('', {
            state: {
              tab: ActivityRulesContentTypes.RECHARGE_WHEEL_RULES_CONTENT,
            },
          });
        } else {
          navToRechargeWheelPage();
        }
        break;
      case AnnouncementType.INVITE:
        navToInvitePage('', {
          state: { tab: InvitePageTabType.EARN },
        });
        break;
      case AnnouncementType.TEAM_CLUB:
        if (!sdkUtils.isCurrentLogin()) {
          navToActivityRulePage('', {
            state: {
              tab: ActivityRulesContentTypes.TEAM_CLUB_RULES_CONTENT,
            },
          });
        } else {
          navToTeamClubPage('', {
            state: { tab: TeamClubPageTabType.MY_REWARDS },
          });
        }
        break;
      case AnnouncementType.VIP:
        navToActivityPage('', { state: { tab: ActivityPageTabType.VIP } });
        break;
      case AnnouncementType.INVITE_WHEEL:
        if (!sdkUtils.isCurrentLogin()) {
          navToActivityRulePage('', {
            state: {
              tab: ActivityRulesContentTypes.INVITE_WHEEL_RULES_CONTENT,
            },
          });
        } else {
          navToInviteWheelPage();
        }
        break;
      case AnnouncementType.WHATS_APP:
        if (!isEmpty(payload.linkUrl)) {
          sdkUtils.openBrowser(payload.linkUrl || '');
        }
        break;
      case AnnouncementType.RANKINGS:
        // TODO
        break;
      case AnnouncementType.INVITE_REWARD:
        if (!sdkUtils.isCurrentLogin()) {
          navToActivityRulePage('', {
            state: {
              tab: ActivityRulesContentTypes.MONTH_RULES_CONTENT,
            },
          });
        } else {
          navToTeamClubPage('', {
            state: { tab: TeamClubPageTabType.INVITE_REWARDS },
          });
        }
        break;
      case AnnouncementType.UNKNOWN:
        break;
    }
  };

  return {
    onAction,
  };
};

export default useHomeStrategy;
