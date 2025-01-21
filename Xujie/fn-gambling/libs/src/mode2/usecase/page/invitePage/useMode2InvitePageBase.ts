import useMode2InvitePageEarn from './useMode2InvitePageEarn';
import useMode2InvitePageStatics from './useMode2InvitePageStatics';
import useMode2InvitePageRankingList from './useMode2InvitePageRankingList';
import useMode2InvitePageTabList from './useMode2InvitePageTabList';
import useMode2InvitePageTeamData from './useMode2InvitePageTeamData';
import { useInviteRecommend } from '@mode2/usecase/useInviteRecommend';
import useInvitePageHeaderSetting from './useInvitePageHeaderSetting';
import useMode2InvitePageInit from './useMode2InvitePageInit';
import useInvitePageFooterSetting from './useInvitePageFooterSetting';
import { useMode2PageResetFloatActionButton } from '../useMode2PageResetFloatActionButton';

export const useMode2InvitePageBase = () => {
  useMode2InvitePageInit();

  useInviteRecommend();

  // = Invite Page Tab 相關資料處理
  useMode2InvitePageTabList();

  // = Earn Component 相關資料處理
  useMode2InvitePageEarn();

  // = Statics Component 相關資料處理
  useMode2InvitePageStatics();

  // = TeamData Component 相關資料處理
  useMode2InvitePageTeamData();

  // = Ranking List Component 相關資料處理
  useMode2InvitePageRankingList();

  // ==== InvitePage header setting
  useInvitePageHeaderSetting();

  // ==== InvitePage Footer Setting
  useInvitePageFooterSetting();

  // === Page FloatActionButton reset
  // usePageResetFloatActionButton();
  useMode2PageResetFloatActionButton();
};

export default useMode2InvitePageBase;
