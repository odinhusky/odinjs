import { BaseBtn } from "apps/gambling/src/app/ui/components-bs/Buttons/BaseBtn";
import cx from "apps/gambling/src/app/ui/utils/cx";

interface WalletTabProps {
  active: boolean;
  onClick: ()=> void;
  title: string
}

export const WalletTab = ({
  active,
  title,
  onClick
}: WalletTabProps) => {
  return (
    <BaseBtn
      isActive={active}
      activeBgClass="bg-linear-2-main"
      btnClass={
        cx(
          'rounded-lg',
          'w-full mobile:w-fit',
          'py-2 mobile:px-4 tablet:py-[10px]',
          'border-0'
        )
      }
      childrenClass={cx(
        'text-[var(--grayscale-80)]',
        { 'text-white': active },
        'text-sm leading-5 tablet:text-base tablet:leading-6'
      )}
      onClick={onClick}
    >
      {title}
    </BaseBtn>
  )
}

export default WalletTab;