import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { Skeleton } from 'antd';
import TableSkeletonProps from '../TableSkeletonProps';
import { v4 as uuidv4 } from 'uuid';

export const TableSkeleton = ({
  length,
  uniqueId = '',
}: TableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: 3 }, (_, index) => {
        return (
          <div
            className={cx(
              FLEX_ITEMS_CENTER,
              'gap-8 my-4 p-4',
              'bgi-[var(--base-2-variant5)] rounded-md'
            )}
            key={`skeleton-container-${uniqueId || ''}${uuidv4()}`}
          >
            {Array.from({ length }, (_, index) => {
              return (
                <Skeleton
                  key={`table-row-skeleton-${uniqueId || ''}${uuidv4()}`}
                  active
                  title={false}
                  paragraph={{ rows: 1, width: '100%' }}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
};

export default TableSkeleton;
