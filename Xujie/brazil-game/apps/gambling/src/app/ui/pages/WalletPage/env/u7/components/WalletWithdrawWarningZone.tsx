import cx from "apps/gambling/src/app/ui/utils/cx";
import { FLEX_CENTER } from "apps/gambling/src/assets/constant/style";
import { environment } from "apps/gambling/src/environments/environment";
import t from "apps/gambling/src/assets/constant/lang";

interface WalletWithdrawWarningZoneProps {}

export const WalletWithdrawWarningZone =
  ({}: WalletWithdrawWarningZoneProps) => {
    return (
      <div
        className={cx(
          "bg-linear-4-main border-popup-button before:rounded-lg rounded-lg py-3 px-5"
        )}
      >
        <span
          className={cx(
            "text-sm text-[var(--state-warn-main)] font-normal"
          )}
        >
          {t["withdrawWarning"]}
        </span>
      </div>
    );
  };

export default WalletWithdrawWarningZone;
