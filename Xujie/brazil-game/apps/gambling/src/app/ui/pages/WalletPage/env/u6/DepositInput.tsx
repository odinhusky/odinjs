import { IDepositInput } from "../../components/deposit/DepositInput";
import { Input } from "../../../../components-bs/Inputs/Input";
import t from "apps/gambling/src/assets/constant/lang";
import cx from "../../../../utils/cx";
import BaseBadge from "../../../../components-bs/Badge/BaseBadge";

export const DepositInput = ({
  inputValue,
  onChange,
  isShowInputTag,
  extraDepositBonus
}: IDepositInput) => {
  return (
    <div className={cx(
      'flex items-center',
      'relative',
      'w-full min-w-[40px]',
      'bg-[var(--grayscale-20)]',
      'rounded-lg',
      'px-4 py-2',
      'mb-[32px] mobile:mb-[36px] tablet:mb-[48px]',
      'border-[1.5px] border-[transparent]',
      {
        'border-[var(--state-error-main)]': inputValue?.errorMessage
      }
    )}>
      <Input
        className={cx(
          'px-0'
        )}
        pureContainer={true}
        inputOuterClassName={cx(
          'flex-1'
        )}
        inputClassName={cx(
          'placeholder:text-[var(--grayscale-60)]',
          'placeholder:text-sm mobile:placeholder:text-base',
          'text-base leading-6'
        )}
        errorMessageClassName={cx(
          'text-[var(--state-error-main)]',
          'p-0',
          'text-sm leading-5',
          'absolute -bottom-[24px] left-0'
        )}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === '.' || e.key === 'e' || e.key === '-') {
            e.preventDefault();
          }
        }}
        type={"number"}
        placeholder={t['walletDeopsitInputPlaceholder']}
        value={inputValue?.data}
        onChange={onChange}
        validation={inputValue?.isValidation}
        errorMessage={inputValue?.errorMessage}
      />

      {
        isShowInputTag && (
          <BaseBadge
            className={cx(
              'h-full',
              'bg-[var(--transparente-20)]'
            )}
            text={`+${t['moneyWithRSign'](extraDepositBonus || 0)}`}
          />
        )
      }
    </div>
  )
}
