import { cx } from '@libs/commonUtils';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { CONTAINER_CLASS, FLEX_COL } from '@libs/constant/style';
import { useTranslation } from 'react-i18next';
import RulesImgTitle from '@components/RulesImgTitle';
import RulesContainer from '@components/RulesContainer';

export const TeamClubRulesDescriptionOfAgentLevels = () => {
  const { t } = useTranslation();
  return (
    <div
      className={cx(
        CONTAINER_CLASS,
        'bgi-border-[var(--linear-15)] border',
        'rounded-lg',
        'mt-6 bgi-[var(--base-2-variant11)]'
      )}
    >
      <RulesImgTitle
        className="-mt-6 z-[2]"
        classNameText="text-lg"
        title={{ i18nKey: 'earn_rules_title_agent_levels_description' }}
        classNameSub="w-[360px] h-[42px] !m-0"
        classNameImg="h-full"
      />

      <RulesContainer
        className="w-full"
        children={
          <div className={cx('w-full', FLEX_COL, 'gap-4')}>
            <img
              src={getImgUrl(EResourceLevel.V, 'rules_level_m')}
              alt="Level_diagram_image"
              className={cx('w-full', 'block', 'px-4')}
            />

            <div
              className={cx(
                'w-full px-4',
                'bgi-text-[var(--base-2-variant1)]',
                'text-base font-medium'
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

            {/*/!* 分隔線 *!/*/}
            {/*<div*/}
            {/*  className={cx('w-full h-px', 'bgi-[var(--transparent-white-10)]')}*/}
            {/*></div>*/}

            <div
              className={cx(
                'w-full',
                'px-3 py-2.5',
                'bgi-border-[var(--linear-15)] border',
                'rounded-lg'
              )}
            >
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
