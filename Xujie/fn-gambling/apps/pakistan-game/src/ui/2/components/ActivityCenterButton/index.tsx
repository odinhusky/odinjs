import useActivityCenterStore from '@libs/mode2/zustand/components/activityCenterStore';
import LoadComponents from '@libs/components/LoadComponents';
import { ECampaignType } from '@libs/mode2/external/api/endpoint/campaign/PostCampaignLaunchEndpoint';
import { useMemo } from 'react';
const dynamicImport = (type?: ECampaignType) => {
  switch (type) {
    case ECampaignType.RED_ENVELOPE_RAIN:
      return () => import('./RedEnvelopeRainButton');

    default:
      throw new Error(`Unknown component: ${type}`);
  }
};
const ActivityCenterButton = ({ className }: { className?: string }) => {
  const activeOnHomeList = useActivityCenterStore(
    (state) => state.activeOnHomeList
  );
  const list = useMemo(
    () => activeOnHomeList.map((v) => dynamicImport(v.type)),
    [activeOnHomeList]
  );

  return (
    <div className={list.length > 0 ? className : ''}>
      <LoadComponents list={list} />
    </div>
  );
};

export default ActivityCenterButton;
