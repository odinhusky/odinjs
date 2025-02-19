import { To } from 'react-router';
import { NavigateOptions } from 'react-router/dist/lib/context';
import useShouldNavigate from '@mode2/usecase/navPageClick/useShouldNavigate';
import usePlayerNavPageClickStrategy from '@mode2/usecase/navPageClick/usePlayerNavPageClickStrategy';

/**
 * 帳號尚未完善的 Player，導航決策
 */
export const usePlayerNavigateClickStrategy = () => {
  const navigate = useShouldNavigate();
  const { mapRoutesNavTo } = usePlayerNavPageClickStrategy();
  return (to: To | number, options?: NavigateOptions) => {
    if (typeof to === 'number') {
      navigate(to);
      return;
    }
    if (typeof to === 'string') {
      mapRoutesNavTo(to, '', options);
    }
    // if (BasePagePathObj.WalletPage === to) {
    //   const query = to.replace(BasePagePathObj.WalletPage, '');
    //   navToWalletPage(query, options);
    // } else if (BasePagePathObj.FeedBackPage === to) {
    //   const query = to.replace(BasePagePathObj.FeedBackPage, '');
    //   navToFeedbackPage(query, options);
    // } else {
    //   navigate(to, options);
    // }
  };
};

export default usePlayerNavigateClickStrategy;
