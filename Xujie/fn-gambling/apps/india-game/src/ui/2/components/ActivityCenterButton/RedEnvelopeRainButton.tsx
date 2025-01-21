import {
  handleFloatActivityOnHomClick,
  handleFloatActivityOnHomClose,
} from '@libs/mode2/action/activityCenterAction/acitonType';
import useActivityCenterAction from '@libs/mode2/action/activityCenterAction/useActivityCenterAction';
import Icon from '@libs/mode2/components/Icon';
import { useActivityCountdown } from '@libs/mode2/usecase/useActivityCenterBase';
import {
  EResourceLevel,
  formatCountdownTime,
  formatMoney,
  getImgUrl,
} from '@libs/mode2/utils';
import useActivityCenterStore, {
  ERedEnvelopRainStatus,
} from '@libs/mode2/zustand/components/activityCenterStore';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

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
      className="relative cursor-pointer w-24"
      onClick={(event) => {
        handleActivityCenterClick({
          actionName: handleFloatActivityOnHomClick,
          payload: redEnvelopeRainResult.type,
        });
      }}
    >
      <Icon
        className="absolute right-0 top-0 bgi-[var(--transparent-gray-50)] rounded-full z-10 w-5 h-5"
        name="ic_close"
        onClick={(event) => {
          event.stopPropagation();
          handleActivityCenterClick({
            actionName: handleFloatActivityOnHomClose,
            payload: redEnvelopeRainResult.type,
          });
        }}
      />

      <div className="relative w-full ">
        <div className="w-full absolute p-1.5 bottom-0 left-0 text-xxs text-center">
          {
            {
              TWO_HOUR_BEFORE_START: (
                <div className="text-[var(--grayscale-100)] font-semibold max-w-20">
                  {t('red_packets_rain_state_default')}
                </div>
              ),
              ONE_HOUR_BEFORE_START: (
                <div className="text-[var(--grayscale-100)] font-semibold">
                  {t('red_packets_rain_state_start_at')}
                  <div>
                    {dayjs(redEnvelopeRainResult.nextTimes?.start).format(
                      'HH:mm'
                    )}
                  </div>
                </div>
              ),
              HALF_HOUR_BEFORE_START: (
                <div className="text-[var(--grayscale-100)] font-semibold">
                  {t('red_packets_rain_state_countdown')}
                  <div className="bgi-text-[var(--state-warn-main)]">
                    {countdown ? formatCountdownTime(countdown) : ''}
                  </div>
                </div>
              ),
              IN_PROGRESS: (
                <div className="bgi-text-[var(--state-warn-main)] font-semibold">
                  {t('red_packets_rain_state_in_progress')}
                  <br />
                  {countdown ? formatCountdownTime(countdown) : ''}
                </div>
              ),
              NULL: null,
            }[redEnvelopeRainResult.status]
          }

          <div
            className="font-bold bgi-text-[var(--linear-1)] pt-1"
            style={{
              backgroundImage:
                'linear-gradient(180deg, #FFB74B 0%, #FFDD76 20%, #FFECD1 36%, #FFDD76 52%, #D99146 68.5%, #FFDD76 89.5%)',
            }}
          >
            {formatMoney(redEnvelopeRainResult?.maxRewardAmount || 0)}
          </div>
        </div>
        <img
          className="w-full"
          src={getImgUrl(
            EResourceLevel.V,
            'activity_red_envelope_icon',
            '.gif'
          )}
          alt="activity_center_icon"
        />
      </div>
    </div>
  ) : null;
};
export default RedEnvelopeRainButton;
