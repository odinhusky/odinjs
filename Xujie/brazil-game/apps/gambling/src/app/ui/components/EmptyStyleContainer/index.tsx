import cx from 'apps/gambling/src/app/ui/utils/cx';
import { ReactNode } from 'react';

interface EmptyStyleContainerProps {
  className?: string;
  children?: ReactNode;
}

export const EmptyStyleContainer = ({
  className,
  children,
}: EmptyStyleContainerProps) => {
  return <div className={cx(className)}>{children}</div>;
};

export default EmptyStyleContainer;
