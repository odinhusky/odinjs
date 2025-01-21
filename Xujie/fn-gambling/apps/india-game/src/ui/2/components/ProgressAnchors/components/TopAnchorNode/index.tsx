import { AnchorObj } from '@components/ProgressAnchors';
import { cx } from '@libs/commonUtils';
import { FLEX_COL, FLEX_ITEMS_END } from '@libs/constant/style';

interface TopAnchorNodeProps<TopDataType> {
  top?: AnchorObj<TopDataType>;
  totalAnchorList: number[];
  percent: number;
}

export const TopAnchorNode = <TopDataType,>({
  top,
  totalAnchorList,
  percent,
}: TopAnchorNodeProps<TopDataType>) => {
  // handle error
  if (!top || !top?.dataList || !(top?.render instanceof Function)) return;

  if (top && (!top?.dataList || !(top?.render instanceof Function))) {
    console.error(
      '@@ TopAnchorNode data - {{top}} structure is missing a required property'
    );
    return;
  }

  return (
    <div className={cx('w-full', FLEX_ITEMS_END)}>
      {top.dataList.map((data, index, arr) => (
        <div key={`top-render-${index}`}>
          {/* 真正的資料 */}
          <div
            className={cx(
              FLEX_COL,
              'gap-[2px]',
              'absolute',
              'translate-x-[-50%]',
              {
                'translate-x-[0]': index === 0,
                'translate-x-[-100%]': index + 1 === arr.length,
              }
            )}
            style={{
              left: `${totalAnchorList[index]}%`,
            }}
          >
            {top.render({
              index,
              data,
              isAchieve: totalAnchorList[index] <= percent,
            })}
          </div>

          {/* 撐開高度用的，畫面上看不到的 dummy */}
          <div
            key={`top-render-dummy-${index}`}
            className={cx(
              FLEX_COL,
              'gap-[2px]',
              'opacity-0',
              'relative z-[-1]'
            )}
          >
            {top.render({
              index,
              data,
              isAchieve: totalAnchorList[index] <= percent,
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopAnchorNode;
