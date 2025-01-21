import useMode2FeedBackPageBase from '@/ui/hooks/pages/feedBackPage/useMode2FeedBackPageBase';
import { useMode2FeedBackPageTabStore } from '@mode2/zustand/page/feedbackPageStore';
import { feedBackPageTabIdObj } from '@mode2/@types/feedBackPageTab';
import React from 'react';
import FeedBackDesktopHeader from '@pages/FeedBackPage/components/FeedBackDesktopHeader';
import FeedBackTabList from '@pages/FeedBackPage/components/FeedBackTabList';
import FeedBackCustomerSupport from '@pages/FeedBackPage/components/FeedBackCustomerSupport';
import FeedBackFAQ from '@pages/FeedBackPage/components/FeedBackFAQ';
import FeedBackInBox from '@pages/FeedBackPage/components/FeedBackInBox';
import { cx } from '@libs/commonUtils';

const FeedBackPage = () => {
  useMode2FeedBackPageBase();

  const activeTabId = useMode2FeedBackPageTabStore(
    (state) => state.activeTabId
  );

  return (
    <div className={cx('pt-0 pb-0 tablet:py-8')}>
      {/* eslint-disable-next-line react/jsx-no-undef */}
      <FeedBackDesktopHeader />

      <div
        className={cx(
          'feedback',
          'rounded-none',
          'overflow-hidden',
          '-mx-4 tablet:-mx-0'
        )}
      >
        <FeedBackTabList />

        {activeTabId === feedBackPageTabIdObj.CUSTOMER_SUPPORT ? (
          <FeedBackCustomerSupport />
        ) : null}

        {activeTabId === feedBackPageTabIdObj.INBOX ? <FeedBackInBox /> : null}

        {activeTabId === feedBackPageTabIdObj.FAQ ? <FeedBackFAQ /> : null}
      </div>
    </div>
  );
};
export default FeedBackPage;
