import { useEffect } from 'react';
import useFeedBackPageActions from '@mode2/action/feedBackPageAction/useFeedBackPageActions';
import { handleFeedBackPageInBoxMessageDetailInnerClick } from '@mode2/action/actionTypes';
import { InBoxDetailInnerActionTypes } from '@mode2/@types/inBoxDetailInnerActionTypes';

export const useInboxDetailInnerClickBase = () => {
  const { handleFeedBackPageClick } = useFeedBackPageActions();

  useEffect(() => {
    const handleClick = (event: any) => {
      event.preventDefault();
      console.log('@@@===> action', event.target.className);
      handleFeedBackPageClick({
        actionName: handleFeedBackPageInBoxMessageDetailInnerClick,
        payload: {
          action: event.target.className,
        },
      });
    };

    const observer = new MutationObserver(() => {
      Object.values(InBoxDetailInnerActionTypes).forEach((action) => {
        document
          .querySelector(`.${action}`)
          ?.addEventListener('click', handleClick);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      Object.values(InBoxDetailInnerActionTypes).forEach((action) => {
        document
          .querySelector(`.${action}`)
          ?.removeEventListener('click', handleClick);
      });
    };
  }, []);
};

export default useInboxDetailInnerClickBase;
