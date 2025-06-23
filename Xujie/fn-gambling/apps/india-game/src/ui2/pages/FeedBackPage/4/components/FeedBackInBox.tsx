import { cx } from '@libs/commonUtils';
import FeedBackInBoxUnit from './FeedBackInBoxUnit';
import { useMode2FeedBackPageInBoxStore } from '@libs/mode2/zustand/page/feedbackPageStore';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import { FLEX_COL, MOBILE_BREAK_POINT_MAX_WIDTH } from '@libs/constant/style';
import { useEffect } from 'react';
import useIntersectionObserver from '@commonUtils/hooks/useIntersectionObserver';
import NoData from '@components/NoData';
import { useTranslation } from 'react-i18next';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import useFeedBackPageActions from '@libs/mode2/action/feedBackPageAction/useFeedBackPageActions';
import {
  handleFeedBackPageInBoxMessageDeleteBtnClick,
  handleFeedBackPageInBoxMessageReceiveBtnClick,
} from '@mode2/action/actionTypes';
import InboxListSkeleton from '../Skeleton/InboxListSkeleton';

export const FeedBackInBox = () => {
  const { t } = useTranslation();
  const { handleFeedBackPageClick } = useFeedBackPageActions();
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

  const isShowMessageModal = useMode2FeedBackPageInBoxStore(
    (state) => state.isShowMessageModal
  );
  const inboxLoading = useMode2FeedBackPageInBoxStore(
    (state) => state.inboxLoading
  );

  const hasReadMessages =
    isArray(inBoxPageList) && inBoxPageList.some((item) => item.isRead);
  const rewardData =
    isArray(inBoxPageList) && !isEmpty(inBoxPageList)
      ? inBoxPageList.filter(
          (item) =>
            item.reward > 0 &&
            item.isClaim === 0 &&
            item.isLock === 0 &&
            !item.isExpired
        )
      : [];
  const rewardIds = rewardData.map((item) => item.id);
  const totalReward = rewardData.reduce((sum, item) => sum + item.reward, 0);

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
    <div className={cx('')}>
      <div
        className={cx('w-full h-full p-4 pb-32', FLEX_COL, 'gap-1.5 ', {
          'h-[0] p-0': isEmpty(inBoxPageList),
          'h-auto': inBoxPageList?.length === 0,
          'pb-0 h-auto': isShowMessageModal,
        })}
      >
        {inboxLoading ? <InboxListSkeleton /> : null}

        {!inboxLoading && isArray(inBoxPageList) && !isEmpty(inBoxPageList) ? (
          inBoxPageList.map((item, index) => (
            <FeedBackInBoxUnit
              key={item.indexKey}
              data={item}
              ref={index === inBoxPageList.length - 1 ? targetRef : null}
            />
          ))
        ) : (
          <div className="pt-52 box-border h-screen">
            <NoData />
          </div>
        )}
      </div>

      <div
        className={cx(
          MOBILE_BREAK_POINT_MAX_WIDTH,
          'w-screen text-center ',
          'fixed bottom-0 bgi-[var(--background-light)] z-10'
        )}
      >
        <div className="text-lg py-2 box-border bgi-text-[var(--base-2-variant2)]">
          {t('inbox_mail_storage_duration')}
        </div>
        <div className="flex items-center justify-center gap-4 py-4 box-border bgi-[var(--base-2-variant5)]">
          <BaseSecondaryBtn
            children={t('inbox_delete_read')}
            className="w-44 h-12 !bg-shadow-[var(--box-shadow-6)]"
            classNameText="text-lg"
            disabled={!hasReadMessages}
            onClick={() => {
              handleFeedBackPageClick({
                actionName: handleFeedBackPageInBoxMessageDeleteBtnClick,
                payload: { ids: [] },
              });
            }}
          />
          <BasePrimaryBtn
            children={t('inbox_receive_all')}
            className="w-44 h-12 !bg-shadow-[var(--button-shadow-50)]"
            classNameText="text-lg"
            disabled={!rewardIds.length}
            onClick={() => {
              handleFeedBackPageClick({
                actionName: handleFeedBackPageInBoxMessageReceiveBtnClick,
                payload: { ids: rewardIds, totalReward: totalReward },
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FeedBackInBox;
