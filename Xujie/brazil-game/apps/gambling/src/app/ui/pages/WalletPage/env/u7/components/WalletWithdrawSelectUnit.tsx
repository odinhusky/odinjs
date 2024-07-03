import cx from "apps/gambling/src/app/ui/utils/cx";
import Select, { components } from "react-select";
import { selectInputStyleProps } from "../styles/selectInputStyleProps";
import { ReactNode } from "react";
import { environment } from "apps/gambling/src/environments/environment";

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
  menuIsOpen?: boolean;
  setMenuIsOpen?: any;
}

export const WalletWithdrawSelectUnit = ({
  label,
  value,
  options,
  onChange,
  inputSectionClassName = "",
  titleClassName = "",
  className = "",
  menuIsOpen = false,
  setMenuIsOpen,
}: WalletWithdrawSelectUnitProps) => {
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
      <Select
        menuPlacement={"bottom"}
        className={cx(
          "text-sm tablet:text-base",
          "leading-5 tablet:leading-6 p-[1.5px]",
          className
        )}
        isSearchable={false}
        styles={selectInputStyleProps(false, menuIsOpen)}
        value={value}
        onChange={onChange}
        options={options}
        onMenuOpen={() => {
          setMenuIsOpen && setMenuIsOpen(true);
        }}
        onMenuClose={() => {
          setMenuIsOpen && setMenuIsOpen(false);
        }}
        components={{ DropdownIndicator }}
      />
    </section>
  );
};

interface CustomDropdownIndicatorProps {
  // 这里可以根据需要添加更多的属性
}

const DropdownIndicator: React.FC<CustomDropdownIndicatorProps> = (props) => {
  return (
    <div className="flex justify-center items-center w-9 h-full">
      <img
      className="w-3 h-[6px]"
        src={`assets/${environment.uVersion}/icon_arrow3_down.png`}
        alt="arrow"
      />
    </div>
  );
};

export default WalletWithdrawSelectUnit;
