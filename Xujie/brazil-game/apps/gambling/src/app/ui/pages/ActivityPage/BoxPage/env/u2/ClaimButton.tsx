import {formatLocaleMoney} from "../../../../../utils/format";
import {useState} from "react";
import {environment} from "../../../../../../../environments/environment";
import {CacheImage} from "../../../../../components/image/CacheImage";


interface ClaimButtonProps {
  rewardAmount: number;
  onConfirm: () => void
}


export const ClaimButton = ({
  rewardAmount,
  onConfirm
}: ClaimButtonProps) => {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      {
        modalOpen && (
          <div
            className='fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center z-[1005] bg-[rgba(0,0,0,0.5)]'
            onClick={() => setModalOpen(false)}
          >
            <div
              className='relative bg-[var(--grayscale-20)] rounded-2xl text-center text-xl
                w-4/5 px-6 pb-8 pt-[60px]
                mobile:w-fit
              '
              onClick={e => e.stopPropagation()}
            >
              <CacheImage
                alt='close'
                className='cursor-pointer w-10 absolute top-3 right-3'
                src={`assets/${environment.uVersion}/icon=close-outlined.png`}
                onClick={() => setModalOpen(false)}
              />
              <div
                className='font-medium'
              >
                Parabéns por ganhar o
              </div>

              <div className='mt-4'>
                R$ {formatLocaleMoney(rewardAmount)}
              </div>

              <button
                className='w-full mt-4 bg-[#33ABE0] rounded-lg shadow-[inset_0px_-4px_4px_0px_rgba(0,0,0,0.25),inset_0px_4px_4px_0px_rgba(255,255,255,0.25)]
                  py-[10px]
                  mobile:py-3
                  tablet:py-[14px]
                '
                onClick={() => {
                  setModalOpen(false)
                  onConfirm()
                }}
              >
                Claro
              </button>
            </div>
          </div>
        )
      }
      <button
        className='rounded-lg font-bold bg-gradient-to-br from-[var(--liner-main-from)] to-[var(--liner-main-to)] shadow-[inset_0px_-4px_4px_0px_rgba(0,0,0,0.25),inset_0px_4px_4px_0px_rgba(255,255,255,0.25)] w-4/5
          py-[10px] px-3 text-sm
          mobile:px-5
          tablet:py-3 tablet:text-lg
        '
        onClick={()=>setModalOpen(true)}
      >
        R$ {formatLocaleMoney(rewardAmount)}
      </button>
    </>
  )
}