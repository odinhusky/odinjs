import useMode2FeedBackPageBase from '@libs/mode2/usecase/page/feedBackPage/useMode2FeedBackPageBase';
import { useMode2FeedBackPageTabStore } from '@mode2/zustand/page/feedbackPageStore';
import { feedBackPageTabIdObj } from '@mode2/@types/feedBackPageTab';
import React from 'react';
import FeedBackDesktopHeader from './components/FeedBackDesktopHeader';
import FeedBackTabList from './components/FeedBackTabList';
import FeedBackCustomerSupport from './components/FeedBackCustomerSupport';
import FeedBackFAQ from './components/FeedBackFAQ';
import FeedBackInBox from './components/FeedBackInBox';
import { cx } from '@libs/commonUtils';
import AffixHeaderBottomWrapper from '@libs/mode2/components/AffixHeaderBottomWrapper';

export const FeedBackPage = () => {
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
        <AffixHeaderBottomWrapper>
          <FeedBackTabList />
        </AffixHeaderBottomWrapper>

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
