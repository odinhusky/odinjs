import { cx } from '@libs/commonUtils';
import fallbackImg from '@libs/constant/fallbackBase64';
import { handleActivityUnitClick } from '@libs/mode2/action/activityPageAction/actionType';
import useActivityPageActions from '@libs/mode2/action/activityPageAction/useActivityPageActions';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';
import { ActivityUnit } from '@libs/mode2/zustand/page/activityPageStore';
import React, { SyntheticEvent, useState } from 'react';

interface ActivityBannerImageProps extends ActivityUnit {
  className?: string;
}

export const ActivityBannerImage = (props: ActivityBannerImageProps) => {
  const [isError, setError] = useState(false);
  const { handleActivityPageClick } = useActivityPageActions();
  const handleOnError = (e: SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.visibility = 'hidden';
    e.currentTarget.style.maxHeight = '0px';
    setError(true);
  };
  const aspectClass = 'aspect-[2.2015209]'; // 597x263

  return (
    <div
      className="w-auto h-auto rounded-lg overflow-hidden"
      onClick={() => {
        handleActivityPageClick({
          actionName: handleActivityUnitClick,
          payload: { item: props },
        });
      }}
    >
      {isError ? (
        <div
          className={cx(
            'bgi-[var(--grayscale-20)] w-full h-full rounded-lg overflow-hidden',
            aspectClass,
            props.className
          )}
        >
          <img
            className="object-contain m-auto h-full"
            src={fallbackImg}
            alt="activity"
          />
        </div>
      ) : null}

      <BaseCacheImg
        src={props.bannerUrl}
        alt={`${props.type}_${props.title}`}
        className={cx(
          'w-full h-full object-cover overflow-hidden',
          aspectClass,
          props.className
        )}
        onLoad={() => {}}
        onError={(e) => {
          handleOnError(e);
        }}
      />
    </div>
  );
};

export default ActivityBannerImage;
