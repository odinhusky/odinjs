import { IDepositInput } from "../../components/deposit/DepositInput";
import { Input } from "../../../../components-bs/Inputs/Input";
import t from "apps/gambling/src/assets/constant/lang";
import cx from "../../../../utils/cx";
import BaseBadge from "../../../../components-bs/Badge/BaseBadge";

export const DepositInput = ({
  inputValue,
  onChange,
  isShowInputTag,
  extraDepositBonus,
}: IDepositInput) => {  
  return (
    <div
      className={cx("relative")}
    >
      <div className="absolute w-full h-full border-popup-button before:rounded-lg before:border-[1.5px] pointer-events-none" />
      <Input
        className={cx("bg-linear-4-main border-none rounded-lg px-5 h-full")}
        pureContainer={true}
        inputOuterClassName={cx("flex-1 h-12")}
        inputClassName={cx(
          "placeholder:text-[var(--grayscale-60)]",
          "placeholder:text-sm mobile:placeholder:text-base",
          "text-base leading-6"
        )}
        errorMessageClassName={cx(
          "text-[var(--state-error-main)]",
          "p-0",
          "text-sm leading-5",
          "absolute -bottom-[24px] left-0"
        )}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "." || e.key === "e" || e.key === "-") {
            e.preventDefault();
          }
        }}
        type={"number"}
        placeholder={t["walletDeopsitInputPlaceholder"]}
        value={inputValue?.data}
        onChange={onChange}
        validation={inputValue?.isValidation}
        errorMessage={inputValue?.errorMessage}
      />
      {isShowInputTag && (
        <BaseBadge
          className={cx(
            "bg-amount-focus absolute text-sm text-[var(--text-amount)] top-0 right-0 h-1/2 font-medium rounded-none rounded-tr-lg rounded-bl-lg"
          )}
          text={`+${t["moneyWithRSign"](extraDepositBonus || 0)}`}
        />
      )}
    </div>
  );
};
