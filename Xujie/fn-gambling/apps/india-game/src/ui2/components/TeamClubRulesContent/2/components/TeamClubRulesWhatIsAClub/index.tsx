import { cx } from '@libs/commonUtils';
import { CONTAINER_CLASS, FLEX_CENTER, FLEX_COL } from '@libs/constant/style';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useTranslation } from 'react-i18next';
import RulesImgTitle from '@components/RulesImgTitle';
import RulesContainer from '@components/RulesContainer';

export const TeamClubRulesWhatIsAClub = () => {
  const { t } = useTranslation();

  return (
    <div className={cx(CONTAINER_CLASS)}>
      <RulesImgTitle title={{ i18nKey: 'earn_rules_title_what_is_a_club' }} />

      <RulesContainer
        className="w-full"
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

              <img
                src={getImgUrl(EResourceLevel.V, 'rules_level_m')}
                alt="Level diagram image"
                className={cx('w-full', 'block')}
              />
            </div>

            <div
              className={cx(
                'bgi-[var(--linear-4)]',
                'rounded-b-lg',
                'w-full h-10',
                FLEX_CENTER
              )}
            >
              <span
                className={cx(
                  'bgi-text-[var(--linear-2)]',
                  'text-base font-medium'
                )}
              >
                {t('earn_rules_content_what_is_note')}
              </span>
            </div>
          </>
        }
      />
    </div>
  );
};

export default TeamClubRulesWhatIsAClub;
