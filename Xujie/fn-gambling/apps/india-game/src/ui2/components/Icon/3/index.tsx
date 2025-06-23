import isEmpty from 'lodash/isEmpty';
import { useImageCache } from '@mode2/usecase/useImageCache';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { cx } from '@libs/commonUtils';
import React, { memo } from 'react';
import isEqual from 'lodash/isEqual';
import { ActiveRes, ICON_MAPPING } from '@constant/iconMapping';
import { IconProps } from '../IconProps';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';

const env = import.meta.env['VITE_V_VERSION'];

const defIconActive: ActiveRes = {};
const iconActiveMap: Record<string, ActiveRes> = ICON_MAPPING[env] || {};

/**
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
        ...props.style,
      }}
      onClick={onClick}
    >
      {/*// posthog autocapture [data-ph-capture, data-ph-event-name]*/}
      <BaseCacheImg
        alt={name}
        src={src}
        imgName={name}
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
