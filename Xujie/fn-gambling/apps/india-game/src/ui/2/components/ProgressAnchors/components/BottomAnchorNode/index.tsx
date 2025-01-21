import { AnchorObj } from '@components/ProgressAnchors';
import { cx } from '@libs/commonUtils';
import { FLEX_COL } from '@libs/constant/style';

interface BottomAnchorNodeProps<TopDataType> {
  bottom?: AnchorObj<TopDataType>;
  totalAnchorList: number[];
  percent: number;
}

export const BottomAnchorNode = <TopDataType,>({
  bottom,
  totalAnchorList,
  percent,
}: BottomAnchorNodeProps<TopDataType>) => {
  // handle error
  if (!bottom || !bottom?.dataList || !(bottom?.render instanceof Function))
    return;

  if ((bottom && !bottom?.dataList) || !(bottom?.render instanceof Function)) {
    console.error(
      '@@ BottomAnchorNode data - {{bottom}} structure is missing a required property'
    );
    return;
  }

  return (
    <div className={cx('w-full', 'flex')}>
      {bottom.dataList.map((data, index, arr) => (
        <div key={`bottom-render-${index}`}>
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
            {bottom.render({
              index,
              data,
              isAchieve: totalAnchorList[index] <= percent,
            })}
          </div>

          {/* 撐開高度用的，畫面上看不到的 dummy */}
          <div
            key={`bottom-render-dummy-${index}`}
            className={cx(
              FLEX_COL,
              'gap-[2px]',
              'opacity-0',
              'relative z-[-1]'
            )}
          >
            {bottom.render({
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

export default BottomAnchorNode;
