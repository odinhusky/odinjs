// import {
//   AnnouncementResult,
//   AnnouncementTypeResult,
// } from '@mode2API/endpoint/user/PostHomeEndpoint';
// import { useRebateRewardModalStore } from '@mode2/zustand/components/rebateRewardModalStore';
// import { useGameItemBase } from '@mode2/usecase/useGameItemBase';
// import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
// import { ActivityPageTabType } from '@mode2/@types/activityPageTabType';
// import sdkUtils from '@mode2/utils/sdk';
// import { InvitePageTabType } from '@mode2/@types/invitePageTabTyp';
// import { ECampaignType } from '@mode2API/endpoint/campaign/PostCampaignLaunchEndpoint';
// import { TeamClubPageTabType } from '@mode2/@types/teamClubPageTabType';
// import { ActivityRulesContentTypes } from '@mode2/zustand/page/activityRulesPageStore';
//
// export const useBannerBase = () => {
//   const { onEnterGame } = useGameItemBase();
//   const {
//     navToLoginPage,
//     navToWalletPage,
//     navToInvitePage,
//     navToActivityPage,
//     navToActivityRulePage,
//     navToTeamClubPage,
//   } = useNavPageClick();
//
//   const setIsShowRebateRewardModal = useRebateRewardModalStore(
//     (state) => state.setIsShowRebateRewardModal
//   );
//
//   const onHomeBannerSwiper = (item: AnnouncementResult) => {
//     switch (item.type) {
//       case AnnouncementTypeResult.VIP: //9
//         navToActivityPage('', { state: { tab: ActivityPageTabType.VIP } });
//         break;
//       case AnnouncementTypeResult.WALLET: //2
//         navToWalletPage();
//         break;
//       case AnnouncementTypeResult.INVITE: //13
//         navToInvitePage();
//         break;
//       case AnnouncementTypeResult.BONUS_POPUP: //16
//         if (sdkUtils.isCurrentLogin()) {
//           setIsShowRebateRewardModal(true);
//         } else {
//           navToLoginPage();
//         }
//         break;
//       case AnnouncementTypeResult.ENTER_GAME: //10
//         if (!sdkUtils.isCurrentLogin()) {
//           navToLoginPage();
//         } else if (item.gameObj) {
//           onEnterGame(item.gameObj);
//         }
//         break;
//       case AnnouncementTypeResult.ENTER_LOBBY: //11
//         if (!sdkUtils.isCurrentLogin()) {
//           navToLoginPage();
//         } else if (item.gameObj) {
//           onEnterGame(item.gameObj);
//         }
//         break;
//       case AnnouncementTypeResult.ACTIVITY: //7
//         navToActivityRulePage(
//           `?campaignType=${ECampaignType.RED_ENVELOPE_RAIN}`,
//           {
//             state: {
//               tab: ActivityRulesContentTypes.RED_ENVELOPE_RAIN_RULES_CONTENT,
//             },
//           }
//         );
//         break;
//       case AnnouncementTypeResult.INVITE_NEW_PLAYER: //5
//         navToInvitePage('', {
//           state: { tab: InvitePageTabType.EARN },
//         });
//         break;
//       case AnnouncementTypeResult.TEAM_CLUB: //14
//         if (!sdkUtils.isCurrentLogin()) {
//           navToLoginPage();
//         } else {
//           navToTeamClubPage('', {
//             state: { tab: TeamClubPageTabType.MY_REWARDS },
//           });
//         }
//         break;
//       case AnnouncementTypeResult.UNKNOWN:
//         break;
//     }
//   };
//
//   return {
//     onHomeBannerSwiper,
//   };
// };
