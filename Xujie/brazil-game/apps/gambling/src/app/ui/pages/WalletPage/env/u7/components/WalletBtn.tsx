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
  btnClass = "",
  onClick = () => {},
  disabled = false,
}: WalletBtnProps) => {
  return (
    <BaseBtn
      btnClass={cx(
        "linear-1-button max-w-[480px] h-12 rounded-full shadow-[0px_4px_4px_#00000040]",
        " border-solid border border-[var(--grayscale-60)]",
        btnClass
      )}
      childrenClass={cx("text-white text-lg font-bold")}
      children={children}
      onClick={disabled ? () => {} : onClick}
    />
  );
};

export default WalletBtn;
