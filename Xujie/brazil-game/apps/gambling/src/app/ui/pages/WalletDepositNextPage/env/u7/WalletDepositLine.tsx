import cx from "apps/gambling/src/app/ui/utils/cx";

interface WalletDepositLineProps {
  title: string;
  value: number | string;
}

export const WalletDepositLine = ({
  title,
  value
}: WalletDepositLineProps) => {
  return (
    <div 
      className={cx(
        'border-popup-button before:rounded-lg bg-popup1 flex',
        'tablet:text-base mobile:text-xl text-sm py-2 px-5 font-medium', 
        'rounded-lg justify-between shadow-[0px_4px_4px_0px_#00000040]' 
      )}
    >
      <div className={cx(
        'text-[var(--grayscale-70)]'
      )}>{title}</div>

      <div className={cx(
        'text-[var(--grayscale-100)]'
      )}>{value}</div>
    </div>
  )
}

export default WalletDepositLine;