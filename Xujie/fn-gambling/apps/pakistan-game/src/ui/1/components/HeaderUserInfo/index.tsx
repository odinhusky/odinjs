import cx from '@libs/commonUtils/cx';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import {
  handleMyDrawerActionClick,
  handleMyPageActionClick,
  handleVIPActionClick,
} from '@libs/mode2/action/components/header/actionType';
import useHeaderAction from '@libs/mode2/action/components/header/headerAction';
import isEqual from 'lodash/isEqual';
import { memo, useCallback } from 'react';
import { useBreakPoint } from '@libs/commonUtils';
import Icon from '@mode2/components/Icon';
import Avatar from '@components/Avatar';
import BasePrimaryOutlineBtn from '@components/BasePrimaryOutlineBtn';

/**
 * 个人信息元件
 * isInMoreGame: 是否进入更多游戏页面
 */
export const HeaderUserInfo = memo(
  (props: { isInMoreGame?: boolean }) => {
    const { isMobile } = useBreakPoint();
    const { handleHeaderClick } = useHeaderAction();

    return (
      <div className={cx(FLEX_ITEMS_CENTER, 'gap-1', 'cursor-pointer')}>
        <BasePrimaryOutlineBtn
          className={cx(
            'w-8 h-8 mobile:w-10 mobile:h-10  rounded-full relative'
          )}
          classNameBg={cx('bgi-[var(--grayscale-00)] rounded-full')}
          onClick={() =>
            handleHeaderClick({
              actionName: isMobile
                ? handleMyPageActionClick
                : handleMyDrawerActionClick,
            })
          }
        >
          <Avatar
            className={cx('w-7 h-7 mobile:w-9 mobile:h-9', 'rounded-full')}
          />
        </BasePrimaryOutlineBtn>
        {!isMobile ? (
          <Icon
            className={cx('w-5 h-5', 'cursor-pointer')}
            name={'ic_arrow_down_1'}
            color="var(--grayscale-90)"
            onClick={() =>
              handleHeaderClick({
                actionName: isMobile
                  ? handleMyPageActionClick
                  : handleMyDrawerActionClick,
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
