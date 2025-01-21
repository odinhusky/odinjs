import { useNavigate } from 'react-router-dom';
import { To } from 'react-router';
import { NavigateOptions } from 'react-router/dist/lib/context';
import useGuestNavPageClickStrategy from '@mode2/usecase/navPageClick/useGuestNavPageClickStrategy';

/**
 * 未登入的訪客，導航決策
 */
export const useGuestNavigateClickStrategy = () => {
  const navigate = useNavigate();
  const { mapRoutesNavTo } = useGuestNavPageClickStrategy();

  return (to: To | number, options?: NavigateOptions) => {
    if (typeof to === 'number') {
      navigate(to);
      return;
    }

    if (typeof to === 'string') {
      mapRoutesNavTo(to, '', options);
    }

    // const isNeedLogin =
    //   typeof to === 'string'
    //     ? !ROUTE_WHITE_LIST.find((v) => to.startsWith(v))
    //     : false;
    // if (BasePagePathObj.WalletPage === to) {
    //   const query = to.replace(BasePagePathObj.WalletPage, '');
    //   navToWalletPage(query, options);
    // } else if (BasePagePathObj.FeedBackPage === to) {
    //   const query = to.replace(BasePagePathObj.FeedBackPage, '');
    //   navToFeedbackPage(query, options);
    // } else {
    //   if (isNeedLogin) {
    //     if (sdkUtils.isCurrentLogin()) {
    //       navigate(to, options);
    //     } else {
    //       navToLoginPage();
    //     }
    //   } else {
    //     navigate(to, options);
    //   }
    // }
  };
};

export default useGuestNavigateClickStrategy;
