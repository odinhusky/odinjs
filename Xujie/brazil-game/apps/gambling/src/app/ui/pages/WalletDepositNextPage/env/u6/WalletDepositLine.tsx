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
        'py-2 px-4 tablet:py-3 tablet:px-5',
        'flex justify-between',
        'bg-[var(--grayscale-40)]',
        'rounded-lg tablet:rounded-xl'
      )}
    >
      <div className={cx(
        'text-sm leading-5 mobile:text-base mobile:leading-6 tablet:text-lg',
        'text-[var(--grayscale-70)]'
      )}>{title}</div>

      <div className={cx(
        'text-sm leading-5 mobile:text-base mobile:leading-6 tablet:text-lg',
        'text-white'
      )}>{value}</div>
    </div>
  )
}

export default WalletDepositLine;