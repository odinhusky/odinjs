import { cx } from '@libs/commonUtils';
import React from 'react';
import TeamClubRulesInviteButton from '../TeamClubRulesInviteButton';
import { DEFAULT_BG, FLEX_COL } from '@libs/constant/style';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import TeamClubRulesEstimateIncome from '../TeamClubRulesEstimateIncome';
import TeamClubRulesCommissionRate from '../TeamClubRulesCommissionRate';
import TeamClubRulesWhatIsAClub from '../TeamClubRulesWhatIsAClub';
import TeamClubRulesHowToIncreaseTheClubsStartRating from '../TeamClubRulesHowToIncreaseTheClubsStartRating';
import TeamClubRulesDescriptionOfAgentLevels from '../TeamClubRulesDescriptionOfAgentLevels';
import TeamClubRulesFAQ from '../TeamClubRulesFAQ';
import useTeamClubRulesBase from '@mode2/usecase/useTeamClubRulesBase';

const TeamClubRulesContent = () => {
  useTeamClubRulesBase();
  const bgMainPath = getImgUrl(EResourceLevel.V, 'pattern');
  return (
    <div
      className={cx('-mx-4', DEFAULT_BG, 'bg-fixed', 'bg-bottom ')}
      style={{
        backgroundImage: `url(${bgMainPath})`,
      }}
    >
      {/* Header圖 */}
      <div className={cx('w-full', 'relative', 'z-[2]')}>
        <img
          src={getImgUrl(EResourceLevel.V, 'club_rules')}
          alt=""
          className={cx('w-full')}
        />
      </div>

      {/* 其他內文 */}
      <div
        className={cx(
          // 'bgi-[var(--main)]',
          'w-full',
          'relative',
          FLEX_COL,
          'gap-4',
          'px-4 pb-2 -mt-[38%] z-10'
        )}
      >
        {/* Estimate income */}
        <TeamClubRulesEstimateIncome />
        <TeamClubRulesInviteButton />

        {/* Description of Agent Levels */}
        <TeamClubRulesDescriptionOfAgentLevels />

        {/* Commission rate */}
        <TeamClubRulesCommissionRate />
        <TeamClubRulesInviteButton />

        {/* What is a club? */}
        <TeamClubRulesWhatIsAClub />
        {/* How to increase the club's star rating? */}
        <TeamClubRulesHowToIncreaseTheClubsStartRating />

        {/* FAQ */}
        <TeamClubRulesFAQ />
      </div>
    </div>
  );
};

export default TeamClubRulesContent;
