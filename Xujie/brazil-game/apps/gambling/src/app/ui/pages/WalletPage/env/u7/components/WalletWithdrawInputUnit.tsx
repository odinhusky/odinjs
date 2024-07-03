import { Input } from "apps/gambling/src/app/ui/components-bs/Inputs/Input";
import cx from "apps/gambling/src/app/ui/utils/cx";
import { formatLocaleMoney } from "apps/gambling/src/app/ui/utils/format";
import t from "apps/gambling/src/assets/constant/lang";
import { ReactNode } from "react";

interface WalletWithdrawInputUnitProps {
  label: string;
  value: string | number;
  validation: boolean | undefined;
  onChange: <T>(arg?: T) => void;
  prefix?: ReactNode;
  errorMessage?: string | undefined;
  placeholder?: string;
  inputSectionClassName?: string;
  titleClassName?: string;
  metaInputClassName?: string;
  errorMessageClassName?: string;
  vip_level?: number;
  withdrawLimitMin?: number;
  withdrawLimitMax?: number;
}

export const WalletWithdrawInputUnit = ({
  label,
  value,
  validation,
  onChange,
  prefix = "",
  errorMessage = "",
  placeholder = "",
  inputSectionClassName = "",
  titleClassName = "",
  metaInputClassName = "",
  errorMessageClassName = "",
  vip_level = -1,
  withdrawLimitMin = 0,
  withdrawLimitMax = 0,
}: WalletWithdrawInputUnitProps) => {
  return (
    <section className={cx("mb-3", inputSectionClassName)}>
      <label
        className={cx(
          "text-white text-base leading-6 block mb-1",
          titleClassName
        )}
      >
        {label}
      </label>

      <div className="relative">
        <div
          className={cx(
            "absolute w-full h-12 border-popup-button pointer-events-none",
            {
              "before:border-[var(--state-error-main)]": validation === false,
            }
          )}
        />
        <Input
          themeStyle={"normal"}
          className={cx(
            "linear-4-input border-none rounded-full px-5 py-3 h-12",
            metaInputClassName
          )}
          inputClassName={cx(
            "text-sm tablet:text-base",
            "leading-5 tablet:leading-6",
            "placeholder:text-[var(--grayscale-70)] text-[var(--grayscale-100)]"
          )}
          prefix={prefix}
          placeholder={placeholder}
          value={value}
          validation={validation}
          errorMessage={errorMessage}
          pureContainer={true}
          onChange={onChange}
          errorClassName={cx("border-[var(--state-error-main)]")}
          errorMessageClassName={cx(
            "text-[var(--state-error-main)]",
            errorMessageClassName
          )}
          inputOuterClassName={"h-full"}
        />
      </div>
      {vip_level >= 0 && (
        <div>
          {t["walletDeopsitVIPTips"](
            vip_level,
            formatLocaleMoney(withdrawLimitMin),
            formatLocaleMoney(withdrawLimitMax)
          )}
        </div>
      )}
    </section>
  );
};

export default WalletWithdrawInputUnit;
