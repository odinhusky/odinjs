import { To } from 'react-router';
import { NavigateOptions } from 'react-router/dist/lib/context';
import useShouldNavigate from '@mode2/usecase/navPageClick/useShouldNavigate';
import useEmptyNavPageClickStrategy from '@mode2/usecase/navPageClick/useEmptyNavPageClickStrategy';

/**
 * 未登入的訪客，導航決策
 */
export const useEmptyNavigateClickStrategy = () => {
  const navigate = useShouldNavigate();
  const { mapRoutesNavTo } = useEmptyNavPageClickStrategy();

  return (to: To | number, options?: NavigateOptions) => {
    if (typeof to === 'number') {
      navigate(to);
      return;
    }

    if (typeof to === 'string') {
      mapRoutesNavTo(to, '', options);
    }
  };
};

export default useEmptyNavigateClickStrategy;
