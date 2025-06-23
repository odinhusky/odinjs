import { memo } from 'react';
import useHeaderAction from '@mode2/action/components/header/headerAction';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { cx } from '@libs/commonUtils';
import { handleHomeActionClick } from '@mode2/action/actionTypes';
import { useHeaderStore } from '@mode2/zustand/components/headerStore';

export const HeaderSystemLogo = memo(() => {
  const config = useHeaderStore((state) => state.config);
  const { handleHeaderClick } = useHeaderAction();
  return (
    <img
      src={getImgUrl(EResourceLevel.LOGO, 'game_logo_1')}
      className={cx('h-7 mobile:h-10 object-contain', {
        'cursor-pointer': !config.onSystemLogoClick,
      })}
      alt="game_logo_1"
      onClick={() => {
        if (config.onSystemLogoClick) {
          config.onSystemLogoClick();
        } else {
          handleHeaderClick({
            actionName: handleHomeActionClick,
          });
        }
      }}
    />
  );
});

export default HeaderSystemLogo;
