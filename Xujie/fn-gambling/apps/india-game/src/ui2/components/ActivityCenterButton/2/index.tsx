import useActivityCenterStore from '@libs/mode2/zustand/components/activityCenterStore';
import LoadComponents from '@libs/components/LoadComponents';
import { useMemo } from 'react';
import { ActivityCenterButtonProps } from '../ActivityCenterButtonProps';
import { ECampaignType } from '@mode2API/endpoint/campaign/PostCampaignLaunchEndpoint';

const dynamicImport = (type?: ECampaignType) => {
  switch (type) {
    case ECampaignType.RED_ENVELOPE_RAIN:
      return () => import('./RedEnvelopeRainButton');

    default:
      throw new Error(`Unknown component: ${type}`);
  }
};

export const ActivityCenterButton = (props: ActivityCenterButtonProps) => {
  const activeOnHomeList = useActivityCenterStore(
    (state) => state.activeOnHomeList
  );
  const list = useMemo(
    () => activeOnHomeList.map((v) => dynamicImport(v.type)),
    [activeOnHomeList]
  );

  return (
    <div className={list.length > 0 ? props.className : ''}>
      <LoadComponents list={list} />
    </div>
  );
};

export default ActivityCenterButton;
