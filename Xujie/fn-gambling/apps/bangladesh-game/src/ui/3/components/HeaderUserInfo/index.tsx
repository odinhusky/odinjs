import cx from '@libs/commonUtils/cx';
import {
  FLEX_CENTER,
  FLEX_ITEMS_CENTER,
  XY_CENTER,
} from '@libs/constant/style';
import {
  handleMyDrawerActionClick,
  handleMyPageActionClick,
  handleVIPActionClick,
} from '@libs/mode2/action/components/header/actionType';
import useHeaderAction from '@libs/mode2/action/components/header/headerAction';
import isEqual from 'lodash/isEqual';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils/img/getImgUrl';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { memo } from 'react';
import { useBreakPoint } from '@libs/commonUtils';
import Avatar from '@components/Avatar';
import Icon from '@libs/mode2/components/Icon';

/**
 * 个人信息元件
 * isInMoreGame: 是否进入更多游戏页面
 */
export const HeaderUserInfo = memo(
  (props: { isInMoreGame?: boolean }) => {
    const { isMobile } = useBreakPoint();
    const { handleHeaderClick } = useHeaderAction();
    const level = useUserProfileStore((state) => state.level);

    return (
      <div
        className={cx(
          FLEX_ITEMS_CENTER,
          'relative',
          'gap-1',
          'cursor-pointer rounded mobile:py-1 mobile:px-2 py-[2px] px-1',
          'bgi-[var(--base-2-main)] hover:bgi-[var(--base-2-light)] active:bgi-[var(--base-2-dark)]'
        )}
      >
        <div
          className={cx(
            'relative tablet:w-8 tablet:h-8 mobile:w-7 mobile:h-7 w-6 h-6'
          )}
          onClick={() =>
            handleHeaderClick({
              actionName: handleVIPActionClick,
            })
          }
        >
          <Avatar className={cx('w-full', 'rounded-full')} />
        </div>
        <div
          className={cx(
            FLEX_CENTER,
            'tablet:sticky absolute mobile:-bottom-2 mobile:left-6 -bottom-2 left-4 w-[26px] h-5'
          )}
        >
          <img
            className={cx('absolute w-full', XY_CENTER)}
            src={getImgUrl(EResourceLevel.V, 'icon_vip_level')}
          />

          <div className="relative text-xxxs text-[var(--linear-8-main)] font-semibold pb-1">
            V {level}
          </div>
        </div>
        <div
          onClick={() => {
            if (isMobile) {
              handleHeaderClick({
                actionName: handleMyPageActionClick,
              });
            } else {
              handleHeaderClick({
                actionName: handleMyDrawerActionClick,
              });
            }
          }}
        >
          <Icon
            className={cx('w-5 h-5', 'cursor-pointer')}
            name="ic_arrow_down_1"
            color="var(--grayscale-10)"
          />
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);
