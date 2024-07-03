import cx from 'apps/gambling/src/app/ui/utils/cx';
import { LuckyWheelRecordSwitchBtnsProps } from '../../components/LuckyWheelRecordSwitchBtns';
import { FLEX_CENTER } from 'apps/gambling/src/assets/constant/style';
import LuckyWheelBtn from '../../components/LuckyWheelBtn';

export const LuckyWheelRecordSwitchBtnsU2 = ({
  recordBtns,
  activeRecordBtn,
  setActiveRecordBtn,
}: LuckyWheelRecordSwitchBtnsProps) => {
  return (
    <div
      className={cx(
        'w-full tab:w-[400px]',
        FLEX_CENTER,
        'bg-[var(--grayscale-30)]',
        'rounded-[100px]',
        'mx-auto'
      )}
    >
      {recordBtns.map((btn) => (
        <button
          key={btn.id}
          className={cx(
            'w-full',
            'h-[40px]',
            'rounded-[100px]',
            'tab:max-w-[200px]',
            'text-xs leading-4',
            'tab:text-sm tab:leading-5',
            {
              'lucky-wheel-primary-btn': activeRecordBtn === btn.state,
              'lucky-wheel-primary-btn-disabled': activeRecordBtn !== btn.state,
            }
          )}
          children={btn.label}
          onClick={() => {
            setActiveRecordBtn(btn.state);
          }}
        />
      ))}
    </div>
  );
};

export default LuckyWheelRecordSwitchBtnsU2;
