import { cx } from '@libs/commonUtils';
import { handleSubordinateDataLevelClick } from '@libs/mode2/action/subordinateDataAction/actionType';
import useSubordinateDataClickActions from '@libs/mode2/action/subordinateDataAction/useSubordinateDataClickActions';
import Icon from '@components/Icon';
import { formatNumber } from '@libs/mode2/utils';
import { useMode2SubordinateDataPageStore } from '@libs/mode2/zustand/page/SubordinateDataStore';
import { t } from 'i18next';
import RedDot from '@components/RedDot';

export const SubordinateLevel = () => {
  const { handleSubordinateDataClick } = useSubordinateDataClickActions();
  const teamMemberSummaryData = useMode2SubordinateDataPageStore(
    (state) => state.teamMemberSummaryData
  );
  const sortByTier = useMode2SubordinateDataPageStore(
    (state) => state.sortByTier
  );

  return (
    <div className="flex justify-between  gap-3">
      {teamMemberSummaryData &&
        teamMemberSummaryData.subordinateLevelItems &&
        teamMemberSummaryData.subordinateLevelItems.map((item, index) => (
          <div
            className={cx(
              'flex-1 p-2 rounded-lg flex flex-col items-center bgi-text-[var(--grayscale-100)] cursor-pointer',
              'relative',
              'border border-transparent bgi-[var(--base-2-variant5)]',
              {
                'border-[var(--base-1-main)]': sortByTier === index,
              }
            )}
            key={index}
            onClick={() => {
              handleSubordinateDataClick({
                actionName: handleSubordinateDataLevelClick,
                payload: { value: index },
              });
            }}
          >
            <span className="text-base font-medium">
              {t('earn_subordinate_data_level')} {item.tier}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Icon
                className={'w-5 h-5'}
                name="ic_member"
                color={'var(--transparent-white-70)'}
              />
              <span className={cx('text-sm font-bold')}>
                {formatNumber(item.members)}
              </span>
            </div>

            {/* TODO Ronan  有新成員顯示紅點 */}
            <RedDot className="w-2 h-2 absolute top-0 right-0" />
          </div>
        ))}
    </div>
  );
};
