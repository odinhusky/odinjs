import React, { useMemo, useState } from 'react';
import BaseModal from '../Modal';
import { useRef } from 'react';
import { useGameAppMessage } from '@libs/commonUtils/hooks/useActivityMessage';
import useActivityCenterStore from '@mode2/zustand/components/activityCenterStore';
import { CampaignLaunchItem } from '@libs/mode2/external/api/endpoint/campaign/PostCampaignLaunchEndpoint';
import { EMessageType } from '@libs/commonUtils/hooks/useActivityMessage/types';
import useActivityCenterAction from '@libs/mode2/action/activityCenterAction/useActivityCenterAction';
import { handleActivityCenterClose } from '@mode2/action/actionTypes';
import sdkUtils from '@libs/mode2/utils/sdk';
import { AppLocalStorageKey } from '@libs/mode2/utils/sdk/persistant/storageKey';

const ActivityCenterIframe = ({ data }: { data: CampaignLaunchItem }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [targetOrigin] = useState(() => {
    try {
      return new URL(data.participateUrl || '').origin;
    } catch {
      return '';
    }
  });
  const { handleActivityCenterClick } = useActivityCenterAction();
  useGameAppMessage({
    targetOrigin,
    iframeRef,
    onReceive: (e) => {
      console.log('收到活动中心的消息:', e);
      // if (data.type === EMessageType.SUCCESS) {

      // }
      if (e.type === EMessageType.CLOSE) {
        handleActivityCenterClick({
          actionName: handleActivityCenterClose,
          payload: data.id,
        });
      }
    },
  });
  const src = useMemo(() => {
    const url = data.participateUrl;
    return (
      url +
      `${url?.includes('?') ? '&' : '?'}origin=${window.location.origin}&lang=${
        sdkUtils.getStorage(AppLocalStorageKey.LANG) || 'en'
      }`
    );
  }, [data]);
  return (
    <iframe
      ref={iframeRef}
      title="activity-center"
      src={src}
      style={{ backgroundColor: 'transparent' }}
      width="100%"
      height="100%"
    ></iframe>
  );
};
const ActivityCenterModal = () => {
  const currentActivityData = useActivityCenterStore(
    (state) => state.currentActivityData
  );
  const isShowActivityCenterModal = useActivityCenterStore(
    (state) => state.isShowActivityCenterModal
  );

  return isShowActivityCenterModal && currentActivityData ? (
    <BaseModal>
      <ActivityCenterIframe data={currentActivityData} />
    </BaseModal>
  ) : null;
};

export default ActivityCenterModal;
