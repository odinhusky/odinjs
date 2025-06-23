import Icon from '@components/Icon';
import { cx, useBreakPoint } from '@libs/commonUtils';
import { normalGameImgAspectClassMode3 } from '@libs/constant/gameItemRatio';
import { FLEX_CENTER } from '@libs/constant/style';
import { LoadingGameItemsProps } from '../LoadingGameItemsProps';

// V6 版本
export const LoadingGameItems = ({ pageSize }: LoadingGameItemsProps) => {
  const { isDesktop, isTablet } = useBreakPoint();
  const defaultPageSize = (isDesktop ? 18 : isTablet ? 12 : 9) * 2;
  const realPageSize = pageSize ? pageSize : defaultPageSize;

  const gridCol = 'grid-cols-3';

  return (
    <div className={cx('w-full', 'grid gap-[6px]', gridCol)}>
      {Array(realPageSize)
        .fill('')
        .map((_, index) => {
          return (
            <div
              key={`Loading Game Items - ${index + 1}`}
              className={cx(
                FLEX_CENTER,
                'bgi-[var(--transparent-white-10)]',
                'rounded-2xl',
                'w-full',
                normalGameImgAspectClassMode3
              )}
            >
              <Icon
                name="ic_loading_game_item"
                className={cx('block', 'w-3/4')}
              />
            </div>
          );
        })}
    </div>
  );
};

export default LoadingGameItems;
