import cx from '@commonUtils/cx';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';
import InnerHtmlWrapper from '@components/InnerHtmlWrapper';
import { useActivityDetailPageStore } from '@mode2/zustand/page/ActivityDetailPage/useActivityDetailPageStore';
import { useTemplateLayoutStore } from '@mode2/zustand/template/templateLayoutStore';

export const DynamicActivityContent = () => {
  const currentDynamicContent = useActivityDetailPageStore(
    (state) => state.currentDynamicContent
  );

  const headerElMetrics = useTemplateLayoutStore(
    (state) => state.headerElMetrics
  );
  return (
    <div
      className={cx(
        MOBILE_BREAK_POINT_MAX_WIDTH,
        '-mx-4 -mb-4',
        'bgi-[var(--background-middle)]',
        'flex flex-col gap-3 p-4'
      )}
      style={{
        height: `calc(100vh - ${headerElMetrics.height}px)`,
      }}
    >
      {currentDynamicContent.bannerUrl ? (
        <BaseCacheImg
          className={'object-contain'}
          src={currentDynamicContent.bannerUrl}
          imgName={`currentDynamicContent.bannerUrl`}
        />
      ) : null}

      <InnerHtmlWrapper
        className={'h-full overflow-y-auto'}
        __html={currentDynamicContent.innerHtml}
      />
    </div>
  );
};

export default DynamicActivityContent;
