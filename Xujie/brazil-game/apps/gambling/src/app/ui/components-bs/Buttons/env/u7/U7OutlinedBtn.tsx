import cx from 'apps/gambling/src/app/ui/utils/cx';
import { ReactNode } from 'react';
import U7BorderDiv from '../../../../components/U7BorderDiv';
import { FLEX_CENTER } from 'apps/gambling/src/assets/constant/style';

interface U7OutlinedBtnProps {
  children?: ReactNode;
  className?: string;
  borderClass?: string;
  disabled?: boolean;
  onClick?: <T>(arg?: T) => void;
}

export const U7OutlinedBtn = ({
  children,
  className,
  borderClass,
  disabled = false,
  onClick,
}: U7OutlinedBtnProps) => {
  const layoutWidth = cx('w-full');

  return (
    <U7BorderDiv className={cx(layoutWidth, 'rounded-[100px]', borderClass)}>
      <button
        disabled={disabled}
        onClick={onClick}
        className={cx(
          FLEX_CENTER,
          'p-[9px]',
          layoutWidth,
          'linear-4-button',
          'font-bold',
          'text-sm leading-[18px]',
          'rounded-[100px]',
          'active:text-[var(--grayscale-70)]',
          className
        )}
      >
        {children}
      </button>
    </U7BorderDiv>
  );
};

export default U7OutlinedBtn;
