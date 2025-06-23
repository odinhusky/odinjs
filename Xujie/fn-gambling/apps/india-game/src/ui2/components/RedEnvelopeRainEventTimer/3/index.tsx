import { EResourceLevel, formatCountdownTime, getImgUrl } from '@mode2/utils';

export const RedEnvelopeRainEventTimer = ({
  countdown,
}: {
  countdown: number;
}) => {
  const [hour, min] = formatCountdownTime(countdown || 0).split(':');

  return (
    <div className="relative">
      <div className="absolute pb-6 w-full h-full bgi-text-[var(--grayscale-100)] text-3xl font-bold flex items-center justify-center ">
        <span className="border-2 border-white rounded-xl px-5">{hour}</span>
        <span className="mx-2 block">:</span>
        <span className="border-2 border-white rounded-xl px-5">{min}</span>
      </div>

      <img
        src={getImgUrl(
          EResourceLevel.V,
          'activity_red_envelope_countdown_bg',
          '.gif'
        )}
        alt="activity_red_envelope_countdown_bg"
      />
    </div>
  );
};
