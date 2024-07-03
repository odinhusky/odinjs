import { SearchOutlined } from "@ant-design/icons";
import { IInput, Input as DesktopInput } from "../../Input";
import cx from "../../../../utils/cx";
import { FLEX_CENTER } from "apps/gambling/src/assets/constant/style";
export const SearchInput = (props: IInput) => {
  return (
    <DesktopInput
      pureContainer={true}
      className={cx(
        'px-5 py-2 lg:px-5 lg:py-3',
        'text-base',
        'rounded-[100px]',
        'bg-[var(--grayscale-30)]',
        'drop-shadow-md',
        'border-transparent'
      )}
      inputClassName={cx(
        'text-sm md:text-base lg:text-xl',
        'text-white',
        'placeholder:text-[var(--grayscale-70)]'
      )}
      suffix={
        <SearchOutlined
          className={cx(
            'text-[var(--grayscale-100)]',
            'text-lg md:text-2xl lg:text-[28px]',
            'mr-2',
            FLEX_CENTER
          )} 
        />
      }
      {...props}
    />
  )
}
 