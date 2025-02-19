import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import InviteTaskMonthRulesContent from './components/InviteTaskMonthRulesContent';
import InviteTaskRulesContent from './components/InviteTaskRulesContent';
import TeamClubRulesContent from '@pages/TeamClubPage/components/TeamClubRulesContent';
import RechargeWheelRulesContent from './components/RechargeWheelRulesContent';

import {
  ActivityRulesContentTypes,
  useActivityRulesPageStore,
} from '@mode2/zustand/page/activityRulesPageStore';
import { useActivityRulePageBase } from '@mode2/usecase/page/activityRulePage/useActivityRulePageBase';
import { useEffect, useMemo } from 'react';
import InviteWheelRuleModal from '@modals/InviteWheelRuleModal';
import { useInviteWheelRuleModalStore } from '@mode2/zustand/page/inviteWheelPageStore';
import { useNavigateClick } from '@mode2/usecase/useNavPageClick';
import { useUpdateEffect } from '@libs/commonUtils';
import cx from '@commonUtils/cx';

const ActivityRulePage = () => {
  useActivityRulePageBase();
  const contentTabIndex = useActivityRulesPageStore(
    (state) => state.contentTabIndex
  );
  const isDisplay = useInviteWheelRuleModalStore((state) => state.isDisplay);

  useEffect(() => {
    if (
      contentTabIndex === ActivityRulesContentTypes.INVITE_WHEEL_RULES_CONTENT
    ) {
      useInviteWheelRuleModalStore.getState().showInviteWheelRuleModal();
    }
  }, [contentTabIndex]);

  useUpdateEffect(() => {
    if (
      !isDisplay &&
      contentTabIndex === ActivityRulesContentTypes.INVITE_WHEEL_RULES_CONTENT
    ) {
      navigate(-1);
    }
  }, [isDisplay, contentTabIndex]);

  const navigate = useNavigateClick();
  const ruleContent = useMemo(() => {
    console.log('@@@===>contentTabIndex', contentTabIndex);
    switch (contentTabIndex) {
      // case ActivityRulesContentTypes.RED_ENVELOPE_RAIN_RULES_CONTENT:
      //   return <RedEnvelopeRainRulesContent />;
      case ActivityRulesContentTypes.MONTH_RULES_CONTENT: // 團隊俱樂部
        return <InviteTaskMonthRulesContent />; // done
      case ActivityRulesContentTypes.RULES_CONTENT: // 團隊俱樂部
        return <InviteTaskRulesContent />; // done
      case ActivityRulesContentTypes.TEAM_CLUB_RULES_CONTENT: // 團隊俱樂部
        return <TeamClubRulesContent />;

      case ActivityRulesContentTypes.RECHARGE_WHEEL_RULES_CONTENT: // 充值輪盤
        return <RechargeWheelRulesContent />; // done
      case ActivityRulesContentTypes.INVITE_WHEEL_RULES_CONTENT: // 邀請輪盤
        return <InviteWheelRuleModal />; // done
      default:
        return null;
    }
  }, [contentTabIndex]);

  return (
    <div
      className={
        cx()
        // 'w-screen', MOBILE_BREAK_POINT_MAX_WIDTH, ' -mx-4 m-auto'
      }
    >
      {/* 内容 */}
      {/*{ruleContent}*/}
      <TeamClubRulesContent />
      {/*<TeamClubRulesContent />*/}
      {/**/}
    </div>
  );
};
export default ActivityRulePage;
