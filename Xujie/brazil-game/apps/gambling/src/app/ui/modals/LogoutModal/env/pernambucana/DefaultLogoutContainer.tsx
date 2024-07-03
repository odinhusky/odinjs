import cx from 'apps/gambling/src/app/ui/utils/cx';
import { ReactNode } from 'react';

interface DefaultLogoutContainerProps {
  className?: string;
  children?: ReactNode;
}

export const DefaultLogoutContainer = ({
  className,
  children,
}: DefaultLogoutContainerProps) => {
  return (
    <div
      className={cx(
        'fixed right-[10px] top-[100px] z-30',
        'w-[240px]',
        'bg-assistant',
        'rounded-xl',
        'p-[10px]',
        'flex flex-col flex-between',
        'text-white text-sm',
        className
      )}
    >
      {children}
    </div>
  );
};

export default DefaultLogoutContainer;
