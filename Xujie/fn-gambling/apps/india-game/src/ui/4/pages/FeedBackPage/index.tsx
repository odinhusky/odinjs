import useMode2FeedBackPageBase from '@libs/mode2/usecase/page/feedBackPage/useMode2FeedBackPageBase';
import useFeedBackPageHeaderSettingOverride from '@libs/mode2/usecase/page/feedBackPage/useFeedBackPageHeaderSettingOverride';
import { useMode2FeedBackPageTabStore } from '@mode2/zustand/page/feedbackPageStore';
import { feedBackPageTabIdObj } from '@mode2/@types/feedBackPageTab';
import { cx } from '@libs/commonUtils';
import FeedBackInBox from './components/FeedBackInBox';
import FeedBackFAQ from './components/FeedBackFAQ';

const FeedBackPage = () => {
  useMode2FeedBackPageBase();

  useFeedBackPageHeaderSettingOverride();

  const activeTabId = useMode2FeedBackPageTabStore(
    (state) => state.activeTabId
  );

  return (
    <div className={cx('pt-0 pb-0')}>
      <div className={cx('rounded-none', 'overflow-hidden', '-mx-4')}>
        {activeTabId === feedBackPageTabIdObj.INBOX ? <FeedBackInBox /> : null}

        {activeTabId === feedBackPageTabIdObj.FAQ ? <FeedBackFAQ /> : null}
      </div>
    </div>
  );
};
export default FeedBackPage;
