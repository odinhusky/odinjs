import {BoxInfoStep} from "../../../../../../external/endpoint/activity/box/GetBoxInfoEndpoint";
import {formatLocaleMoney} from "../../../../../utils/format";
import {environment} from "../../../../../../../environments/environment";
import {CacheImage} from "../../../../../components/image/CacheImage";
import {useState} from "react";

interface CenterStepCardProps {
  step?: BoxInfoStep;
  onClickToClaim: () => void;
}


export const CenterStepCard = ({
  step,
  onClickToClaim
}: CenterStepCardProps) => {

  return (
    <div
      className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 bg-[var(--grayscale-40)] rounded-xl flex flex-col gap-2 text-center shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]
        w-1/2 px-4 py-3
        mobile:w-1/4
      '
    >
      <div
        className='font-extrabold
         text-lg
         tablet:text-2xl
        '
      >
        {step?.inviteNum} pessoas
      </div>
      <div
        className='font-extrabold text-[var(--grayscale-80)]
          text-base
          tablet:text-lg
        '
      >
        R$ {formatLocaleMoney(step?.rewardAmount || 0)}
      </div>
      <CacheImage
        alt='box'
        className='w-full'
        src={`assets/${environment.uVersion}/${environment.mVersion}/ic_box_${step?.icon}_${step?.status.toLowerCase()}.png`}
      />
      {
        step?.status === 'UNCLAIMED' && (
          <button
            className='linear-5-button font-medium rounded-full text-sm py-2'
            onClick={onClickToClaim}
          >
            Receber
          </button>
        )
      }
    </div>
  )
}