import { cx } from '@libs/commonUtils';
import { useFooterStore } from '@mode2/zustand/components/footerStore';
import { memo, useRef } from 'react';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import isEqual from 'lodash/isEqual';
import { ManufacturerListProps } from '../ManufacturerListProps';
import LazyImage from '@components/LazyImage';

export const ManufacturerList = memo(
  (props: ManufacturerListProps) => {
    const manufacturerList = useFooterStore((state) => state.manufacturerList);
    const containerRef = useRef<HTMLDivElement>(null);
    return manufacturerList.length > 0 ? (
      <div
        ref={containerRef}
        className={cx(
          'grid gap-4 tablet:gap-5 items-center',
          {
            'grid-cols-3 mobile:grid-cols-6 tablet:grid-cols-9':
              props.sceneFrom === 'footer',
          },
          { 'grid-cols-3': props.sceneFrom === 'modal' },
          props?.styles?.content
        )}
      >
        {manufacturerList.map((item) => {
          return (
            <LazyImage
              key={item}
              alt={item}
              ref={containerRef}
              src={getImgUrl(EResourceLevel.SHARED, `manufacturer/${item}`)}
              imgName={`manufacturer/${item}`}
              className={cx(
                'h-4 mobile:h-5 tablet:h-6 object-contain m-auto',
                'w-auto',
                'max-h-4 mobile:max-h-5 tablet:max-h-6',
                props?.styles?.img
              )}
            />
          );
        })}
      </div>
    ) : null;
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);

export default ManufacturerList;
