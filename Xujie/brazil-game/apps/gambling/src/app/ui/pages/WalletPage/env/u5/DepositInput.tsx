import { IDepositInput } from "../../components/deposit/DepositInput";
import { MobileInput } from "../../../../components-bs/Inputs/MobileInput";
import React from "react";


export const DepositInput = ({
  inputValue,
  onChange,
  isShowInputTag,
  extraDepositBonus
}: IDepositInput) => {
  return (
    <div className='relative'>
      <MobileInput
        className='hover:text-white'
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === '.' || e.key === 'e' || e.key === '-') {
            e.preventDefault();
          }
        }}
        type={"number"}
        placeholder={'Por favor insira o valor que deseja recarregar'}
        inputClassName='placeholder:text-[var(--grayscale-60)]'
        errorMessageClassName='text-[var(--state-error-main)]'
        value={inputValue?.data}
        onChange={onChange}
        validation={inputValue?.isValidation}
        errorMessage={inputValue?.errorMessage}
      />
      {
        isShowInputTag && (
          <div className='absolute top-0 right-2 bottom-0 h-full text-base font-bold flex flex-col justify-center text-[var(--state-warn-main)]'>
            <div>
              R${extraDepositBonus}
            </div>
          </div>
        )
      }
    </div>
  )
}
