import { useMode2InvitePageRankingListStore } from '@mode2/zustand/page/invitePageStore';
import { useTranslation } from 'react-i18next';
import cx from '@commonUtils/cx';


export const RankingListRules = () => {
  const { t } = useTranslation();
  const ruleList = [
    t('earn_money_ranking_list_content_rule_1'),
    t('earn_money_ranking_list_content_rule_2'),
    t('earn_money_ranking_list_content_rule_3'),
    t('earn_money_ranking_list_content_rule_4'),
    t('earn_money_ranking_list_content_rule_5', { amount: '2,000' }),
    t('earn_money_ranking_list_content_rule_6')
  ];
  const showLastData = useMode2InvitePageRankingListStore(
    (state) => state.showLastData
  );

  return !showLastData ? (
    <div className={cx(
      'flex flex-col gap-1 rounded-lg',
      'px-3 py-2 mobile:px-6 mobile:py-3',
      'text-sm mobile:text-base',
      'bgi-text-[var(--grayscale-30)] bgi-[var(--grayscale-100)]'
    )}>
      <div
        className="text-base mobile:text-lg font-medium bgi-text-[var(--state-warn-main)]">
        {t('earn_money_ranking_list_note_title_rule')}
      </div>
      {ruleList.map((item) => {
        return (
          <div className="" key={`rule-item-${item}`}>
            {item}
          </div>
        );
      })}
    </div>
  ) : null;
};

export default RankingListRules;
