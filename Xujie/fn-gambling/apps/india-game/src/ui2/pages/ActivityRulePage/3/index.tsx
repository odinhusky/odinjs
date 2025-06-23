import InviteTaskMonthRulesContent from './components/InviteTaskMonthRulesContent';
import InviteTaskRulesContent from './components/InviteTaskRulesContent';
import TeamClubRulesContent from '@components/TeamClubRulesContent';
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
import useMobileActivityRulePageOverride from './useMobileActivityRulePageOverride';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { useStayTracker } from '@libs/commonUtils/stayTracker/useStayTracker';
import RedEnvelopeRainRulesContent from './components/RedEnvelopeRainRulesContent';

export const ActivityRulePage = () => {
  useActivityRulePageBase();
  useMobileActivityRulePageOverride();
  const contentTabIndex = useActivityRulesPageStore(
    (state) => state.contentTabIndex
  );
  const isDisplay = useInviteWheelRuleModalStore((state) => state.isDisplay);

  useStayTracker({
    page: BasePagePathObj.TeamClubPage,
    tab: contentTabIndex?.toString() || '',
  });

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

  // // mock
  // const tabs = [
  //   // ActivityRulesContentTypes.RED_ENVELOPE_RAIN_RULES_CONTENT,
  //   ActivityRulesContentTypes.MONTH_RULES_CONTENT,
  //   ActivityRulesContentTypes.RULES_CONTENT,
  //   ActivityRulesContentTypes.TEAM_CLUB_RULES_CONTENT,
  //   ActivityRulesContentTypes.RECHARGE_WHEEL_RULES_CONTENT,
  //   ActivityRulesContentTypes.INVITE_WHEEL_RULES_CONTENT,
  // ];
  // const { setContentTabIndex } = useActivityRulesPageStore.getState();
  // const [tabIndex, setTabIndex] = useState(0);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTabIndex((prevIndex) => {
  //       const newIndex = (prevIndex + 1) % tabs.length;
  //       setContentTabIndex(tabs[newIndex]); // 更新 Store
  //       return newIndex;
  //     });
  //   }, 3000);
  //   return () => clearInterval(interval);
  // }, [tabIndex, setContentTabIndex]);

  const ruleContent = useMemo(() => {
    switch (contentTabIndex) {
      case ActivityRulesContentTypes.RED_ENVELOPE_RAIN_RULES_CONTENT:
        return <RedEnvelopeRainRulesContent />;
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
  // bgi-[var(--background-dark)]

  return (
    <div className={cx('')}>
      {/* 内容 */}
      {ruleContent}
      {/**/}
    </div>
  );
};
export default ActivityRulePage;
