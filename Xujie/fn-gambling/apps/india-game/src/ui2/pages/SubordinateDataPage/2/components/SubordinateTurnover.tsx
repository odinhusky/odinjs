import { cx } from '@libs/commonUtils';
import { formatMoney } from '@libs/mode2/utils';
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
    <div className="flex justify-between rounded-lg border bgi-border-[var(--base-1-light)] bgi-[var(--linear-1)]">
      {list.map((item, index) => (
        <div
          className="flex-1 py-2 box-border flex flex-col items-center bgi-text-[var(--transparent-white-70)]"
          key={index}
        >
          <span className="text-xs mobile:text-sm tablet:text-base">
            {item.text}
          </span>
          <div className="text-xl mt-1 font-semibold flex items-center bgi-text-[var(--linear-2)]">
            <span>+</span>
            <span className={cx('ml-1')}>
              {formatMoney({ value: item.amount, showCurrency: false })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
