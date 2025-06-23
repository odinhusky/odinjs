import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { Skeleton } from 'antd';

export const InboxListSkeleton = () => {
  return (
    <>
      {Array.from({ length: 3 }, (_, index) => {
        return (
          <div key={index} className={cx(FLEX_ITEMS_CENTER, 'mb-5 gap-4')}>
            <Skeleton.Button />
            <Skeleton
              paragraph={{ rows: 2, width: '60%' }}
              active
              title={false}
            />
          </div>
        );
      })}
    </>
  );
};

export default InboxListSkeleton;
