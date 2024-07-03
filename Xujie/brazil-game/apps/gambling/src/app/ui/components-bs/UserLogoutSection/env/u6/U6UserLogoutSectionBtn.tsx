import cx from 'apps/gambling/src/app/ui/utils/cx';
import { CSSProperties, ReactNode } from 'react';

interface U6UserLogoutSectionBtnProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export const U6UserLogoutSectionBtn = ({
  children,
  className,
  style,
  onClick,
}: U6UserLogoutSectionBtnProps) => {
  return (
    <button
      className={cx('w-full', 'h-9 tablet:h-12', 'rounded-lg', className)}
      style={{
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default U6UserLogoutSectionBtn;
