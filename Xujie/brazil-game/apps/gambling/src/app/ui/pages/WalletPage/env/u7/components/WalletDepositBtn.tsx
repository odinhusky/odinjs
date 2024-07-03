import cx from "apps/gambling/src/app/ui/utils/cx";
import t from "apps/gambling/src/assets/constant/lang";
import { useState } from "react";
import BaseBadge from "apps/gambling/src/app/ui/components-bs/Badge/BaseBadge";
import { FLEX_CENTER } from "apps/gambling/src/assets/constant/style";
import { formatLocaleMoney } from "apps/gambling/src/app/ui/utils/format";

interface WalletDepositBtnProps {
  isSelected: boolean;
  onClick: () => void;
  rechargeValue: number;
  rate: string;
  isShowRate: boolean;
}

export const WalletDepositBtn = ({
  isSelected,
  onClick,
  rechargeValue,
  rate,
  isShowRate,
}: WalletDepositBtnProps) => {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <button
      className={cx(
        FLEX_CENTER,
        "bg-amount-main flex-col",
        "rounded-lg font-medium",
        "min-h-[72px] p-3",
        "shadow-[0px_-4px_4px_#00000040_inset,0px_4px_4px_#FFFFFF40_inset,0px_4px_4px_#00000040]",
        {
          "bg-amount-focus shadow-[0px_0px_8px_#FBD81FCC]": isSelected,
          "bg-amount-hover shadow-none":!isSelected && (hover || active),
        }
      )}
      onMouseOver={() => {
        setHover(true);
      }}
      onMouseOut={() => {
        setHover(false);
      }}
      onMouseDown={() => {
        setActive(true);
      }}
      onMouseUp={() => {
        setActive(false);
      }}
      onTouchStart={() => {
        setActive(true);
      }}
      onTouchEnd={() => {
        setActive(false);
      }}
      onClick={onClick}
    >
      <div
        className={cx("text-[var(--grayscale-100)] mobile:text-2xl text-sm", {
          "mobile:text-2xl text-sm text-[var(--text-amount)] font-bold":
            isSelected,
          "text-[var(--grayscale-100)]": !isSelected && (hover || active),
        })}
      >
        {t["moneyWithRSign"](formatLocaleMoney(rechargeValue))}
      </div>
      {isShowRate && (
        <BaseBadge
          className={cx(
            "text-[var(--grayscale-100)] text-important tablet:text-base mobile:text-lg text-xs bg-[#ffffff00]",
            {
              "tablet:text-base mobile:text-lg text-xs text-[var(--text-amount)] font-bold":
                isSelected,
              "text-[var(--grayscale-100)]": !isSelected && (hover || active),
            }
          )}
          text={"+" + t["moneyWithRSign"](rate)}
        />
      )}
    </button>
  );
};

export default WalletDepositBtn;
