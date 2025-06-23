import React from 'react';
import ShareForBonusContent from './components/ShareForBonusContent';
import MyRewardsContent from './components/MyRewardsContent';
import { TeamClubPageTabList } from './components/TeamCLubPageTabList';
import { useMode2TeamClubPageStore } from '@mode2/zustand/page/teamClubPageStore';
import { TeamClubPageTabType } from '@mode2/@types/teamClubPageTabType';
import { cx } from '@libs/commonUtils';
import useMode2TeamClubPageBase from '@mode2/usecase/page/useMode2TeamClubPageBase';
import InviteRewardsContent from './components/InviteRewardsContent';
import TeamClubRulesContent from '@components/TeamClubRulesContent';
import AffixHeaderBottomWrapper from '@libs/mode2/components/AffixHeaderBottomWrapper';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';

export const TeamClubPage = () => {
  useMode2TeamClubPageBase();

  const curTab = useMode2TeamClubPageStore((state) => state.curTab);

  return (
    <div
      className={cx(
        'invite',
        'pt-0 pb-0 tablet:py-8',
        'mb-8 mobile:mb-10 tablet:mb-8',
        MOBILE_BREAK_POINT_MAX_WIDTH
      )}
    >
      <AffixHeaderBottomWrapper>
        <TeamClubPageTabList />
      </AffixHeaderBottomWrapper>

      <div
        className={cx({
          'mobile:mt-5 mt-3': curTab !== TeamClubPageTabType.RULES,
        })}
      >
        {curTab === TeamClubPageTabType.SHARE_FOR_BONUS ? (
          <ShareForBonusContent />
        ) : null}
        {curTab === TeamClubPageTabType.MY_REWARDS ? (
          <MyRewardsContent />
        ) : null}
        {curTab === TeamClubPageTabType.INVITE_REWARDS ? (
          <InviteRewardsContent />
        ) : null}
        {/* {curTab === TeamClubPageTabType.RULES ? <TeamClubRulesContent /> : null} */}
        {curTab === TeamClubPageTabType.RULES ? <TeamClubRulesContent /> : null}
      </div>
    </div>
  );
};
export default TeamClubPage;
