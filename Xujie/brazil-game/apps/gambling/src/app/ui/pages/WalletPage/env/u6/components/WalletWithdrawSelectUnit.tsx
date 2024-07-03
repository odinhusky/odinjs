import cx from "apps/gambling/src/app/ui/utils/cx";
import Select from 'react-select';
import { selectInputStyleProps } from "../styles/selectInputStyleProps";
import { ReactNode } from "react";

type ISelectOption = {
  value: string;
  label: string;
};

interface WalletWithdrawSelectUnitProps {
  label: ReactNode;
  value: ISelectOption;
  options: ISelectOption[];
  onChange: (item: any) => void;
  inputSectionClassName?: string;
  titleClassName?: string;
  className?: string;
}

export const WalletWithdrawSelectUnit = ({
  label,
  value,
  options,
  onChange,
  inputSectionClassName = '',
  titleClassName = '',
  className = '',
}: WalletWithdrawSelectUnitProps) => {
  return (
    <section className={cx('mb-3', inputSectionClassName)}>
      <label className={cx('text-white text-base leading-6 block mb-1', titleClassName)}>
        {label}
      </label>
      <Select
        menuPlacement={'bottom'}
        className={cx(
          'text-sm tablet:text-base',
          'leading-5 tablet:leading-6',
          className
        )}
        isSearchable={false}
        styles={selectInputStyleProps()}
        value={value}
        onChange={onChange}
        options={options}
      />
    </section>
  )
}

export default WalletWithdrawSelectUnit;