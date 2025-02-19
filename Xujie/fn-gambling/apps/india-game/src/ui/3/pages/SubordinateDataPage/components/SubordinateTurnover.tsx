import { formatNumber } from '@libs/mode2/utils';
import { useMode2SubordinateDataPageStore } from '@libs/mode2/zustand/page/SubordinateDataStore';
import { t } from 'i18next';

export const SubordinateTurnover = () => {
  const teamMemberSummaryData = useMode2SubordinateDataPageStore(
    (state) => state.teamMemberSummaryData
  );

  const list = [
    {
      text: t('earn_subordinate_data_today'),
      amount: teamMemberSummaryData.subordinateSummary?.todayJoinCount || 0,
    },
    {
      text: t('earn_subordinate_data_yesterday'),
      amount: teamMemberSummaryData.subordinateSummary?.yesterdayJoinCount || 0,
    },
    {
      text: t('earn_subordinate_data_this_month'),
      amount: teamMemberSummaryData.subordinateSummary?.thisMonthJoinCount || 0,
    },
  ];

  return (
    <div className="flex justify-between rounded-lg bgi-[var(--base-2-variant8)]">
      {list.map((item, index) => (
        <div
          className="flex-1 py-2 box-border flex flex-col items-center"
          key={index}
        >
          <span className="text-lg font-medium bgi-text-[var(--base-2-variant1)]">
            {item.text}
          </span>
          <div className="text-xl mt-1 font-bold flex items-center bgi-text-[var(--base-1-main)]">
            +{formatNumber(item.amount)}
          </div>
        </div>
      ))}
    </div>
  );
};
