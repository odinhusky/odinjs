import React, {useEffect, useRef} from "react";
import {twMerge} from "tailwind-merge";
import {useScrollSelectFixCenter} from "../../../../../../hooks/useScrollSelectFixCenter";
import {environment} from "../../../../../../../../environments/environment";

const vips: number[] = [];

for (let i = 1; i <= 25; i += 1) {
  vips.push(i);
}

interface VIPButtonListProps {
  selectedVIP: number
  setSelectedVIP: React.Dispatch<React.SetStateAction<number>>
  currentVIP: number
  className?: string
  buttonClassName: string
  onSelectedClassName: string
}

export const VIPButtonList = ({
  selectedVIP,
  setSelectedVIP,
  currentVIP,
  className,
  buttonClassName,
  onSelectedClassName
}:VIPButtonListProps) => {

  const { scrollWrapperRef } = useScrollSelectFixCenter(selectedVIP - 1, false)

  return (
    <div
      className={twMerge('w-full overflow-x-scroll vip-tab-items flex items-center relative', className)}
      ref={scrollWrapperRef}
    >
      {
        vips.map((vip) => {
          const backgroundColor = currentVIP === vip ? 'bg-linear-5-main hover' : vip > currentVIP ? 'bg-[var(--grayscale-30)] hover:bg-[var(--grayscale-50)]' : 'bg-linear-5-disabled';

          return (
            <div
              key={vip}
              className={twMerge(
                backgroundColor,
                'flex-shrink-0 text-white rounded-lg text-center flex justify-center items-center gap-3 font-extrabold',
                buttonClassName,
                vip === selectedVIP && onSelectedClassName,
                vip > currentVIP && 'text-[var(--grayscale-70)]',
                vip < currentVIP ? 'cursor-not-allowed' : 'cursor-pointer'
              )}
              onClick={() => {
                if(!(vip < currentVIP)){
                  setSelectedVIP(vip)
                }
              }}
            >
              {vip === currentVIP && <img alt='lockOpen' src={`assets/${environment.uVersion}/icon_lock_open.png`} className='w-[18px]'/>}
              {vip > currentVIP && <img alt='lockOpen' src={`assets/${environment.uVersion}/icon_lock_close.png`} className='w-[15px]'/>}
              <div>VIP{vip}</div>
            </div>
          )
        })
      }
    </div>
  )
}