import { cx } from '@libs/commonUtils';
import { handleRecordPageHeaderTabIndexClick } from '@mode2/action/actionTypes';
import useRecordPageActions from '@libs/mode2/action/recordPageAction/useRecordPageActions';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import {
  RecordPageHeaderTabs,
  useRecordPageHeaderTabsStore,
} from '@libs/mode2/zustand/page/recordPageStore';

export const RecordPageRecordHeader = () => {
  const headerTabIndex = useRecordPageHeaderTabsStore(
    (state) => state.headerTabIndex
  );
  const { handleRecordPageClick } = useRecordPageActions();

  const list = [RecordPageHeaderTabs.DETAIL, RecordPageHeaderTabs.WITHDRAWAL];

  return (
    <div className="h-20 flex justify-center">
      {list.map((item, index) => {
        return (
          <div
            className={cx(
              'w-40 h-full text-base font-medium ',
              'relative flex items-center justify-center cursor-pointer',
              {
                'bgi-text-[var(--transparent-white-40)]':
                  headerTabIndex !== item,
                'bgi-text-[var(--grayscale-100)]': headerTabIndex === item,
              }
            )}
            key={index}
            onClick={() => {
              handleRecordPageClick({
                actionName: handleRecordPageHeaderTabIndexClick,
                payload: { index: item },
              });
            }}
          >
            {item}
            {headerTabIndex === item ? (
              <img
                className={cx('w-full', 'absolute bottom-0 left-0')}
                src={getImgUrl(EResourceLevel.ICONS, 'record_header')}
                alt="active"
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
