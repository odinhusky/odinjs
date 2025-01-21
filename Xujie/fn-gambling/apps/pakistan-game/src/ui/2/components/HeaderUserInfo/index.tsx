import cx from '@libs/commonUtils/cx';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import {
  handleMyDrawerActionClick,
  handleVIPActionClick,
} from '@libs/mode2/action/components/header/actionType';
import useHeaderAction from '@libs/mode2/action/components/header/headerAction';
import isEqual from 'lodash/isEqual';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { memo } from 'react';
import { useBreakPoint } from '@libs/commonUtils';
import Icon from '@mode2/components/Icon';
import Avatar from '@components/Avatar';

/**
 * 个人信息元件
 * isInMoreGame: 是否进入更多游戏页面
 */
export const HeaderUserInfo = memo(
  (props: { isInMoreGame?: boolean }) => {
    const { isTablet, isDesktop } = useBreakPoint();
    const { handleHeaderClick } = useHeaderAction();
    const level = useUserProfileStore((state) => state.level);

    return (
      <div className={cx(FLEX_ITEMS_CENTER, 'gap-1', 'cursor-pointer')}>
        <div
          className={cx('w-6 h-7', 'relative')}
          onClick={() =>
            handleHeaderClick({
              actionName: handleVIPActionClick,
            })
          }
        >
          <Avatar className={cx('w-full h-6', 'rounded-[100%]')} />
          {props.isInMoreGame && !isDesktop ? null : (
            <div
              className={cx(
                'w-6 h-3',
                'text-[8px] text-[var(--grayscale-10)]',
                'leading-3 text-center',
                'box-border',
                'rounded',
                'px-[3px] py-0',
                'bgi-[var(--base-2-main)]',
                'absolute bottom-0'
              )}
            >
              V {level}
            </div>
          )}
        </div>
        {isDesktop || (!props.isInMoreGame && isTablet) ? (
          <Icon
            className={cx('w-5 h-5', 'cursor-pointer')}
            name={'ic_arrow_down_1'}
            color="var(--base-2-main)"
            onClick={() =>
              handleHeaderClick({
                actionName: handleMyDrawerActionClick,
              })
            }
          />
        ) : null}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);
