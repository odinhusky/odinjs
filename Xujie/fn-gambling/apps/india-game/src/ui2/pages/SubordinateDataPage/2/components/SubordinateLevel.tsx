import { cx } from '@libs/commonUtils';
import { handleSubordinateDataLevelClick } from '@mode2/action/actionTypes';
import useSubordinateDataClickActions from '@libs/mode2/action/subordinateDataAction/useSubordinateDataClickActions';
import Icon from '@components/Icon';
import { formatMoney } from '@libs/mode2/utils';
import { useMode2SubordinateDataPageStore } from '@libs/mode2/zustand/page/SubordinateDataStore';
import { t } from 'i18next';

export const SubordinateLevel = () => {
  const { handleSubordinateDataClick } = useSubordinateDataClickActions();
  const teamMemberSummaryData = useMode2SubordinateDataPageStore(
    (state) => state.teamMemberSummaryData
  );
  const sortByTier = useMode2SubordinateDataPageStore(
    (state) => state.sortByTier
  );

  return (
    <div className="flex justify-between rounded bgi-[var(--transparent-white-10)]">
      {teamMemberSummaryData &&
        teamMemberSummaryData.subordinateLevelItems &&
        teamMemberSummaryData.subordinateLevelItems.map((item, index) => (
          <div
            className={cx(
              'flex-1 py-2 rounded flex flex-col items-center bgi-text-[var(--transparent-white-70)] cursor-pointer',
              {
                'bgi-[var(--base-1-main)]': sortByTier === index,
              }
            )}
            key={index}
            onClick={() => {
              handleSubordinateDataClick({
                actionName: handleSubordinateDataLevelClick,
                payload: { value: index, hasMember: false },
              });
            }}
          >
            <span className="text-xs mobile:text-sm tablet:text-base font-medium">
              {t('earn_subordinate_data_level')} {item.tier}
            </span>
            <div className="flex items-center mt-1">
              <Icon
                className={
                  'w-3 h-3 mobile:w-4 mobile:h-4 tablet:w-5 tablet:h-5'
                }
                name="ic_member"
                color={'var(--transparent-white-70)'}
              />
              <span
                className={cx(
                  'text-sm mobile:text-base tablet:text-lg font-medium ml-1 bgi-text-[var(--linear-2)]'
                )}
              >
                {formatMoney({
                  value: item.members,
                  showCurrency: false,
                })}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
};
