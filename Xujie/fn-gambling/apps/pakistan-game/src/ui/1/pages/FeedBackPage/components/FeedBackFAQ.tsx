import { useMode2FeedBackPageFAQStore } from '@mode2/zustand/page/feedbackPageStore';
import '../index.scss';
import { useTranslation } from 'react-i18next';
import { cx } from '@libs/commonUtils';
import renderI18N from '@libs/commonUtils/renderI18N';
import { FLEX_COL, FLEX_JUSTIFY_CENTER } from '@libs/constant/style';

export const FeedBackFAQ = () => {
  const { t } = useTranslation();

  const faqList = useMode2FeedBackPageFAQStore((state) => state.faqList);

  return (
    <div
      className={cx(
        'faq',
        FLEX_COL,
        'tablet:gap-4 mobile:gap-5 gap-3',
        'tablet:p-6 mobile:pt-5 mobile:px-6 mobile:pb-10 pt-3 px-4 pb-6',
        'tablet:bgi-[var(--grayscale-25)]',
        'tablet:rounded-b-lg'
      )}
    >
      {faqList.map((item, index) => (
        <div
          className={cx(
            'faq-item',
            'bgi-[var(--grayscale-20)]',
            FLEX_JUSTIFY_CENTER,
            'flex-col items-start',
            'tablet:rounded-lg rounded',
            'tablet:p-3 mobile:py-3 mobile:px-6 py-2 px-3',
            'tablet:gap-2 mobile:gap-3 gap-2'
          )}
          key={`faq - ${index}`}
        >
          <div
            className={cx(
              'text-base mobile:text-lg',
              'bgi-text-[var(--state-warn-main)]'
            )}
          >
            {renderI18N(item.titleKey, t)}
          </div>

          <div className="pl-5">
            {item.desc.length > 1 ? (
              <ol className="list-decimal">
                {item.desc.map((item, i) => {
                  return (
                    <li
                      className={cx(
                        'bgi-text-[var(--grayscale-100)]',
                        'text-sm mobile:text-base'
                      )}
                      key={`${item.i18nKey} - ${i}`}
                    >
                      {renderI18N(item, t)}
                    </li>
                  );
                })}
              </ol>
            ) : (
              item.desc.map((item, i) => {
                return (
                  <ol className="list-decimal" key={`faq - desc - ${i}`}>
                    {renderI18N(item, t)
                      .split('\n')
                      .map((line, lineIndex) => (
                        <li
                          className={cx(
                            'bgi-text-[var(--grayscale-100)]',
                            'text-sm mobile:text-base'
                          )}
                          key={`${item.i18nKey} - ${lineIndex}`}
                        >
                          {line}
                          <br />
                        </li>
                      ))}
                  </ol>
                );
              })
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedBackFAQ;
