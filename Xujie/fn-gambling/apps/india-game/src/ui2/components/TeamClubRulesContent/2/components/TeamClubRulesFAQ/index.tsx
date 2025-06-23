import { cx } from '@libs/commonUtils';
import { FLEX_COL, CONTAINER_CLASS } from '@libs/constant/style';
import { I18NContent } from '@libs/mode2/@types/i18nType';
import renderI18N from '@libs/commonUtils/renderI18N';
import { useTranslation } from 'react-i18next';
import RulesImgTitle from '@components/RulesImgTitle';

interface ListOfQAUnit {
  q: I18NContent;
  a: I18NContent;
}

const listOfQA: ListOfQAUnit[] = [
  {
    q: { i18nKey: 'earn_rules_faq_q1_question' },
    a: { i18nKey: 'earn_rules_faq_q1_answer' },
  },
  {
    q: { i18nKey: 'earn_rules_faq_q2_question' },
    a: { i18nKey: 'earn_rules_faq_q2_answer' },
  },
  {
    q: { i18nKey: 'earn_rules_faq_q3_question' },
    a: { i18nKey: 'earn_rules_faq_q3_answer' },
  },
  {
    q: { i18nKey: 'earn_rules_faq_q4_question' },
    a: { i18nKey: 'earn_rules_faq_q4_answer' },
  },
  {
    q: { i18nKey: 'earn_rules_faq_q5_question' },
    a: { i18nKey: 'earn_rules_faq_q5_answer' },
  },
  {
    q: { i18nKey: 'earn_rules_faq_q6_question' },
    a: { i18nKey: 'earn_rules_faq_q6_answer' },
  },
];

export const TeamClubRulesFAQ = () => {
  const { t } = useTranslation();
  return (
    <div className={cx(CONTAINER_CLASS)}>
      <RulesImgTitle title={{ i18nKey: 'account_menu_faq' }} />

      <div className={cx('w-full', FLEX_COL, 'gap-3')}>
        {listOfQA.map((item, index, arr) => (
          <div key={index}>
            <div>
              {/* Question */}
              <div>
                <span
                  className={cx(
                    'block',
                    'w-full',
                    'text-sm font-medium',
                    'bgi-text-[var(--grayscale-100)]'
                  )}
                >
                  {renderI18N(item.q, t)}
                </span>
              </div>

              {/* Answer */}
              <div>
                <span
                  className={cx(
                    'block',
                    'w-full',
                    'text-sm font-normal',
                    'bgi-text-[var(--grayscale-70)]'
                  )}
                >
                  {renderI18N(item.a, t)}
                </span>
              </div>
            </div>

            {/* 分隔線 */}
            {arr.length - 1 >= index ? (
              <div
                className={cx(
                  'w-full h-px',
                  'bgi-[var(--transparent-white-10)]'
                )}
              ></div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamClubRulesFAQ;
