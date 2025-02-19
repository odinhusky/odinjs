import { memo } from 'react';
import useHeaderAction from '@mode2/action/components/header/headerAction';
import { EResourceLevel } from '@mode2/utils';
import { cx } from '@libs/commonUtils';
import { handleHomeActionClick } from '@mode2/action/components/header/actionType';
import { Icon } from '@components/Icon';
import sdkUtils from '@mode2/utils/sdk';
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
        className={cx('h-8 w-8 object-contain')}
        name={'game_logo_512'}
        level={EResourceLevel.LOGO}
      />

      <p className=" text-2xl font-bold bgi-text-[var(--base-1-main)]">
        {sdkUtils.productName()}
      </p>
    </div>
  );
});
