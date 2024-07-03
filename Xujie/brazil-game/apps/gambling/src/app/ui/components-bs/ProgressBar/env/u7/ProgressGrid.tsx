import cx from "apps/gambling/src/app/ui/utils/cx";

interface ProgressGridProps {
  progress: number;
  gridNum: number;
  times: number; //倍数，默认2倍，对格子个数的的两倍
  barClassName?: string;
  progressBgColor?: string;
  progressColor?: string;
}

export const ProgressGrid = ({
  times, //倍数
  gridNum, //总格子数
  progress, //进度值
  barClassName, //进度条容器样式
  progressBgColor, //进度条背景样式
  progressColor, //进度条样式
}: ProgressGridProps) => {
  const filledCells = Math.round(progress / times); // 填充的格子数，这里假设进度是progress%，一个格占多少
  return (
    <div 
      className={cx(
        'flex flex-nowrap gap-[2px]',
        'w-full',
        barClassName
      )}
    >
      {
        Array.from({ length: gridNum }, (_, index) => (
          <div
            key={index}
            className={cx(
              'h-5',
              'bg-[var(--transparent-white-20)]',
              'rounded-[1px]',
              'flex-[1_0_1%]',
              'shadow-[0px_2px_4px_#00000040_inset]',
              progressBgColor,
              index < filledCells 
                ? progressColor 
                : '',
            )}
          ></div>
        ))
      }
    </div>
  );
};

export default ProgressGrid;