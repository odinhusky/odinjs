import { cx } from '@libs/commonUtils';
import FeedBackInBoxUnit from './FeedBackInBoxUnit';
import { useMode2FeedBackPageInBoxStore } from '@libs/mode2/zustand/page/feedbackPageStore';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import { FLEX_COL } from '@libs/constant/style';
import FeedBackInBoxMessageModal from './FeedBackInBoxMessageModal';
import { useEffect } from 'react';
import useIntersectionObserver from '@commonUtils/hooks/useIntersectionObserver';
import NoData from '@components/NoData';

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
        className={cx(
          'w-full',
          'tablet:h-[644px] tablet:overflow-y-auto tablet:rounded',
          'px-4 pb-6 pt-0 mobile:px-6 tablet:pt-6',
          'tablet:bgi-[var(--grayscale-25)]',
          FLEX_COL,
          'gap-3',
          {
            'h-[0] p-0': isEmpty(inBoxPageList),
            'h-auto': inBoxPageList?.length === 0,
          }
        )}
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
    </>
  );
};

export default FeedBackInBox;
