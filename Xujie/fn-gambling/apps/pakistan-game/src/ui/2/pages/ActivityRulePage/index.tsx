import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import InviteTaskMonthRulesContent from './components/InviteTaskMonthRulesContent';
import InviteTaskRulesContent from './components/InviteTaskRulesContent';
import RedEnvelopeRainRulesContent from './components/RedEnvelopeRainRulesContent';
import RechargeWheelRulesContent from './components/RechargeWheelRulesContent';
import InviteWheelRulesContent from './components/InviteWheelRulesContent';

import {
  ActivityRulesContentTypes,
  useActivityRulesPageStore,
} from '@mode2/zustand/page/activityRulesPageStore';
import { useActivityRulePageBase } from '@mode2/usecase/page/activityRulePage/useActivityRulePageBase';
import { useMemo } from 'react';

const ActivityRulePage = () => {
  useActivityRulePageBase();
  const contentTabIndex = useActivityRulesPageStore(
    (state) => state.contentTabIndex
  );

  const ruleContent = useMemo(() => {
    switch (contentTabIndex) {
      case ActivityRulesContentTypes.RED_ENVELOPE_RAIN_RULES_CONTENT:
        return <RedEnvelopeRainRulesContent />;
      case ActivityRulesContentTypes.MONTH_RULES_CONTENT:
        return <InviteTaskMonthRulesContent />;
      case ActivityRulesContentTypes.RULES_CONTENT:
        return <InviteTaskRulesContent />;
      // case ActivityRulesContentTypes.TEAM_CLUB_RULES_CONTENT:
      //   return <TeamClubRulesContent />;
      case ActivityRulesContentTypes.RECHARGE_WHEEL_RULES_CONTENT:
        return <RechargeWheelRulesContent />;
      case ActivityRulesContentTypes.INVITE_WHEEL_RULES_CONTENT:
        return <InviteWheelRulesContent />;
      default:
        return null;
    }
  }, [contentTabIndex]);

  return (
    <div className={MOBILE_BREAK_POINT_MAX_WIDTH}>
      {/* 内容 */}
      {ruleContent}
    </div>
  );
};
export default ActivityRulePage;
