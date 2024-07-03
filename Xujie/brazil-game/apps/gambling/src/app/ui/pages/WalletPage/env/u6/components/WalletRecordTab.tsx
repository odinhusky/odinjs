import BaseBtn from "apps/gambling/src/app/ui/components-bs/Buttons/BaseBtn";
import cx from "apps/gambling/src/app/ui/utils/cx";

interface WalletRecordTabProps {
  title: string;
  active: boolean;
  onClick: () => void;
}

export const WalletRecordTab = ({
  title,
  active,
  onClick
}: WalletRecordTabProps) => {
  return (
    <BaseBtn
      btnClass={cx(
        'py-[6px] px-[16px]',
        'border-2 border-[transparent]',
        'rounded-lg',
        {
          'border-[var(--state-success-main)] bg-[var(--grayscale-50)]': active
        }
      )}
      childrenClass={cx(
        'text-[var(--grayscale-80)] font-medium text-sm leading-5',
        {
          'text-white': active
        }
      )}
      children={title}
      onClick={onClick}
    />
  )
}

export default WalletRecordTab;