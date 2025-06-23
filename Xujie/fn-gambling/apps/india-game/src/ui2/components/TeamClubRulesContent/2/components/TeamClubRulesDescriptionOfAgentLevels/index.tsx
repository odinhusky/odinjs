import { cx } from '@libs/commonUtils';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { CONTAINER_CLASS, FLEX_COL } from '@libs/constant/style';
import { useTranslation } from 'react-i18next';
import RulesImgTitle from '@components/RulesImgTitle';
import RulesContainer from '@components/RulesContainer';

export const TeamClubRulesDescriptionOfAgentLevels = () => {
  const { t } = useTranslation();
  return (
    <div className={cx(CONTAINER_CLASS)}>
      <RulesImgTitle
        classNameText="text-lg"
        title={{ i18nKey: 'earn_rules_title_agent_levels_description' }}
      />

      <RulesContainer
        className="w-full p-3"
        children={
          <div className={cx('w-full', FLEX_COL, 'gap-4')}>
            <img
              src={getImgUrl(EResourceLevel.V, 'rules_level_m')}
              alt="Level diagram image"
              className={cx('w-full', 'block')}
            />

            <div
              className={cx(
                'w-full',
                'bgi-text-[var(--grayscale-100)]',
                'text-sm font-medium'
              )}
            >
              <span className={cx('w-full block')}>
                {t('earn_rules_agent_levels_description_a')}
              </span>
              <span className={cx('w-full block')}>
                {t('earn_rules_agent_levels_description_b')}
              </span>
              <span className={cx('w-full block')}>
                {t('earn_rules_agent_levels_description_c')}
              </span>
            </div>

            {/* 分隔線 */}
            <div
              className={cx('w-full h-px', 'bgi-[var(--transparent-white-10)]')}
            ></div>

            <div className={cx('w-full')}>
              <p
                className={cx(
                  'bgi-text-[var(--grayscale-100)]',
                  'text-sm font-normal'
                )}
              >
                *{t('earn_rules_agent_levels_description_note')}
              </p>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default TeamClubRulesDescriptionOfAgentLevels;
