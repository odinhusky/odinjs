import cx from 'apps/gambling/src/app/ui/utils/cx';
import { LuckyWheelBtnProps } from '../../components/LuckyWheelBtn';

export const LuckyWheelBtnU7 = ({
  isDisabled = false,
  children = '',
  className = '',
  onClick = () => {},
}: LuckyWheelBtnProps) => {
  return (
    <button
      className={cx(
        'w-full h-[40px]',
        'mt-3 tab:mt-0',
        'font-bold',
        'py-2 px-5 pr-0',
        'text-sm leading-5',
        'tablet:text-base tablet:leading-6',
        'text-important',
        {
          'lucky-wheel-btn': !isDisabled,
          '': isDisabled,
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default LuckyWheelBtnU7;
