import cx from '@commonUtils/cx';
import renderI18N from '@libs/commonUtils/renderI18N';
import { handleRecordPageSwitchRecordListTabClick } from '@mode2/action/actionTypes';
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
    <div
      className="grid grid-cols-3 bgi-[var(--grayscale-15)] justify-between
          font-semibold text-sm mobile:text-base
          tablet:rounded-lg rounded-none
          py-2 px-3"
    >
      {listSwitchTabList.map((data, index) => {
        return (
          <button
            key={index}
            className={cx(
              'border-b-2 border-transparent p-1 w-full bgi-text-[var(--grayscale-50)]',
              {
                'bgi-border-b-[var(--base-1-main)]':
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
                'bgi-text-[var(--base-1-main)]':
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
