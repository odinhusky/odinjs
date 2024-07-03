import cx from 'apps/gambling/src/app/ui/utils/cx';
import { LuckyWheelRecordSwitchBtnsProps } from '../../components/LuckyWheelRecordSwitchBtns';
import {
  FLEX_CENTER,
  FLEX_ITEMS_CENTER,
} from 'apps/gambling/src/assets/constant/style';

export const LuckyWheelRecordSwitchBtnsU7 = ({
  recordBtns,
  activeRecordBtn,
  setActiveRecordBtn,
}: LuckyWheelRecordSwitchBtnsProps) => {
  return (
    <div className={cx('w-full tab:w-[400px]', FLEX_ITEMS_CENTER, 'mx-auto')}>
      {recordBtns.map((btn) => (
        <button
          key={btn.id}
          className={cx(
            'w-full',
            'h-[40px]',
            'rounded-full',
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

export default LuckyWheelRecordSwitchBtnsU7;
