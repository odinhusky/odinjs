import { useMobileActivityDetailPageOverride } from './useMobileActivityDetailPageOverride';
import { useActivityDetailPageStore } from '@mode2/zustand/page/ActivityDetailPage/useActivityDetailPageStore';
import cx from '@commonUtils/cx';
import { useMemo } from 'react';
import { AnnouncementType } from '@mode2/@types/announcementType';
import DynamicActivityContent from './components/DynamicActivityContent';

export const ActivityDetailPage = () => {
  useMobileActivityDetailPageOverride();

  const currentAnnouncementType = useActivityDetailPageStore(
    (state) => state.currentAnnouncementType
  );

  const ruleContent = useMemo(() => {
    switch (currentAnnouncementType) {
      case AnnouncementType.DYNAMIC_ACTIVITY:
        return <DynamicActivityContent />;
      default:
        return null;
    }
  }, [currentAnnouncementType]);

  return (
    <div className={cx('')}>
      {/*<CricketCrazyContent />*/}
      {/*<JILISpinChallengeContent />*/}
      {ruleContent}
    </div>
  );
};

export default ActivityDetailPage;
