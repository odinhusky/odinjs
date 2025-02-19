import { cx } from '@libs/commonUtils';
import FeedBackInBoxUnit from './FeedBackInBoxUnit';
import { useMode2FeedBackPageInBoxStore } from '@libs/mode2/zustand/page/feedbackPageStore';
import { isArray, isEmpty } from 'lodash';
import { FLEX_COL } from '@libs/constant/style';
import FeedBackInBoxMessageModal from './FeedBackInBoxMessageModal';
import { useEffect } from 'react';
import useIntersectionObserver from '@commonUtils/hooks/useIntersectionObserver';
import NoData from '@components/NoData';

// TODO Ronan
// TODO 需要新的api字短 狀態判斷
export const FeedBackInBox = () => {
  const inBoxPageList = useMode2FeedBackPageInBoxStore(
    (state) => state.inBoxPageList
  );

  const inBoxPageNumber = useMode2FeedBackPageInBoxStore(
    (state) => state.inBoxPageNumber
  );
  const setInBoxPageNumber = useMode2FeedBackPageInBoxStore(
    (state) => state.setInBoxPageNumber
  );

  const isEndOfInBoxPageList = useMode2FeedBackPageInBoxStore(
    (state) => state.isEndOfInBoxPageList
  );

  const { targetRef, isIntersecting } = useIntersectionObserver<HTMLDivElement>(
    {
      rootMargin: '0px',
      threshold: 0.1,
      freezeOnceVisible: true,
    }
  );

  useEffect(() => {
    if (isEndOfInBoxPageList === false) {
      setInBoxPageNumber(inBoxPageNumber + 1);
    }
  }, [isIntersecting]);

  return (
    <>
      <div
        className={cx('w-full p-4', FLEX_COL, 'gap-1.5', {
          'h-[0] p-0': isEmpty(inBoxPageList),
          'h-auto': inBoxPageList?.length === 0,
        })}
      >
        {isArray(inBoxPageList) && !isEmpty(inBoxPageList) ? (
          inBoxPageList.map((item, index) => (
            <FeedBackInBoxUnit
              key={item.indexKey}
              data={item}
              ref={index === inBoxPageList.length - 1 ? targetRef : null}
            />
          ))
        ) : (
          <NoData />
        )}
      </div>

      <FeedBackInBoxMessageModal />

      {/* <div className={cx('fixed bottom-0', 'text-lg py-2 box-border')}>
        Mails can be saved for up to 30 days
      </div> */}
    </>
  );
};

export default FeedBackInBox;
