import { ILeaveGameConfirmModalProps } from "../../index";
import { CheckBox } from "../../../../components/CheckBox";
import { useState } from "react";
import { CloseICON } from "../../../../components-bs/env/u5/CloseICON";
import { twMerge } from "tailwind-merge";

export const LeaveGameConfirmModal = ({
  onConfirm,
  onClose
}: ILeaveGameConfirmModalProps) => {
  const [addFavorite, setAddFavorite] = useState(false)

  return (
    <div className={"z-[1005] bg-[rgba(0,0,0,.6)] fixed left-0 top-0 right-0 bottom-0 flex flex-col justify-center items-center w-full h-full"}
    >
      <div className='w-[320px] md:w-[400px] lg:w-[424px] absolute box-border px-5 md:px-8 lg:px-8 pt-8 text-center rounded-[20px] text-white bg-linear-4-main'>
        <div className={"flex justify-end w-full absolute top-[-8px] right-[-8px]"}>
          <CloseICON className={twMerge(
            "linear-4-button",
          )} onClick={onClose} />
        </div>
        <div className="text-lg font-extrabold">Deixar</div>
        <div className='text-sm lg:text-base font-bold py-3 md:pt-5 lg:pt-8'>Tem certeza de que deseja sair do jogo atual?</div>
        <div className='mb-3 md:mb-5 lg:mb-8 pl-3 md:pl-5 lg:pl-5 box-border h-12 text-left rounded-lg flex items-center bg-[var(--transparente-20)]'>
          <CheckBox className='w-6 h-6' checked={addFavorite} onClick={() => setAddFavorite(!addFavorite)} />
          <div className="text-sm lg:text-base font-bold pl-3 box-border">Adicione este jogo aos favoritos</div>
        </div>

        <div className='w-full flex justify-between mb-3 md:mb-8 lg:mb-8'>
          <button
            className='state-info-button w-full text-sm lg:text-base rounded-[100px] py-[10px] box-border mr-5 font-extrabold'
            onClick={onClose}
          >
            Concelar
          </button>
          <button
            className='state-success-button w-full text-sm lg:text-base rounded-[100px] py-[10px] box-border font-extrabold'
            onClick={() => onConfirm(addFavorite)}
          >
            Confirme
          </button>
        </div>
      </div>
    </div>
  )
}
