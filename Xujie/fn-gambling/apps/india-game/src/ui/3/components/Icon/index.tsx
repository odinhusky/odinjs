import { BaseIconProps } from '@mode2/components/BaseIcon';
import { isEmpty } from 'lodash';
import { useImageCache } from '@mode2/usecase/useImageCache';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { cx } from '@libs/commonUtils';
import React, { memo } from 'react';
import isEqual from 'lodash/isEqual';

interface IconProps extends BaseIconProps {}

interface ActiveRes {
  def?: {
    suffix?: string;
    ext?: string;
  };
  active?: {
    suffix?: string;
    ext?: string;
  };
}

const defIconActive: ActiveRes = {};
/**
 * 直接在 icon 處理 active
 */
const iconActiveMap: Record<string, ActiveRes> = {
  // 底部導航
  ic_activity: { def: { suffix: '_default' }, active: { suffix: '_active' } },
  ic_earn_money: { def: { suffix: '_default' }, active: { suffix: '_active' } },
  nav_bar_invitation_wheel: { def: { ext: '.gif' }, active: { ext: '.gif' } },
  ic_home: { def: { suffix: '_default' }, active: { suffix: '_active' } },
  ic_mail_deposit_bonus: {
    def: { suffix: '_default' },
    active: { suffix: '_active' },
  },
  ic_user: { def: { suffix: '_default' }, active: { suffix: '_active' } },

  // 遊戲類型分類
  ic_casino: { active: { ext: '.gif' } },
  ic_fishing: { active: { ext: '.gif' } },
  ic_game: { active: { ext: '.gif' } },
  ic_original: { active: { ext: '.gif' } },
  ic_popular: { active: { ext: '.gif' } },
  ic_slots: { active: { ext: '.gif' } },
  ic_sports: { active: { ext: '.gif' } },
};

/**
 * // TODO Evan _active 有些需要支援 gif 檔案類型
 * @param props
 * @constructor
 */
export const Icon = (props: IconProps) => {
  const { className, name, onClick, level, isActive, imgClassName } = props;
  const activeRes: ActiveRes = iconActiveMap[name] || defIconActive;
  const suffix =
    isActive === true ? activeRes?.active?.suffix : activeRes?.def?.suffix;
  const ext = isActive === true ? activeRes?.active?.ext : activeRes?.def?.ext;
  const resName = `${name}${suffix || ''}`;

  const src = isEmpty(resName)
    ? resName
    : useImageCache.getIconByCache(
        getImgUrl(level || EResourceLevel.ICONS, resName, ext || ''),
        ''
      );

  return (
    <div
      className={cx(`icon mode-3 icon-${name} w-5`, className)}
      style={{
        flexShrink: 0,
      }}
      onClick={onClick}
    >
      <img
        alt={name}
        src={src}
        className={cx(
          'w-full h-full',
          'object-contain',
          'max-w-max max-h-max',
          imgClassName
        )}
        onError={() => {
          // setError(true);
        }}
      />
    </div>
  );
};

export default memo(Icon, (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
});
