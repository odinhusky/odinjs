import {CacheImage} from "../../../../../components/image/CacheImage";
import {environment} from "../../../../../../../environments/environment";
import {useState} from "react";
import {formatLocaleMoney} from "../../../../../utils/format";

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
              className='bg-[var(--background-modal)] border border-[var(--outline-secondary)] rounded-2xl text-center font-bold
                px-5 py-4 w-4/5
                mobile:px-10 mobile:py-6 mobile:w-[300px]
              '
              onClick={e => e.stopPropagation()}
            >
              <div className='text-sm mobile:text-xl italic'>Parabéns por ganhar o</div>
              <div className='text-xl mobile:text-2xl mt-2 italic'>R$ {formatLocaleMoney(rewardAmount)}</div>
              <button
                className='w-full mt-3 py-3 bg-gradient-to-b from-[var(--btn-gradient1-from)] to-[var(--btn-gradient1-to)] rounded-lg text-[var(--text-button)]'
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
      <CacheImage
        className='cursor-pointer absolute top-1/2 -translate-y-1/2  left-1/2 -translate-x-1/2 w-2/3'
        alt='button'
        src={`assets/${environment.uVersion}/${environment.mVersion}/box_claim_button.png`}
        onClick={() => setModalOpen(true)}
      />
    </>
  )
}