import cx from 'apps/gambling/src/app/ui/utils/cx';
import { CSSProperties, ReactNode } from 'react';

interface U5UserLogoutSectionBtnProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export const U5UserLogoutSectionBtn = ({
  children,
  className,
  style,
  onClick,
}: U5UserLogoutSectionBtnProps) => {
  return (
    <button
      className={cx(
        'state-warn-button',
        'font-extrabold',
        'flex-1',
        'h-10 tablet:h-12',
        className
      )}
      style={{
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default U5UserLogoutSectionBtn;
