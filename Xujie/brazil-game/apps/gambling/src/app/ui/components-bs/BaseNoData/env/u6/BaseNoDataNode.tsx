import cx from "apps/gambling/src/app/ui/utils/cx";
import t from "apps/gambling/src/assets/constant/lang";
import { environment } from "apps/gambling/src/environments/environment";

interface BaseNoDataProps {
  className?: string;
}

export const BaseNoDataNode = ({
  className
}: BaseNoDataProps) => {
  return (
    <div className={cx(
      'flex flex-col items-center gap-3',
      className
    )}>
      <img
        className={cx(
          'w-[100px] mobile:w-[133px] tablet:w-[166px]'
        )}
        alt='noData'
        src={`assets/${environment.uVersion}/noData.png`}
      />

      <div className={cx(
        'text-[var(--grayscale-60)] font-medium w-full text-center',
        'text-xs mobile:text-base tablet:text-2xl',
        'leading-4 mobile:leading-6 tablet:leading-7'
      )}
      >
        {t['noData']}
      </div>
    </div>
  )
}

export default BaseNoDataNode;