import { environment } from 'apps/gambling/src/environments/environment';
import { CacheImage } from '../../components/image/CacheImage';
import cx from '../../utils/cx';
import { XY_CENTER } from 'apps/gambling/src/assets/constant/style';
import { CSSProperties } from 'styled-components';

const style: CSSProperties = {
  userSelect: 'none',
  MozUserSelect: 'none',
  WebkitUserSelect: 'none',
  msUserSelect: 'none',
};

export const PopupCloseBtn = ({
  onClick,
  className,
  disabled,
}: {
  onClick: <T>(arg?: T) => void;
  className?: string;
  disabled?: boolean;
}) => {
  return (
    <>
      <button
        className={cx(
          'relative group w-[56px] h-[56px] rounded-full',
          'hover:bg-[var(--transparent-white-20)]',
          'active:bg-[var(--state-error-disabled)]',
          'disabled:bg-transparent',
          className
        )}
        onClick={onClick}
        disabled={disabled}
      >
        <CacheImage
          style={style}
          className={cx(
            'absolute w-[35px] h-[35px] hidden group-disabled:block',
            XY_CENTER
          )}
          src={`assets/${environment.uVersion}/ic_closed.png`}
        />
        <CacheImage
          style={style}
          className={cx(
            'absolute w-[35px] h-[35px] block group-disabled:hidden',
            XY_CENTER
          )}
          src={`assets/${environment.uVersion}/ic_closed_white.png`}
        />
      </button>
    </>
  );
};

export default PopupCloseBtn;
