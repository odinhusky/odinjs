import { PERCENT_DENOMINATOR, PROGRESS_GRID_NUM_ARRAY } from "apps/gambling/src/assets/constant/math";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import cx from "../../../../utils/cx";
import ProgressGrid from "./ProgressGrid";

interface IProgressBarProps {
  progress: number;
  isDirect?: boolean;
  progressClassName?: string;
  className?: string;
  percentClassName?: string;
  progressColor?: string;
  gridNum?: number;
  barClassName?: string;
  progressBgColor?: string;
}

export const ProgressBar = ({
  progress,
  isDirect = false,
  progressClassName,
  className,
  percentClassName,
  progressColor,
  barClassName,
  gridNum,
  progressBgColor,
}: IProgressBarProps) => {
  const { isMobile } = useBreakpoint();
  const curProgress = progress > 1 ? 100 : progress * 100;
  
  const handledGridNum = gridNum 
    ? gridNum 
    : isMobile 
      ? PROGRESS_GRID_NUM_ARRAY[2] 
      : PROGRESS_GRID_NUM_ARRAY[4];
  
  const handledTimes = Math.floor(PERCENT_DENOMINATOR / handledGridNum);

  return (
    <div
      className={cx(
        'flex items-center gap-3',
        'w-full',
        'shadow-[0px_4px_4px_#00000040]',
        'rounded-lg',
        'bg-[var(--transparent-white-10)]',
        'px-3 py-2',
        className
      )}
    >
      <div className={cx("w-full", progressClassName)}>
        <ProgressGrid
          times={handledTimes}
          gridNum={handledGridNum}
          progress={curProgress}
          barClassName={barClassName}
          progressBgColor={progressBgColor}
          progressColor={progressColor}
        />
      </div>

      <div
        className={cx(
          'w-[65px]',
          'text-[var(--grayscale-100)] text-left font-bold',
          'mobile:text-sm tablet:text-base',
          percentClassName
        )}
      >
        {curProgress.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })}
        %
      </div>
    </div>
  );
};
