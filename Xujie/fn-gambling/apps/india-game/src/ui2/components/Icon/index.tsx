import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { cx } from '@libs/commonUtils';
import React, { memo } from 'react';
import isEqual from 'lodash/isEqual';
import { IconProps } from './IconProps';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';

/**
 * @param props
 * @constructor
 */
export const Icon = (props: IconProps) => {
  const { className, name, onClick, level, imgClassName, ext } = props;
  const src = getImgUrl(level || EResourceLevel.ICONS, name, ext || '');
  return (
    <div
      className={cx(`icon mode-3 icon-${name} w-5`, className)}
      style={{
        flexShrink: 0,
      }}
      onClick={onClick}
    >
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
