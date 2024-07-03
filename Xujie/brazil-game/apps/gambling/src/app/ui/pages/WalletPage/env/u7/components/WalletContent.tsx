import cx from "apps/gambling/src/app/ui/utils/cx";
import { ReactNode } from "react";

interface WalletContentProps {
  children: ReactNode
  className?: string;
}

export const WalletContent = ({
  className,
  children
}: WalletContentProps) => {
  return (
    <div className={cx("border-popup-button bg-linear-4-main rounded-lg before:rounded-lg py-3 px-5",
      className
    )}>
      {children}
    </div>
  )
}

export default WalletContent;