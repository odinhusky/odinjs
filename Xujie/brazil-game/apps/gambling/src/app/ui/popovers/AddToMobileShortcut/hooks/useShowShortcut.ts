import { useSelector } from 'react-redux';
import useBreakpoint from '../../../pageTemplate/hooks/useBreakpoint';
import { useMemo } from 'react';
import { RootState } from 'apps/gambling/src/app/reduxStore';
import { useLocalStorage } from 'usehooks-ts';
import { AppLocalStorageKey } from 'apps/gambling/src/app/persistant/AppLocalStorageKey';
import { PageOrModalPathEnum } from '../../../PageOrModalPathEnum';
import { useLocation } from 'react-router';

const useShowShortcut = () => {
  const { isTablet, isMobile } = useBreakpoint();
  const inNativeApp = useSelector((state: RootState) => state.app.inNativeApp);
  const [hideAddToMobileShortcut] = useLocalStorage(
    AppLocalStorageKey.hideAddToMobileShortcut,
    false
  );
  const location = useLocation();
  // 是否在遊戲中 如果在遊戲中(/game) 需要隱藏MobileShortCut 且不影響 前面三者功能的判斷
  let isIngameRoute = location.pathname === PageOrModalPathEnum.GamePage;
  const isShowAddToMobileShortCut = useMemo(() => {
    return (
      !inNativeApp &&
      !hideAddToMobileShortcut &&
      !isIngameRoute &&
      location.pathname === PageOrModalPathEnum.IndexPage
    );
  }, [location, isTablet, isMobile, hideAddToMobileShortcut]);

  return isShowAddToMobileShortCut;
};
export default useShowShortcut;
