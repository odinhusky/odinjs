import { useTeamInviteRecommend } from '@mode2/usecase/useTeamInviteRecommend';
import useMode2TeamClubPageTabList from './useMode2TeamClubPageTabList';
import useMode2TeamClubPageShareForBonus from './useMode2TeamClubPageShareForBonus';
import { useMode2PageResetFloatActionButton } from './useMode2PageResetFloatActionButton';
import { useTeamClubPageHeaderSetting } from '@mode2/usecase/page/useTeamClubPageHeaderSetting';
import { useTeamClubPageInit } from '@mode2/usecase/page/useTeamClubPageInit';
import { useTeamClubPageFooterSetting } from '@mode2/usecase/page/useTeamClubPageFooterSetting';

export const useMode2TeamClubPageBase = () => {
  // 初始
  useTeamClubPageInit();

  // ==== TeamClubPage header setting
  useTeamClubPageHeaderSetting();

  // = Page Tab 相關資料處理
  useMode2TeamClubPageTabList();

  // 邀請連結,人數,QRcode,邀請碼相關資料
  useTeamInviteRecommend();

  // = Share for Bonus Component 相關資料處理
  useMode2TeamClubPageShareForBonus();

  // === Page FloatActionButton reset
  useMode2PageResetFloatActionButton();

  useTeamClubPageFooterSetting();
};

export default useMode2TeamClubPageBase;
