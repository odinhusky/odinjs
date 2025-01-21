import { memo } from 'react';
import useHeaderAction from '@mode2/action/components/header/headerAction';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { cx } from '@libs/commonUtils';
import { handleHomeActionClick } from '@mode2/action/components/header/actionType';

export const HeaderSystemLogo = memo(
  (props: { onSystemLogoClick?: () => void }) => {
    const { handleHeaderClick } = useHeaderAction();
    return (
      <img
        src={getImgUrl(EResourceLevel.LOGO, 'game_logo_1')}
        className={cx('h-7 mobile:h-10 object-contain', {
          'cursor-pointer': !props.onSystemLogoClick,
        })}
        alt="game_logo_1"
        onClick={() => {
          if (props.onSystemLogoClick) {
            props.onSystemLogoClick();
          } else {
            handleHeaderClick({
              actionName: handleHomeActionClick,
            });
          }
        }}
      />
    );
  }
);
