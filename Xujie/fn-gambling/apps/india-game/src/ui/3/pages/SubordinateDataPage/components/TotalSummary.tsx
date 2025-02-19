import Icon from '@components/Icon';
import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { formatNumber } from '@libs/mode2/utils';
import QuestionTooltip from '@components/QuestionTooltip';

// TODO Ronan
// TODO i18n
// TODO api
export const TeamClubLevelSummary = () => {
  const cardClassName =
    FLEX_CENTER +
    ' flex-col gap-3 flex-1 py-4 px-3 box-border border border-[var(--base-1-main)] bgi-[var(--base-2-variant5)] rounded-lg';

  return (
    <div className={cx('flex gap-3 bgi-text-[var(--grayscale-100)]')}>
      <div className={cx(cardClassName)}>
        <div className={cx(FLEX_ITEMS_CENTER, 'gap-3')}>
          <span className={cx('text-lg font-medium')}>Club Stars</span>
          <QuestionTooltip
            title={
              'You and all your agents from your club. The higher the star level of the club, the higher the commission rate.'
            }
            btnClassName="p-0 mb-2"
            iconName="ic_tips_fill"
            iconClassName="w-6 h-6"
          />
        </div>
        <div className="py-0.5 px-8 box-border rounded-full bgi-border-[var(--base-1-variant1)]">
          <Icon name="ic_member" className="w-[21px] h-[21px]" />
        </div>
      </div>
      <div className={cx(cardClassName)}>
        <span className={cx('text-lg font-medium')}>Total Number</span>
        <div className={cx(FLEX_ITEMS_CENTER, 'gap-3')}>
          <Icon name="ic_member" className="w-[24px] h-[24px]" />
          <span className="text-lg font-bold">{formatNumber(3000)}</span>
        </div>
      </div>
    </div>
  );
};

export default TeamClubLevelSummary;
