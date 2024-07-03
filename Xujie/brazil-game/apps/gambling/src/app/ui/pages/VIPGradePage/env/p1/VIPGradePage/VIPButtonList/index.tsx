import {tcx} from "../../../../../../utils/tcx";
import {environment} from "../../../../../../../../environments/environment";
import useBreakpoint from "../../../../../../pageTemplate/hooks/useBreakpoint";
import {useEffect} from "react";

const vips: number[] = [];

for (let i = 0; i <= 25; i += 1) {
  vips.push(i);
}

interface IVIPButtonListProps {
  selectedVIP: number
  currentVIP: number
  onSelect: (vip: number) => void
}

export const VIPButtonList = ({
                                selectedVIP,
                                currentVIP,
                                onSelect
                              }: IVIPButtonListProps) => {
  const {isMobile} = useBreakpoint();


  return vips.map((vip) => {
    const isReachLevel = vip === currentVIP
    const vipIcon = isReachLevel
      ? `assets/${environment.uVersion}/icon_vip_box_open.png`
      : `assets/${environment.uVersion}/icon_vip_box_close.png`;

    const isSelectedLevel = vip === selectedVIP
    const currentBackgroundColor = isSelectedLevel
      ? 'bg-gradient-to-b from-[var(--btn-gradient-vip-from)] to-[var(--btn-gradient-vip-to)] border-[var(--main-secondary-main)]'
      : 'bg-gradient-to-b from-[var(--main)] to-[var(--main)] border-[var(--main-primary-main)]';
    const containerSize = isMobile
      ? 'w-[96px] h-[34px] rounded-md text-base'
      : 'w-[130px] h-[54px] rounded-xl text-2xl';

    return (
      <div
        key={vip}
        className={tcx(
          currentBackgroundColor,
          'border-[1px] gap-1 flex-shrink-0',
          `${containerSize} items-center`,
          'flex justify-center py-1 mb-4 p-1 mr-1',
          'cursor-pointer',
          'font-bold text-white text-center ',
          // ['p-1 text-base rounded-lg', isMobile]
        )
        }
        onClick={() => onSelect(vip)}
      >
        <img className="w-9 h-9 mr-1" alt="king" src={vipIcon}/>
        {/*{vip === (currentVIP === 25 ? currentVIP: currentVIP + 1) && <img alt='lockOpen' src={LockOpen} className='w-4 h-4' />}*/}
        {/*{vip > (currentVIP === 25 ? currentVIP: currentVIP + 1) && <img alt='lockOpen' src={Lock} className='w-4 h-4' />}*/}
        <div>VIP{vip}</div>
      </div>
    )
  })
}
