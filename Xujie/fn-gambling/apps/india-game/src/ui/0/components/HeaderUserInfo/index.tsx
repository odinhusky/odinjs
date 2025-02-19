import isEqual from 'lodash/isEqual';
import { memo } from 'react';

/**
 * 个人信息元件
 * isInMoreGame: 是否进入更多游戏页面
 */
export const HeaderUserInfo = memo(
  (props: { isInMoreGame?: boolean }) => {
    return null;
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);
