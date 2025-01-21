import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER, X_CENTER } from '@libs/constant/style';

interface AnchorListProps {
  percent: number;
  sizeRem: number;
  totalAnchorList: number[]; // 0~100 的數字
  unAchieveAnchorClass?: string;
  achieveAnchorClass?: string;
}
export const AnchorList = ({
  percent,
  sizeRem,
  totalAnchorList,
  unAchieveAnchorClass = 'bgi-[var(--base-1-main)] bgi-border-[var(--linear-2)]',
  achieveAnchorClass = 'bgi-[var(--grayscale-100)] bgi-border-[var(--base-2-main)]',
}: AnchorListProps) => {
  return (
    <div
      className={cx('w-full', FLEX_ITEMS_CENTER, 'absolute top-0 left-0 z-[1]')}
      style={{
        height: `${sizeRem}rem`,
      }}
    >
      {totalAnchorList.map((percentPoint, index, arr) => (
        <div
          key={`anchor - order - ${index}`}
          className={cx(
            'rounded-full after-rounded-full',
            '!absolute top-0 z-[1]',
            'duration-500',
            'transition-[all]',
            'ease-[cubic-bezier(0.25, 0.1, 0.25, 1)]',
            X_CENTER,
            'border',
            {
              [unAchieveAnchorClass]: percent < percentPoint,
              [achieveAnchorClass]: percent >= percentPoint,
              'translate-x-[0]': index === 0 || index === arr.length - 1,
              '-translate-x-[100%]': index === arr.length - 1,
            }
          )}
          style={{
            width: `${sizeRem}rem`,
            height: `${sizeRem}rem`,
            left: `${percentPoint}%`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default AnchorList;
