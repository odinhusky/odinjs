import cx from 'apps/gambling/src/app/ui/utils/cx';
import { CSSProperties, ReactNode } from 'react';

interface P1UserLogoutSectionBtnProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  type?: 'confirm' | 'cancel';
}

export const P1UserLogoutSectionBtn = ({
  children,
  className,
  style,
  onClick,
  type,
}: P1UserLogoutSectionBtnProps) => {
  const bgLinearStyle = type
    ? type === 'cancel'
      ? 'linear-gradient(180deg, #d5d5d5 0%, #b2b2b2 100%)'
      : type === 'confirm'
      ? 'linear-gradient(180deg, #C8F568 0%, #16FF8F 99%)'
      : 'none'
    : 'none';

  return (
    <button
      className={cx(
        'w-full',
        'py-[10px]',
        'text-base font-bold ',
        'rounded-lg',
        'm-1',
        {
          'text-[#047a70]': type === 'confirm',
        },
        className
      )}
      style={{
        background: bgLinearStyle,
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default P1UserLogoutSectionBtn;
