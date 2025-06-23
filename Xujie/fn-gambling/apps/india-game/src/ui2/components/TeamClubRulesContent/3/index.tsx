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
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';

const TeamClubRulesContent = () => {
  useTeamClubRulesBase();
  const bgMainPath = getImgUrl(EResourceLevel.V, 'pattern');
  return (
    <div
      className={cx('-mx-4', DEFAULT_BG, 'bg-fixed', 'bg-bottom', '')}
      style={{
        backgroundImage: `url(${bgMainPath})`,
        backgroundAttachment: 'scroll',
        backgroundSize: '100%',
        backgroundRepeat: 'repeat',
      }}
    >
      {/* Header圖 */}
      <div className={cx('w-full', 'relative', 'z-[2]')}>
        <BaseCacheImg
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
          'px-8 pb-2 -mt-[38%] z-10'
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

      <div className="relative mt-3">
        <img
          src={getImgUrl(EResourceLevel.V, 'club_rules_background_bottom')}
          alt="club_rules_background_bottom"
          className={cx('w-full h-20')}
        />
        <div className="absolute top-0 left-0 right-0">
          <TeamClubRulesInviteButton />
        </div>
      </div>
    </div>
  );
};

export default TeamClubRulesContent;
