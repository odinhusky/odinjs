import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_COL, CONTAINER_CLASS } from '@libs/constant/style';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useTranslation } from 'react-i18next';
import RulesImgTitle from '@components/RulesImgTitle';
import RulesContainer from '@components/RulesContainer';

export const TeamClubRulesWhatIsAClub = () => {
  const { t } = useTranslation();

  return (
    <div className={cx(CONTAINER_CLASS)}>
      <RulesImgTitle
        title={{ i18nKey: 'earn_rules_title_what_is_a_club' }}
        classNameSub="w-[360px] h-[42px] !m-0"
        classNameImg="h-full"
      />

      <RulesContainer
        className="w-full bgi-[var(--base-2-variant11)]"
        children={
          <>
            <div className={cx(FLEX_COL, 'gap-3', 'p-3')}>
              <span
                className={cx(
                  'block',
                  'bgi-text-[var(--grayscale-100)]',
                  'text-sm'
                )}
              >
                {t('earn_my_rewards_club_level_tips')}
              </span>
            </div>

            <div
              className={cx(
                // 'bgi-[var(--base-2-variant11)]',
                'bgi-border-[var(--linear-15)] border',
                'rounded-lg'
              )}
            >
              <img
                className={cx('w-auto', 'block', 'py-8 px-4')}
                alt="Level_diagram_image"
                src={getImgUrl(EResourceLevel.V, 'rules_level_m')}
              />

              <div className={cx()} />

              <div
                className={cx(
                  // 'bgi-[var(--linear-15)]',
                  'bgi-border-[var(--linear-15)] border-t',
                  'rounded-b-lg',
                  'w-full px-3 py-2',
                  FLEX_CENTER
                )}
              >
                <span
                  className={cx(
                    'bgi-text-[var(--base-1-main)]',
                    'text-2xl font-bold'
                  )}
                >
                  {t('earn_rules_content_what_is_note')}
                </span>
              </div>
            </div>
          </>
        }
      />
    </div>
  );
};

export default TeamClubRulesWhatIsAClub;
