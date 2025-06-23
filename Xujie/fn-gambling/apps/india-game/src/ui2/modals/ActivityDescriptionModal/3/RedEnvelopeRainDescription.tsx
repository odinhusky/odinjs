import { handleActivityDescriptionClose } from '@mode2/action/actionTypes';
import useActivityCenterAction from '@libs/mode2/action/activityCenterAction/useActivityCenterAction';
import { useActivityCountdown } from '@libs/mode2/usecase/useActivityCenterBase';
import {
  EResourceLevel,
  formatCountdownTime,
  getImgUrl,
} from '@libs/mode2/utils';
import useActivityCenterStore from '@libs/mode2/zustand/components/activityCenterStore';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { cx } from '@libs/commonUtils';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';
import { CloseBtnUnit } from '@modals/BaseModalCloseButton';

const RedEnvelopeRainDescription = () => {
  const { t } = useTranslation();
  const redEnvelopeRainResult = useActivityCenterStore(
    (state) => state.redEnvelopeRainResult
  );
  const setShowActivityDescriptionModal = useActivityCenterStore(
    (state) => state.setShowActivityDescriptionModal
  );
  const setShowActivityCenterModal = useActivityCenterStore(
    (state) => state.setShowActivityCenterModal
  );

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
    <div className='relative max-w-[384px]'>
      <CloseBtnUnit
        customClass="!border-none w-9 h-9 absolute -top-14 -right-0 !p-0 rounded-none"
        onClose={() => {
          handleActivityCenterClick({
            actionName: handleActivityDescriptionClose,
            payload: redEnvelopeRainResult.id,
          });
        }}
      />

      {/* {countdown && <RedEnvelopeRainEventTimer countdown={countdown} />} */}

      <div className="relative overflow-hidden rounded-[10px]">
        <BaseCacheImg
          src={getImgUrl(EResourceLevel.V, 'activity_red_envelope_desc_bg')}
          alt="activity_red_envelope_desc_bg"
        />

        {countdown ? (
          <div className="text-center">
            <div className="my-4 flex items-center justify-center">
              <p className="w-8 h-0.5 bgi-[var(--base-1-variant6)]"></p>
              <div
                className={cx(
                  'text-lg mx-4 font-medium bgi-text-[var(--base-1-variant6)]'
                )}
              >
                {t('home_popup_countdown')}
              </div>
              <p className="w-8 h-0.5 bgi-[var(--base-1-variant6)]"></p>
            </div>

            <div
              className={cx(
                'text-[32px] font-medium bgi-text-[var(--base-1-variant6)]'
              )}
            >
              {formatCountdownTime(countdown) || '00:00:00'}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  ) : null;
};
export default RedEnvelopeRainDescription;
