import cx from 'apps/gambling/src/app/ui/utils/cx';
import { LuckyWheelRecordSwitchBtnsProps } from '../../components/LuckyWheelRecordSwitchBtns';
import { FLEX_CENTER } from 'apps/gambling/src/assets/constant/style';

export const LuckyWheelRecordSwitchBtnsU6 = ({
  recordBtns,
  activeRecordBtn,
  setActiveRecordBtn,
}: LuckyWheelRecordSwitchBtnsProps) => {
  return (
    <div
      className={cx(
        'w-full tab:w-[400px]',
        'flex items-center',
        'bg-[var(--grayscale-40)]',
        'rounded-lg'
      )}
    >
      {recordBtns.map((btn) => (
        <button
          key={btn.id}
          className={cx(
            'w-full',
            'h-[40px]',
            'rounded-[8px]',
            'tab:max-w-[200px]',
            'text-xs leading-5',
            'tablet:text-base tablet:leading-6',
            'tab:text-sm tab:leading-5',
            {
              'lucky-wheel-tabs-btn': activeRecordBtn === btn.state,
              'lucky-wheel-tabs-btn-disabled': activeRecordBtn !== btn.state,
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

export default LuckyWheelRecordSwitchBtnsU6;
