import cx from 'apps/gambling/src/app/ui/utils/cx';
import { LuckyWheelRecordSwitchBtnsProps } from '../../components/LuckyWheelRecordSwitchBtns';
import { FLEX_CENTER } from 'apps/gambling/src/assets/constant/style';
import LuckyWheelBtn from '../../components/LuckyWheelBtn';

export const LuckyWheelRecordSwitchBtnsU1 = ({
  recordBtns,
  activeRecordBtn,
  setActiveRecordBtn,
}: LuckyWheelRecordSwitchBtnsProps) => {
  return (
    <div className={cx('w-full', FLEX_CENTER, 'gap-2 tab:gap-4')}>
      {recordBtns.map((btn) => (
        <LuckyWheelBtn
          key={btn.id}
          className={cx(
            'flex-1',
            'h-[32px]',
            'tab:h-[44px]',
            'tablet:max-w-[352px] tablet:h-[40px]',
            'text-xs leading-4',
            'tab:text-lg tab:leading-7',
            'tablet:text-base tablet:leading-6'
          )}
          children={btn.label}
          isDisabled={activeRecordBtn !== btn.state}
          onClick={() => {
            setActiveRecordBtn(btn.state);
          }}
        />
      ))}
    </div>
  );
};

export default LuckyWheelRecordSwitchBtnsU1;
