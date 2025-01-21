import cx from '@commonUtils/cx';
import renderI18N from '@libs/commonUtils/renderI18N';
import { handleRecordPageSwitchRecordListTabClick } from '@mode2/action/recordPageAction/acitonType';
import useRecordPageActions from '@mode2/action/recordPageAction/useRecordPageActions';
import { useRecordPageBalanceRecordStore } from '@mode2/zustand/page/recordPageStore';
import { useTranslation } from 'react-i18next';

export const RecordPageSwitchRecordListTabs = () => {
  const { t } = useTranslation();
  const activeListSwitchTabIndex = useRecordPageBalanceRecordStore(
    (state) => state.activeListSwitchTabIndex
  );

  const listSwitchTabList = useRecordPageBalanceRecordStore(
    (state) => state.listSwitchTabList
  );

  const { handleRecordPageClick } = useRecordPageActions();

  return (
    <div className="flex h-12 bgi-[var(--grayscale-15)] shadow-[0_4px_4px_0_#00000040] justify-between rounded font-semibold text-sm mobile:text-base tablet:rounded-lg">
      {listSwitchTabList.map((data, index) => {
        return (
          <button
            key={index}
            className={cx(
              'border-b-2 border-transparent p-1 w-full bgi-text-[var(--transparent-white-30)]',
              {
                'list-btn-select bgi-[var(--linear-1)]':
                  activeListSwitchTabIndex === index,
              },
              activeListSwitchTabIndex === 0
                ? 'rounded-bl tablet:rounded-bl-lg'
                : '',
              activeListSwitchTabIndex + 1 === listSwitchTabList.length
                ? 'rounded-br tablet:rounded-br-lg'
                : ''
            )}
            onClick={() => {
              handleRecordPageClick({
                actionName: handleRecordPageSwitchRecordListTabClick,
                payload: { index },
              });
            }}
          >
            <div
              className={cx({
                'bgi-text-[var(--base-2-main)]':
                  activeListSwitchTabIndex === index,
              })}
            >
              {typeof data === 'string' ? data : renderI18N(data, t)}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default RecordPageSwitchRecordListTabs;
