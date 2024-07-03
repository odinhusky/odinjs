import cx from 'apps/gambling/src/app/ui/utils/cx';
import { ReactNode } from 'react';
import { FLEX_CENTER } from 'apps/gambling/src/assets/constant/style';

interface U7OutlinedTransparentBtnProps {
  children?: ReactNode;
  className?: string;
  containerClass?: string;
  disabled?: boolean;
  onClick?: <T>(arg?: T) => void;
}

export const U7OutlinedTransparentBtn = ({
  children,
  className,
  disabled = false,
  containerClass,
  onClick,
}: U7OutlinedTransparentBtnProps) => {
  const layoutWidth = cx('w-full');

  return (
    <div className={cx(FLEX_CENTER, containerClass)}>
      <button
        disabled={disabled}
        onClick={onClick}
        className={cx(
          FLEX_CENTER,
          'p-[9px]',
          layoutWidth,
          'border border-[var(--transparent-white-40)]',
          'rounded-[100px]',
          'bg-[var(--transparent-white-10)]',
          'hover:bg-[var(--transparent-white-20)]',
          'active:bg-[var(--transparent-white-30)]',
          'font-bold',
          'text-sm leading-[18px]',
          className
        )}
      >
        {children}
      </button>
    </div>
  );
};

export default U7OutlinedTransparentBtn;
