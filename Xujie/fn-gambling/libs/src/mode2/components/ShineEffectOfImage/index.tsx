import { cx } from '@libs/commonUtils';
import React from 'react';

interface ShineEffectOfImageProps {
  url: string;
  containerClass?: string;
  lightClass?: string;
}

export const ShineEffectOfImage = ({
  url,
  containerClass,
  lightClass,
}: ShineEffectOfImageProps) => {
  const maskValue = `url(${url}) 0 0/100%`;

  return (
    <div
      className={cx(
        'pointer-events-none',
        'absolute top-0 left-0 h-full w-full overflow-hidden',
        containerClass
      )}
      style={{
        mask: maskValue,
        WebkitMask: maskValue,
      }}
    >
      <div
        className={cx(
          'absolute top-0 h-full w-[30px]',
          'bg-gradient-to-r from-transparent via-white/70 to-transparent',
          'animate-shine-r-20',
          lightClass
        )}
      />
    </div>
  );
};

export default ShineEffectOfImage;
