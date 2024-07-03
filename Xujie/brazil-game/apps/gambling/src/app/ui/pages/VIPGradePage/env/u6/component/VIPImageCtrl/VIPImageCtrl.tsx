import cx from "apps/gambling/src/app/ui/utils/cx";
import { environment } from "apps/gambling/src/environments/environment";

interface VIPImageCtrlProps {
  direction: string;
  disabled: boolean;
  handleChangeLevel: (value: -1 | 1) => void;
  arrowPadding?: number | undefined;
}

export const VIPImageCtrl = ({
  direction,
  disabled,
  arrowPadding,
  handleChangeLevel,
}: VIPImageCtrlProps) => {

  return (
    <img
      className={cx(
        'absolute top-1/2 -translate-y-1/2',
        'w-6 h-6',
        'cursor-pointer',
        {
          'opacity-50 cursor-default': disabled
        }
      )}
      style={{
        [direction]: 
          arrowPadding 
            ? `${-arrowPadding}px` 
            : '0px'
      }}
      alt={direction}
      src={`assets/${environment.uVersion}/${environment.mVersion}/icon_vip_${direction}_arrow.png`}
      onClick={()=> {
        if(!disabled) handleChangeLevel(direction === 'left' ? -1 : 1)
      }}
    />
  )
}

export default VIPImageCtrl;