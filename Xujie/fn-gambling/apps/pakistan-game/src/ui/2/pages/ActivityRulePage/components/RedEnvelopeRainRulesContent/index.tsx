import useActivityCenterBase from '@mode2/usecase/useActivityCenterBase';
import { useLocation } from 'react-router';
import { useMemo } from 'react';
import { ECampaignType } from '@mode2API/endpoint/campaign/PostCampaignLaunchEndpoint';
import LoadComponents from '@libs/components/LoadComponents';
import NoData from '@components/NoData';

const dynamicImport = (type: ECampaignType) => {
  switch (type) {
    case ECampaignType.RED_ENVELOPE_RAIN:
      return () => import('./RedEnvelopeRainRule');

    default:
      throw new Error(`Unknown component: ${type}`);
  }
};

const RedEnvelopeRainRulesContent = () => {
  useActivityCenterBase();
  const location = useLocation();
  const type = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('campaignType') as ECampaignType;
  }, []);
  const list = useMemo(() => [dynamicImport(type)], [type]);
  return type ? <LoadComponents list={list} /> : <NoData />;
};

export default RedEnvelopeRainRulesContent;
