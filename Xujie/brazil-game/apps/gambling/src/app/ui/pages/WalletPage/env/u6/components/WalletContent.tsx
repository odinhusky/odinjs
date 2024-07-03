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
    <div className={cx(
      'text-center mobile:text-left',
      'text-sm tablet:text-base',
      'leading-5 tablet:leading-6',
      'rounded-2xl',
      'bg-[var(--transparente-10)]',
      'py-3 px-4 mobile:py-4 mb-3',
      className
    )}>
      {children}
    </div>
  )
}

export default WalletContent;