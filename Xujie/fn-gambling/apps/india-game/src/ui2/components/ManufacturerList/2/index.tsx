import { cx } from '@libs/commonUtils';
import { useFooterStore } from '@mode2/zustand/components/footerStore';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { memo, useRef } from 'react';
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
          'flex flex-wrap justify-center gap-4 tablet:gap-5 ',
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
                'h-4 mobile:h-5 tablet:h-6 object-contain ',
                'max-w-[140px] mobile:max-w-[150px]',
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
