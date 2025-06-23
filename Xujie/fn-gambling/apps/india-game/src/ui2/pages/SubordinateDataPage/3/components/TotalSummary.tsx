import Icon from '@components/Icon';
import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { EResourceLevel, formatMoney, getImgUrl } from '@libs/mode2/utils';
import { useMode2SubordinateDataPageStore } from '@libs/mode2/zustand/page/SubordinateDataStore';
import { clubLevelTable } from '@pages/TeamClubPage/const';
import { useTranslation } from 'react-i18next';
import QuestionTooltip from '@components/QuestionTooltip';

export const TeamClubLevelSummary = () => {
  const { t } = useTranslation();
  const teamMemberSummaryData = useMode2SubordinateDataPageStore(
    (state) => state.teamMemberSummaryData
  );
  const cardClassName =
    FLEX_CENTER +
    ' flex-col gap-3 flex-1 py-4 px-3 box-border border border-[var(--base-1-main)] bgi-[var(--base-2-variant5)] rounded-lg';

  return (
    <div className={cx('flex gap-3 bgi-text-[var(--grayscale-100)]')}>
      <div className={cx(cardClassName)}>
        <div className={cx(FLEX_ITEMS_CENTER, 'gap-3')}>
          <span className={cx('text-lg font-medium')}>
            {t('earn_my_rewards_my_team_club_level_title')}
          </span>
          <QuestionTooltip
            offset={[-9.5, 12.5]}
            title={t('earn_my_rewards_club_level_tips')}
            btnClassName="p-0 mb-2"
            iconName="ic_tips_fill"
            iconClassName="w-6 h-6"
            placement='bottomLeft'
          />
        </div>
        <img
          src={getImgUrl(
            EResourceLevel.V,
            clubLevelTable[(teamMemberSummaryData.level || 0) + 1].src
          )}
          alt="level_image"
          className="w-[82px] h-[26px]"
        />
      </div>
      <div className={cx(cardClassName)}>
        <span className={cx('text-lg font-medium')}>
          {t('earn_subordinate_data_total_number')}
        </span>
        <div className={cx(FLEX_ITEMS_CENTER, 'gap-3')}>
          <Icon name="ic_member" className="w-[24px] h-[24px]" />
          <span className="text-lg font-bold bgi-text-[var(--base-1-main)]">
            {formatMoney({
              value: teamMemberSummaryData.totalMembers || 0,
              showCurrency: false,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TeamClubLevelSummary;
