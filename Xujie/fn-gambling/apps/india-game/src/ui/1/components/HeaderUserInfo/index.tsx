import cx from '@libs/commonUtils/cx';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { handleVIPActionClick } from '@libs/mode2/action/components/header/actionType';
import useHeaderAction from '@libs/mode2/action/components/header/headerAction';
import isEqual from 'lodash/isEqual';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { memo } from 'react';
import Avatar from '@components/Avatar';

/**
 * 个人信息元件
 * isInMoreGame: 是否进入更多游戏页面
 */
export const HeaderUserInfo = memo(
  (props: { isInMoreGame?: boolean }) => {
    const { handleHeaderClick } = useHeaderAction();
    const level = useUserProfileStore((state) => state.level);

    return (
      <div className={cx(FLEX_ITEMS_CENTER, 'gap-1', 'cursor-pointer')}>
        <div
          className={cx('w-7 h-7', 'mobile:w-8 mobile:h-8', 'relative')}
          onClick={() =>
            handleHeaderClick({
              actionName: handleVIPActionClick,
            })
          }
        >
          <Avatar className={cx('w-full h-7  mobile:h-8', 'rounded-[100%]')} />
          <div
            className={cx(
              'w-6 h-3',
              'text-[8px] text-[var(--grayscale-100)]',
              'text-center',
              'box-border',
              'rounded',
              'px-[3px] py-0',
              'bgi-[var(--linear-8-main)]',
              'absolute bottom-0 left-1/2 -translate-x-1/2'
            )}
          >
            V {level}
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);
