import cx from '@commonUtils/cx';
import renderI18N from '@libs/commonUtils/renderI18N';
import { FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import Icon from '@components/Icon';
import { useMode2InvitePageStaticsStore } from '@mode2/zustand/page/invitePageStore';
import { isValidElement } from 'react';
import { useTranslation } from 'react-i18next';

export const StaticsQAList = () => {
  const { t } = useTranslation();

  const expandedIndex = useMode2InvitePageStaticsStore(
    (state) => state.expandedIndex
  );

  const qaList = useMode2InvitePageStaticsStore((state) => state.qaList);

  return (
    <div className={cx('w-full', FLEX_COL, 'hap-3 gap-3 mobile:gap-5')}>
      {qaList.map((v, i) => {
        return (
          <div
            className={cx(
              'rounded',
              'text-lg font-medium',
              FLEX_COL,
              'p-3 mobile:px-6',
              'bgi-[var(--grayscale-20)]'
            )}
            key={i}
          >
            <div
              className={cx(
                'qa-title',
                FLEX_ITEMS_CENTER,
                'justify-between',
                'w-full'
              )}
              onClick={() => {
                v.action();
              }} // 当qa-item被点击时，切换展开/收起状态
            >
              <div
                className={cx(
                  'qa-title-text',
                  'bgi-text-[var(--grayscale-100)]',
                  'text-base mobile:text-lg',
                  'font-medium'
                )}
              >
                {t(v.question.i18nKey, v.question?.i18nOption)}
              </div>

              <Icon
                className={cx('toggle-icon', {
                  'rotate-icon': i !== expandedIndex,
                })}
                name="ic_arrow_up_1"
              />
            </div>

            <div
              className={cx(
                FLEX_COL,
                'gap-3',
                'w-full',
                'overflow-hidden',
                'mt-3',
                { 'mt-0 h-0': i !== expandedIndex }
              )}
            >
              {v.answer.map((v, i) => {
                return (
                  <div key={i}>
                    {'i18nKey' in v ? (
                      <div
                        className={cx(
                          'bgi-text-[var(--grayscale-100)]',
                          'text-sm mobile:text-base'
                        )}
                      >
                        {renderI18N(v, t)}
                      </div>
                    ) : (
                      <div className={cx(v?.className)}>
                        {isValidElement(v.content)
                          ? v.content
                          : 'i18nKey' in v.content
                          ? renderI18N(v.content, t)
                          : ''}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StaticsQAList;
