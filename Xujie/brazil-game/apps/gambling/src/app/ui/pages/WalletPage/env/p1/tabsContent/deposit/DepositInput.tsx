import cx from "classnames";
import { MobileInput } from "../../../../../../components-bs/Inputs/MobileInput";
import useBreakpoint from "../../../../../../pageTemplate/hooks/useBreakpoint";
import React from "react";
import { IDepositInput } from "../../../../components/deposit/DepositInput";


export const DepositInput = (props: IDepositInput) => {
  const { isMobile } = useBreakpoint();

  return (
    <div className={cx("relative")}>
      <MobileInput
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>)=>{
          if (e.key === '.' || e.key === 'e' || e.key === '-') {
            e.preventDefault();
          }
        }}
        type={"number"}
        className={cx('bg-white border-none',{ 'py-2.5 px-4': isMobile })}
        inputClassName={'text-[#9E9E9E]'}
        value={props.inputValue.data}
        onChange={props?.onChange}
        validation={props.inputValue.isValidation}
        errorMessage={props.inputValue.errorMessage}
      />
      {props.isShowInputTag &&
        (<div className={cx(`
          absolute top-0 right-0
          px-10 py-1
          m-[0px]
          text-xs md:text-xl text-[#047A70]
          bg-gradient-to-b from-[#C8F568] to-[#16FF8F]
          rounded-tr-[25px] rounded-br-[8px] rounded-bl-[8px] rounded-tl-none rounded-tb-none
        `)
        }>
          + R$ {props.extraDepositBonus}
        </div>)}
    </div>
  )
}
