import {
  handleFloatActivityOnHomClick,
  handleFloatActivityOnHomClose,
} from '@mode2/action/actionTypes';
import useActivityCenterAction from '@mode2/action/activityCenterAction/useActivityCenterAction';
import Icon from '@components/Icon';
import { useActivityCountdown } from '@mode2/usecase/useActivityCenterBase';
import {
  EResourceLevel,
  formatCountdownTime,
  formatMoney,
  getImgUrl,
} from '@mode2/utils';
import useActivityCenterStore, {
  ERedEnvelopRainStatus,
} from '@mode2/zustand/components/activityCenterStore';
import dayjs from '@commonUtils/localizedDayjs';
import { useTranslation } from 'react-i18next';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';

const RedEnvelopeRainButton = () => {
  const redEnvelopeRainResult = useActivityCenterStore(
    (state) => state.redEnvelopeRainResult
  );
  const { handleActivityCenterClick } = useActivityCenterAction();
  const countdown = useActivityCountdown(redEnvelopeRainResult);

  const { t } = useTranslation();
  return redEnvelopeRainResult &&
    redEnvelopeRainResult.status !== ERedEnvelopRainStatus.NULL &&
    !redEnvelopeRainResult.hidden ? (
    <div
      className="relative cursor-pointer w-20"
      onClick={(event) => {
        handleActivityCenterClick({
          actionName: handleFloatActivityOnHomClick,
          payload: { type: redEnvelopeRainResult.type },
        });
      }}
    >
      <Icon
        className="absolute right-0 top-0 bgi-[var(--transparent-gray-50)] rounded-full z-10 w-6 h-6 p-1"
        name="ic_close"
        onClick={(event) => {
          event.stopPropagation();
          handleActivityCenterClick({
            actionName: handleFloatActivityOnHomClose,
            payload: { type: redEnvelopeRainResult.type },
          });
        }}
      />

      <div className="relative w-full ">
        <div className="w-full absolute px-0.5 bottom-1 left-0 text-xxs text-center">
          {
            {
              TWO_HOUR_BEFORE_START: (
                <div className="bgi-text-[var(--grayscale-100)] font-semibold max-w-20">
                  {t('red_packets_rain_state_default')}
                </div>
              ),
              ONE_HOUR_BEFORE_START: (
                <div className="bgi-text-[var(--grayscale-100)] font-semibold">
                  {t('red_packets_rain_state_start_at')}
                  <div>
                    {dayjs(redEnvelopeRainResult.nextTimes?.start).format(
                      'HH:mm'
                    )}
                  </div>
                </div>
              ),
              HALF_HOUR_BEFORE_START: (
                <div className="bgi-text-[var(--grayscale-100)] font-semibold">
                  {t('red_packets_rain_state_countdown')}
                  <div className="bgi-text-[var(--state-error-main)]">
                    {countdown ? formatCountdownTime(countdown) : ''}
                  </div>
                </div>
              ),
              IN_PROGRESS: (
                <div className="bgi-text-[var(--state-error-main)] font-semibold">
                  {t('red_packets_rain_state_in_progress')}
                  <br />
                  {countdown ? formatCountdownTime(countdown) : ''}
                </div>
              ),
              NULL: null,
            }[redEnvelopeRainResult.status]
          }

          <div
            className="font-bold bgi-text-[var(--linear-1)] pt-0.5"
            style={{
              backgroundImage:
                'linear-gradient(180deg, #FFB74B 0%, #FFDD76 20%, #FFECD1 36%, #FFDD76 52%, #D99146 68.5%, #FFDD76 89.5%)',
            }}
          >
            {formatMoney({
              value: redEnvelopeRainResult?.maxRewardAmount || 0,
            })}
          </div>
        </div>
        <BaseCacheImg
          className="w-full"
          src={getImgUrl(
            EResourceLevel.V,
            'activity_red_envelope_icon',
            '.webp'
          )}
          imgName="activity_red_envelope_icon.gif"
          alt="activity_center_icon"
        />
      </div>
    </div>
  ) : null;
};
export default RedEnvelopeRainButton;
