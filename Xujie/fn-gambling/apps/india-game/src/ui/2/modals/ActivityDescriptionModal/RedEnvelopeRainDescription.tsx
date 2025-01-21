import { handleActivityDescriptionClose } from '@libs/mode2/action/activityCenterAction/acitonType';
import useActivityCenterAction from '@libs/mode2/action/activityCenterAction/useActivityCenterAction';
import Icon from '@libs/mode2/components/Icon';
import { useActivityCountdown } from '@libs/mode2/usecase/useActivityCenterBase';
import { EResourceLevel, formatMoney, getImgUrl } from '@libs/mode2/utils';
import useActivityCenterStore from '@libs/mode2/zustand/components/activityCenterStore';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RedEnvelopeRainEventTimer } from '@components/RedEnvelopeRainEventTimer';

const TextKeywordMark = ({
  i18next,
}: {
  i18next: {
    key: string;
    options?: Record<string, string | number>;
  };
}) => {
  const { t } = useTranslation();
  const keywords = Object.keys(i18next.options || {}).map(
    (key) => i18next.options?.[key]
  );

  return (
    <div className="flex items-center whitespace-pre">
      <span className="w-1.5 h-1.5 rounded-full bg-white inline-block mr-2" />

      {t(i18next.key, i18next.options)
        .split(new RegExp(`(${keywords.join('|')})`, 'g'))
        .map((part, index) =>
          keywords.find((v) => v === part) ? (
            <span key={index} className="bgi-text-[var(--base-2-main)]">
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
    </div>
  );
};

const RedEnvelopeRainDescription = () => {
  const {
    redEnvelopeRainResult,
    setShowActivityDescriptionModal,
    setShowActivityCenterModal,
  } = useActivityCenterStore((state) => ({
    redEnvelopeRainResult: state.redEnvelopeRainResult,
    setShowActivityDescriptionModal: state.setShowActivityDescriptionModal,
    setShowActivityCenterModal: state.setShowActivityCenterModal,
  }));
  const countdown = useActivityCountdown(redEnvelopeRainResult);
  // const [hour, min] = formatCountdownTime(countdown || 0).split(':');
  const { handleActivityCenterClick } = useActivityCenterAction();
  useEffect(() => {
    if (countdown === 0) {
      setShowActivityCenterModal(true);
      setShowActivityDescriptionModal(false);
    }
  }, [countdown]);
  return redEnvelopeRainResult ? (
    <div className="max-w-96 relative">
      <div
        className="absolute w-6 h-6 left-1/2 -translate-x-1/2 -bottom-10 cursor-pointer border border-white rounded-full p-1"
        onClick={() => {
          handleActivityCenterClick({
            actionName: handleActivityDescriptionClose,
            payload: redEnvelopeRainResult.id,
          });
        }}
      >
        <Icon className="w-full" color="white" name="ic_close" />
      </div>

      {countdown && <RedEnvelopeRainEventTimer countdown={countdown} />}

      <div className=" relative overflow-hidden rounded-t-3xl ">
        <img
          src={getImgUrl(
            EResourceLevel.V,
            'activity_red_envelope_desc_bg',
            '.gif'
          )}
          alt="activity_red_envelope_desc_bg"
        />
        <div className="text-[var(--grayscale-100)] px-2 py-4  rounded-b-3xl bgi-[var(--primary-10)]">
          <TextKeywordMark
            i18next={{
              key: 'popup_home_red_packets_rain_intro_1',
              options: {
                account: formatMoney(redEnvelopeRainResult.maxRewardAmount),
              },
            }}
          />

          <TextKeywordMark
            i18next={{
              key: 'popup_home_red_packets_rain_intro_2',
              options: {
                times: redEnvelopeRainResult.times,
              },
            }}
          />
          <TextKeywordMark
            i18next={{
              key: 'popup_home_red_packets_rain_intro_3',
            }}
          />
          <TextKeywordMark
            i18next={{
              key: 'popup_home_red_packets_rain_intro_4',
            }}
          />
        </div>
      </div>
    </div>
  ) : null;
};
export default RedEnvelopeRainDescription;
