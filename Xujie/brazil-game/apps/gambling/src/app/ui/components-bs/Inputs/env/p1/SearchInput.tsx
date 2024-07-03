import { SearchOutlined } from "@ant-design/icons";
import { IInput, Input as DesktopInput } from "../../Input";
import { environment } from "../../../../../../environments/environment";

export const SearchInput = (props: IInput) => {
  return (
    <DesktopInput
      className={"py-1.5 px-3 text-base !border-[var(--primary-assistant)]"}
      inputClassName={"text-base  placeholder:text-[var(--white-30)]"}
      prefix={<img className='w-[18px] h-[18px] mr-2' alt='search' src={`assets/${environment.uVersion}/icon_search_modal_search.png`}/>}
      {...props}
    />
  )
}
