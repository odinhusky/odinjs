import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import IconTint from '../../../components/IconTint';
import React, { memo, useState } from 'react';
import { cx } from '@libs/commonUtils';
import { useImageCache } from '@mode2/usecase/useImageCache';
import isEqual from 'lodash/isEqual';
import { isEmpty } from 'lodash';

const ImageIcon = ({ src }: { src: string }) => {
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
};

const Icon = ({
  className,
  name,
  onClick,
  // size,
  color,
  level,
}: {
  className?: string;
  name: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  level?: EResourceLevel;
  color?: string;
  // size?: string;
}) => {
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

export default memo(Icon, (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
});
