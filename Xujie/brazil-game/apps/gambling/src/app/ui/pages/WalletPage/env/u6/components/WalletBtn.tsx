import BaseBtn from "apps/gambling/src/app/ui/components-bs/Buttons/BaseBtn";
import cx from "apps/gambling/src/app/ui/utils/cx";
import { ReactNode } from "react";

interface WalletBtnProps {
  children?: ReactNode;
  btnClass?: string;
  onClick?: <T>(arg?: T) => void;
  disabled?: boolean;
}

export const WalletBtn = ({
  children,
  btnClass = '',
  onClick = () => {},
  disabled = false,
}: WalletBtnProps) => {
  return (
    <BaseBtn
      btnClass={cx(
        'mobile:max-w-[284px] tablet:max-w-[400px]',
        'h-[36px] mobile:h-[40px] tablet:h-[48px]',
        'rounded-lg',
        'py-3',
        'border-0',
        {
          'bg-linear-2-disabled cursor-default': disabled,
          'linear-2-button': !disabled
        },
        btnClass
      )}
      childrenClass={cx(
        'text-white text-sm leading-5 font-medium'
      )}
      children={children}
      onClick={disabled ? () => {} : onClick}
    />
  )
}

export default WalletBtn;