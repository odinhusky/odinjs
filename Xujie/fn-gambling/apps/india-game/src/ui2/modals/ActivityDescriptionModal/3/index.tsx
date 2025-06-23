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
  return <LoadComponents list={[dynamicImport(data.type)]} />;
};

const ActivityDescriptionModal = () => {
  const isShowActivityDescriptionModal = useActivityCenterStore(
    (state) => state.isShowActivityDescriptionModal
  );
  const currentActivityData = useActivityCenterStore(
    (state) => state.currentActivityData
  );

  return isShowActivityDescriptionModal && currentActivityData ? (
    <BaseModal className="!bgi-[var(--transparent-gray-90)] !justify-start pt-[160px]">
      <ActivityDescriptionContent data={currentActivityData} />
    </BaseModal>
  ) : null;
};
export default ActivityDescriptionModal;
