import { cx } from '@libs/commonUtils';
import React from 'react';
import TeamClubRulesInviteButton from './components/TeamClubRulesInviteButton';
import { DEFAULT_BG, FLEX_COL } from '@libs/constant/style';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import TeamClubRulesEstimateIncome from './components/TeamClubRulesEstimateIncome';
import TeamClubRulesCommissionRate from './components/TeamClubRulesCommissionRate';
import TeamClubRulesWhatIsAClub from './components/TeamClubRulesWhatIsAClub';
import TeamClubRulesHowToIncreaseTheClubsStartRating from './components/TeamClubRulesHowToIncreaseTheClubsStartRating';
import TeamClubRulesDescriptionOfAgentLevels from './components/TeamClubRulesDescriptionOfAgentLevels';
import TeamClubRulesFAQ from './components/TeamClubRulesFAQ';
import useTeamClubRulesBase from '@mode2/usecase/useTeamClubRulesBase';

const TeamClubRulesContent = () => {
  useTeamClubRulesBase();
  const bgMainPath = getImgUrl(EResourceLevel.V, 'rules_background_m');
  return (
    <div
      className={cx('-mx-4 mobile:-mx-0', DEFAULT_BG, 'bg-fixed', 'bg-bottom')}
      style={{
        backgroundImage: `url(${bgMainPath})`,
      }}
    >
      {/* Header圖 */}
      <div className={cx('w-full', 'relative', 'z-[2]')}>
        <img
          src={getImgUrl(EResourceLevel.V, 'rules_banner_m')}
          alt=""
          className={cx('w-full')}
        />
      </div>

      {/* 其他內文 */}
      <div
        className={cx(
          'bgi-[var(--main)]',
          'w-full',
          'relative',
          FLEX_COL,
          'gap-4',
          'px-4 pb-2'
        )}
      >
        {/* Estimate income */}
        <TeamClubRulesEstimateIncome />
        {/* Commission rate */}
        <TeamClubRulesCommissionRate />
        {/* What is a club? */}
        <TeamClubRulesWhatIsAClub />
        {/* How to increase the club's star rating? */}
        <TeamClubRulesHowToIncreaseTheClubsStartRating />
        {/* Description of Agent Levels */}
        <TeamClubRulesDescriptionOfAgentLevels />
        {/* FAQ */}
        <TeamClubRulesFAQ />
      </div>

      <TeamClubRulesInviteButton />
    </div>
  );
};

export default TeamClubRulesContent;
