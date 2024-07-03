import { ILeaveGameConfirmModalProps } from "../../index";
import { CheckBox } from "../../../../components/CheckBox";
import { useState } from "react";
import { CloseICON } from "../../../../components-bs/env/u5/CloseICON";
import { twMerge } from "tailwind-merge";
import { environment } from "apps/gambling/src/environments/environment";

export const LeaveGameConfirmModal = ({
  onConfirm,
  onClose
}: ILeaveGameConfirmModalProps) => {
  const [addFavorite, setAddFavorite] = useState(false)

  return (
    <div className={"z-[1005] bg-[var(--transparente-gray-60)] fixed left-0 top-0 right-0 bottom-0 flex flex-col justify-center items-center w-full h-full"}
    >
      <div className='
        w-[320px] mobile:w-[392px] tablet:w-[446px] px-3.5 py-[22px] mobile:px-[30px] mobile:py-[30px] tablet:px-[34px] tablet:py-[38px] rounded-xl
        absolute box-border text-center text-[var(--grayscale-100)] bg-linear-3-main border-2 border-[var(--grayscale-70)]'
      >

        <div className="
            absolute flex justify-center items-center right-[9px] top-[8px] mobile:right-3 mobile:top-3 rounded-full 
            w-[28px] h-[28px] mobile:w-9 mobile:h-9 tablet:w-[40px] tablet:h-[40px] linear-5-button"
          onClick={onClose}
        >
          <img src={`assets/${environment.uVersion}/icon_cross.png`} className="w-[21px] h-[21px] mobile:w-[27px] mobile:h-[27px] tablet:w-[30px] tablet:h-[30px]" alt="close" />
        </div>
        <div className="w-full space-y-4">
          <div className="text-base mobile:text-lg tablet:text-xl font-medium">Deixar</div>

          <div className="w-full space-y-2">
            <div className='text-sm mobile:text-base tablet:text-lg font-medium'>Tem certeza de que deseja sair do jogo atual?</div>
            <div className='
              w-full p-2 tablet:p-3 flex justify-center items-center space-x-2
              box-border rounded-lg bg-[var(--transparente-30)]'
            >
              <CheckBox className='w-6 h-6' checked={addFavorite} onClick={() => setAddFavorite(!addFavorite)} />
              <div className="text-sm box-border">Adicione este jogo aos favoritos</div>
            </div>
          </div>

          <div className='w-full flex justify-between space-x-2 text-sm tablet:text-base font-bold tablet:font-medium'>
            <button
              className='w-full h-9 tablet:h-12 rounded-lg linear-1-button'
              onClick={onClose}
            >
              Concelar
            </button>
            <button
              className='w-full h-9 tablet:h-12 rounded-lg linear-2-button'
              onClick={() => onConfirm(addFavorite)}
            >
              Confirme
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
