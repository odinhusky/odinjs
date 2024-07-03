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
    <span className={cx(
      'flex flex-col items-center gap-2 m-auto',
      className
    )}>
      <img
        className={
          cx(
          'w-[120px] mobile:w-[200px]'
        )}
        alt='noData'
        src={`assets/${environment.uVersion}/noData.png`}
      />
      <span className={
        cx(
          'text-[var(--grayscale-100)] text-base mobile:text-lg font-bold text-center',
        )}
      >
        {t['noData']}
      </span>
    </span>
  )
}

export default BaseNoDataNode;