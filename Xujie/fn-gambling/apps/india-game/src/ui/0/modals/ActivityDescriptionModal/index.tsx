import BaseModal from '@libs/components/Modal';
import { ECampaignType } from '@libs/mode2/external/api/endpoint/campaign/PostCampaignLaunchEndpoint';
import useActivityCenterStore, {
  ICurrentActivityData,
} from '@libs/mode2/zustand/components/activityCenterStore';
import LoadComponents from '@libs/components/LoadComponents';

const dynamicImport = (type?: ECampaignType) => {
  switch (type) {
    case ECampaignType.RED_ENVELOPE_RAIN:
      return () => import('./RedEnvelopeRainDescription');

    default:
      throw new Error(`Unknown id: ${type}`);
  }
};
const ActivityDescriptionContent = ({
  data,
}: {
  data: Exclude<ICurrentActivityData, null>;
}) => {
  return null;
};

const ActivityDescriptionModal = () => {
  return null;
};
export default ActivityDescriptionModal;
