import cx from 'apps/gambling/src/app/ui/utils/cx';
import { ReactNode } from 'react';
import { FLEX_CENTER } from 'apps/gambling/src/assets/constant/style';

interface U7Linear2BtnProps {
  children?: ReactNode;
  className?: string;
  borderClass?: string;
  disabled?: boolean;
  onClick?: <T>(arg?: T) => void;
}

export const U7Linear2Btn = ({
  children,
  className,
  borderClass,
  disabled = false,
  onClick,
}: U7Linear2BtnProps) => {
  const layoutWidth = cx('w-full');

  return (
    <div className={cx('w-full', borderClass)}>
      <button
        disabled={disabled}
        onClick={onClick}
        className={cx(
          FLEX_CENTER,
          'p-[9px]',
          layoutWidth,
          'linear-2-button',
          'font-bold',
          'text-sm leading-[18px]',
          'rounded-[100px]',
          'active:text-[var(--grayscale-70)]',
          className
        )}
      >
        {children}
      </button>
    </div>
  );
};

export default U7Linear2Btn;
