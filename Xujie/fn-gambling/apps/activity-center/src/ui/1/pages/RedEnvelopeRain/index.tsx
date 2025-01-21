import './index.scss';
import {
  useGetCampaignDetailMutation,
  usePostParticipateEndpointMutation,
} from '@/external/api';
import Icon from '@libs/mode2/components/Icon';
import PageRainCanvas from '@/utils/pageRainCanvas';

import { useActivityCenterMessage } from '@commonUtils/hooks/useActivityMessage';
import { EMessageType } from '@libs/commonUtils/hooks/useActivityMessage/types';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useEffect, useMemo, useState } from 'react';
import { cx } from '@libs/commonUtils';
import useAnimation from '@commonUtils/hooks/useAnimation';
import ActivityTipsModel, {
  IActivityTipsModelProps,
} from '@components/ActivityTipsModel';
import sdkUtils from '@libs/mode2/utils/sdk';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import dayjs from 'dayjs';
import { useLocation } from 'react-router';

const TimeRangeText = ({
  distributeTimeRanges = [],
}: {
  distributeTimeRanges?: { start: string; end: string }[];
}) => {
  const { t } = useTranslation();
  const timeRang = useMemo(() => {
    let rang: typeof distributeTimeRanges = [];
    const now = dayjs();
    if (distributeTimeRanges.length > 20) {
      for (const value of distributeTimeRanges) {
        const startTime = dayjs(`${now.format('YYYY-MM-DD')} ${value.start}`);
        if (rang.length === 3) {
          break;
        }
        if (now < startTime) {
          rang.push(value);
        }
      }
    } else {
      rang = distributeTimeRanges;
    }
    return rang.map((v) => v.start).join(', ');
  }, [distributeTimeRanges]);

  return (
    <div className="font-bold text-sm mt-4">
      {t('red_packets_rain_popup_received_content_3', {
        timeRang,
      })}
    </div>
  );
};
const RedEnvelopeRain = () => {
  const [triggerCampaignDetail, { data: detail, isLoading: isDetailLoading }] =
    useGetCampaignDetailMutation();
  const [
    triggerParticipate,
    { data, isSuccess, isError, error, isLoading: isParticipateLoading },
  ] = usePostParticipateEndpointMutation();
  const { t } = useTranslation();
  const isOpenLoading = isDetailLoading || isParticipateLoading;
  const [tipProps, setTipProps] = useState<IActivityTipsModelProps | null>();

  const { sendMessage } = useActivityCenterMessage({
    onReceive: (data) => {
      console.log('收到父页面的消息:', data);
    },
  });
  const canvasId = 'red_envelope_rain_page';
  const location = useLocation();
  const [campaignId] = useState(() => {
    const params = new URLSearchParams(location.search);
    return Number(params.get('campaignId'));
  });
  const [coinsRain] = useState(
    new PageRainCanvas({
      selector: canvasId,
      imgInfo: {
        w: 50,
        h: 50,
        urls: Array.from({ length: 5 }, (v, _i) =>
          getImgUrl(EResourceLevel.V, `red_envelope_coin0${_i + 1}`)
        ),
      },
    })
  );
  const { animate, runAnimate } = useAnimation('animate__zoomIn', 500, false);

  useEffect(() => {}, []);
  useEffect(() => {
    return () => {
      coinsRain.stop();
    };
  });
  useEffect(() => {
    if (isSuccess) {
      coinsRain.start();
      sendMessage({
        type: EMessageType.SUCCESS,
        data,
      });
    }
    if (isError && error) {
      error === 'Cannot participate multiple times'
        ? setTipProps({
            title: t('red_packets_rain_popup_received_title'),
            content: (
              <>
                <div>
                  {t('red_packets_rain_popup_received_content_1')}
                  {t('red_packets_rain_popup_received_content_2')}
                </div>
                <TimeRangeText
                  distributeTimeRanges={
                    detail?.displayConfig.distributeTimeRanges
                  }
                />
              </>
            ),
          })
        : error === 'Not in available time'
        ? setTipProps({
            title: t('red_packets_rain_popup_unavailable_title'),
            content: (
              <>
                <div>{t('red_packets_rain_popup_unavailable_content_1')}</div>

                <TimeRangeText
                  distributeTimeRanges={
                    detail?.displayConfig.distributeTimeRanges
                  }
                />
              </>
            ),
          })
        : setTipProps({
            title: 'Error',
            content: error as string,
          });
    }
  }, [isSuccess, isError, error]);

  const handleParticipate = async () => {
    if (isOpenLoading) return;

    // STEP 获取红包雨数据详情
    const res = await triggerCampaignDetail({
      campaignId,
    });
    if ('data' in res && res.data) {
      triggerParticipate({ campaignId });
    } else {
      'error' in res && res.error && message.error(res.error as string);
    }
  };
  const handleClose = () => {
    runAnimate('animate__zoomOut', () => {
      sendMessage({
        type: EMessageType.CLOSE,
      });
    });
  };
  useEffect(() => {
    console.log(
      '是否为iOS内核:',
      sdkUtils.isIOSKernel(),
      '是否为Android内核:',
      sdkUtils.isAndroidKernel(),
      '是否在  apk 內:',
      sdkUtils.isInNative(),
      'PWA是否已安装',
      sdkUtils.isPwaInstalled(),
      'navigator.userAgent:',
      navigator.userAgent
    );
  }, []);

  return (
    <div>
      {tipProps ? (
        <ActivityTipsModel {...tipProps} onClose={handleClose} />
      ) : (
        <div className="w-screen h-screen red-envelope-rain">
          <canvas id={canvasId} className="fixed"></canvas>
          <div className="w-full h-full flex justify-center items-center">
            <div className={cx(animate, 'relative')}>
              <div
                className="absolute w-6 h-6 left-1/2 -translate-x-1/2 -bottom-10 cursor-pointer border border-white rounded-full p-1"
                onClick={handleClose}
              >
                <Icon className="w-full" color="white" name="ic_close" />
              </div>

              {isSuccess ? (
                <div className={animate}>
                  <img
                    className="max-w-72 -mt-10 cursor-pointer "
                    src={getImgUrl(
                      EResourceLevel.V,
                      `red_envelope_open`,
                      '.gif'
                    )}
                    alt="red_envelope"
                  />
                  <div className=" absolute w-full  bottom-16  text-white flex flex-col items-center text-center">
                    <div className="text-sm font-semibold">
                      {t('red_packets_rain_popup_reward_1')}
                    </div>
                    <span className="font-bold text-3xl">
                      {(data?.rewardChunk?.amount || 0).toFixed(2)}
                    </span>

                    <div className="text-xs px-16">
                      {t('red_packets_rain_popup_reward_2')}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={cx(
                    'max-w-52 -mt-10 cursor-pointer relative',
                    isOpenLoading ? 'loading-open-envelope' : ''
                  )}
                  onClick={handleParticipate}
                >
                  <img
                    src={getImgUrl(EResourceLevel.V, `red_envelope_close`)}
                    alt="red_envelope"
                  />
                  <img
                    className=" absolute left-2/3 top-1/2 -translate-y-6 w-14 -rotate-45"
                    src={getImgUrl(EResourceLevel.V, `hand`, '.gif')}
                    alt="hand"
                  />
                  <div className="text-white absolute w-24 h-10 left-1/2 -translate-x-1/2  bottom-16 text-base leading-5 text-center">
                    {t('red_packets_rain_popup_open')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default RedEnvelopeRain;
