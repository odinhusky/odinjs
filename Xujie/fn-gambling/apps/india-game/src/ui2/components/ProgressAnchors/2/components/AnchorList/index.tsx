import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER, X_CENTER } from '@libs/constant/style';

interface AnchorListProps {
  percent: number;
  sizeRem: number;
  totalAnchorList: number[]; // 0~100 的數字
  unAchieveAnchorClass?: string;
  achieveAnchorClass?: string;
  firstAnchorClass?: string;
  lastAnchorClass?: string;
  className?: string;
  otherAnchorClass?: string;
  customAnchorNode?: (isAchieve: boolean) => React.ReactNode;
  isShowZeroAnchor?: boolean;
}

export const AnchorList = ({
  percent,
  sizeRem,
  totalAnchorList,
  unAchieveAnchorClass = 'bgi-[var(--base-1-main)] bgi-border-[var(--linear-2)]',
  achieveAnchorClass = 'bgi-[var(--grayscale-100)] bgi-border-[var(--base-2-main)]',
  firstAnchorClass,
  lastAnchorClass,
  className,
  otherAnchorClass,
  customAnchorNode,
  isShowZeroAnchor = true,
}: AnchorListProps) => {
  return (
    <div
      className={cx('w-full', FLEX_ITEMS_CENTER, 'absolute top-0 left-0 z-[1]')}
      style={{
        height: `${sizeRem}rem`,
      }}
    >
      {totalAnchorList.map((percentPoint, index, arr) => {
        if (!isShowZeroAnchor && index === 0) return null;
        return customAnchorNode ? (
          <div
            key={`anchor - order - ${index}`}
            className={cx(
              '!absolute top-0 z-[1]',
              'duration-500',
              'transition-[all]',
              'ease-[cubic-bezier(0.25, 0.1, 0.25, 1)]',
              X_CENTER,
              otherAnchorClass,
              {
                [`translate-x-[0] ${firstAnchorClass}`]:
                  index === 0 || index === arr.length - 1,
                [`-translate-x-[100%] ${lastAnchorClass}`]:
                  index === arr.length - 1,
                [unAchieveAnchorClass]: percent < percentPoint,
                [achieveAnchorClass]: percent >= percentPoint,
              },
              className
            )}
            style={{
              left: `${percentPoint}%`,
            }}
          >
            {customAnchorNode(percent >= percentPoint)}
          </div>
        ) : (
          <div
            key={`anchor - order - ${index}`}
            className={cx(
              '!absolute top-0 z-[1]',
              'duration-500',
              'transition-[all]',
              'ease-[cubic-bezier(0.25, 0.1, 0.25, 1)]',
              X_CENTER,
              {
                'translate-x-[0]': index === 0 || index === arr.length - 1,
                '-translate-x-[100%]': index === arr.length - 1,
                [unAchieveAnchorClass]: percent < percentPoint,
                [achieveAnchorClass]: percent >= percentPoint,
              },
              'rounded-full after-rounded-full',
              'border',
              className
            )}
            style={{
              width: `${sizeRem}rem`,
              height: `${sizeRem}rem`,
              left: `${percentPoint}%`,
            }}
          ></div>
        );
      })}
    </div>
  );
};

export default AnchorList;
