import { memo } from 'react';
import useHeaderAction from '@mode2/action/components/header/headerAction';
import { EResourceLevel } from '@mode2/utils';
import { cx } from '@libs/commonUtils';
import { handleHomeActionClick } from '@mode2/action/actionTypes';
import { Icon } from '@components/Icon';
import { useHeaderStore } from '@mode2/zustand/components/headerStore';

export const HeaderSystemLogo = memo(() => {
  const config = useHeaderStore((state) => state.config);
  const { handleHeaderClick } = useHeaderAction();
  return (
    <div
      className={cx('flex gap-2 items-center', {
        'cursor-pointer': !config.onSystemLogoClick,
      })}
      onClick={() => {
        if (config.onSystemLogoClick) {
          config.onSystemLogoClick();
        } else {
          handleHeaderClick({
            actionName: handleHomeActionClick,
          });
        }
      }}
    >
      <Icon
        className={cx('h-10 w-auto object-contain')}
        name={'game_logo_157_59'}
        imgClassName={'w-auto'}
        level={EResourceLevel.LOGO}
      />
    </div>
  );
});

export default HeaderSystemLogo;
