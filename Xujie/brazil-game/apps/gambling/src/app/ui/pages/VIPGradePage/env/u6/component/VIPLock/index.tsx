import useBreakpoint from "apps/gambling/src/app/ui/pageTemplate/hooks/useBreakpoint";
import cx from "apps/gambling/src/app/ui/utils/cx";
import { environment } from "apps/gambling/src/environments/environment";

interface VIPLockProps {
  isBigger?: boolean;
}

export const VIPLock = ({isBigger = false}: VIPLockProps) => {
  const {isTablet, isMobile} = useBreakpoint();
  return (
    <img
      className={cx(
        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        {
          'w-[48px]': isBigger,
          'w-[16px]': !isBigger,
          'w-[39px]': isBigger && (isTablet || isMobile),
          'w-[13px]': !isBigger && (isTablet || isMobile),
        }
      )}
      src={`assets/${environment.uVersion}/${environment.mVersion}/vip_lock.png`}
      alt="Locked image" />
  )
}

export default VIPLock;