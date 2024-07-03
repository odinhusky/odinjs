import cx from "apps/gambling/src/app/ui/utils/cx";
import { ReactNode } from "react";

interface U7BorderDivProps {
  children?: ReactNode;
  className?: string;
}

export const U7BorderDiv = ({
  children,
  className
}: U7BorderDivProps) => {
  return (
    <div className={cx(
      'border-stroke',
      'rounded-[8px]',
      'h-full tab:h-fit',
      className
    )}>
      {children}
    </div>
  )
}

export default U7BorderDiv;