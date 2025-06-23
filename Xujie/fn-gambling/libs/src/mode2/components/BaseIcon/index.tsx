import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import IconTint from '../../../components/IconTint';
import React, { CSSProperties, memo, useState } from 'react';
import { cx } from '@libs/commonUtils';
import { useImageCache } from '@mode2/usecase/useImageCache';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

export const ImageIcon = memo(
  ({ src }: { src: string }) => {
    const defIcon = getImgUrl(EResourceLevel.SHARED, `icon_others`);
    const [isError, setError] = useState(false);
    return isError ? (
      <img src={defIcon} className={`w-full h-full`} />
    ) : (
      <img
        src={src}
        className={`w-full h-full`}
        onError={() => {
          setError(true);
        }}
      />
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);

export interface BaseIconProps {
  className?: string;
  imgClassName?: string;
  name: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  color?: string;
  level?: EResourceLevel;
  isActive?: boolean;
  style?: CSSProperties | undefined;
}

const BaseIcon = ({
  className,
  name,
  onClick,
  color,
  level,
}: BaseIconProps) => {
  // const decisionSize =
  //   size === 'auto' ? size : size?.includes('%') ? size : `${size}px`;

  const src = isEmpty(name)
    ? name
    : useImageCache.getIconByCache(
        getImgUrl(level || EResourceLevel.V, name),
        color || ''
      );
  return (
    <div
      className={cx(`icon icon-${name} w-5`, className)}
      style={{
        // ...(size && {
        //   width: `${decisionSize}`,
        //   height: `${decisionSize}`,
        // }),
        flexShrink: 0,
      }}
      onClick={onClick}
    >
      {/* NOTICE style,onClick挂在IconTint icon不会显示 */}

      {isEmpty(name) ? (
        <></>
      ) : isEmpty(color) ? (
        <ImageIcon src={src} />
      ) : (
        <IconTint
          key={name}
          className={`w-full h-full`}
          color={color}
          src={src}
          defaultSrc={getImgUrl(
            EResourceLevel.SHARED,
            `icon_others${color ? '' : '_color'}`
          )}
        />
      )}
    </div>
  );
};

export default memo(BaseIcon, (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
});
