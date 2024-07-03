import { Input } from "apps/gambling/src/app/ui/components-bs/Inputs/Input";
import cx from "apps/gambling/src/app/ui/utils/cx";
import { ReactNode } from "react";

interface WalletWithdrawInputUnitProps {
  label: string;
  value: string | number,
  validation: boolean | undefined,
  onChange: <T>(arg?: T) => void;
  prefix?: ReactNode;
  errorMessage?: string | undefined;
  placeholder?: string;
  inputSectionClassName?: string;
  titleClassName?: string;
  metaInputClassName?: string;
  errorMessageClassName?: string;
}

export const WalletWithdrawInputUnit = ({
  label,
  value,
  validation,
  onChange,
  prefix = '',
  errorMessage = '',
  placeholder = '',
  inputSectionClassName = '',
  titleClassName = '',
  metaInputClassName = '',
  errorMessageClassName = '',
}: WalletWithdrawInputUnitProps) => {
  return (
    <section className={cx(
      'mb-3',
      inputSectionClassName
    )}>
        <label className={cx(
          'text-white text-base leading-6 block mb-1',
          titleClassName
        )}>
          {label}
        </label>

        <Input
          themeStyle={'normal'}
          className={cx(
            'w-full',
            'bg-[var(--grayscale-20)]',
            'border-[1.5px] border-[var(--grayscale-50)]',
            'py-[10px] px-4 tablet:py-3',
            metaInputClassName
          )}
          inputClassName={cx(
            'text-sm tablet:text-base',
            'leading-5 tablet:leading-6',
            'placeholder:text-[var(--grayscale-90)] text-[var(--grayscale-100)]'
          )}
          prefix={prefix}
          placeholder={placeholder}
          value={value}
          validation={validation}
          errorMessage={errorMessage}
          pureContainer={true}
          onChange={onChange}
          errorClassName={cx('border-[var(--state-error-main)]')}
          errorMessageClassName={cx('text-[var(--state-error-main)]', errorMessageClassName)}
        />
      </section>
  )
}

export default WalletWithdrawInputUnit;