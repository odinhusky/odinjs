import { To } from 'react-router';
import { NavigateOptions } from 'react-router/dist/lib/context';
import useUserNavPageClickStrategy from '@mode2/usecase/navPageClick/useUserNavPageClickStrategy';
import useShouldNavigate from '@mode2/usecase/navPageClick/useShouldNavigate';

/**
 * 已經登入的使用者，導航決策
 */
export const useUserNavigateClickStrategy = () => {
  const navigate = useShouldNavigate();
  const { mapRoutesNavTo } = useUserNavPageClickStrategy();
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

export default useUserNavigateClickStrategy;
