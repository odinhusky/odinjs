import { useMillisecondCountdown } from '@libs/commonUtils';
import useDepositJackpotWheelModalStore from '@libs/mode2/zustand/modal/DepositJackpotWheelModal';
import dayjs from 'dayjs';

export const DepositJackpotWheelRewardModalCountDown = () => {
  const doubleBuffRechargeBonusLimitedEndTime =
    useDepositJackpotWheelModalStore(
      (state) => state.doubleBuffRechargeBonusLimitedEndTime
    );

  const nowUnix = dayjs().unix();

  const countdownTime =
    doubleBuffRechargeBonusLimitedEndTime > nowUnix
      ? (doubleBuffRechargeBonusLimitedEndTime - nowUnix) * 1000
      : 0;

  const { formattedTime } = useMillisecondCountdown({
    duration: countdownTime,
    onEnd: () => {
      console.log('!! DepositJackpotWheelRewardModal count down end');
    },
    millisecondDigits: 0,
  });

  return <span>{formattedTime || 'hh:mm:ss'}</span>;
};

export default DepositJackpotWheelRewardModalCountDown;
