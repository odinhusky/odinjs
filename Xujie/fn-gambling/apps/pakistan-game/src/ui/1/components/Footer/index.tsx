import { useFooterStore } from '@mode2/zustand/components/footerStore';
import { SocialList } from '@components/SocialList';
import { SocialScenarios } from '@mode2/zustand/components/socialListStore';
import { CustomerServiceList } from '@components/CustomerServiceList';
import { CustomerServiceScenarios } from '@mode2/zustand/components/customerServiceListStore';
import cx from '@commonUtils/cx';
import { useTranslation } from 'react-i18next';
import { ManufacturerList } from '@components/ManufacturerList';
import { forwardRef, memo, Ref } from 'react';
import renderI18N from '@libs/commonUtils/renderI18N';
import { useDeepEffect, useObserverElementMetrics } from '@libs/commonUtils';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';

export const Footer = memo(
  forwardRef((_, ref: Ref<HTMLDivElement>) => {
    const { t } = useTranslation();
    const isDisplayFooter = useFooterStore((state) => state.isDisplayFooter);
    const hyperlinks = useFooterStore((state) => state.hyperlinks);
    const introduction = useFooterStore((state) => state.introduction);
    const copyrightInfo = useFooterStore((state) => state.copyrightInfo);
    const customerServiceTitle = useFooterStore(
      (state) => state.customerServiceTitle
    );

    return isDisplayFooter ? (
      <footer
        ref={ref}
        id={'footer'}
        className={cx(
          'text-left',
          'bgi-text-[var(--grayscale-50)] border-t bgi-border-t-[var(--base-1-main)] bgi-[var(--grayscale-10)]'
        )}
      >
        <div
          className={cx(
            'm-auto max-w-[1200px] ',
            'px-2 pt-3 mobile:px-4 mobile:pt-6 tablet:px-5 tablet:pt-9 box-border'
          )}
        >
          <div
            className={cx(
              'flex flex-col tablet:flex-row gap-6 mobile:gap-3',
              'tablet:text-start'
            )}
          >
            {/* 區塊一 */}
            <div className="tablet:flex-1">
              {hyperlinks.length ? (
                <div
                  className="text-xs mobile:text-sm font-medium mb-1 bgi-text-[var(--grayscale-100)]"
                  onClick={hyperlinks[1].onActionClick}
                >
                  {renderI18N(hyperlinks[1].labelKey, t)}
                </div>
              ) : null}
              <div className="text-sm mobile:text-base font-medium mb-2">
                {customerServiceTitle}
              </div>
              <CustomerServiceList
                className="justify-start gap-2"
                imgClassName="w-9 h-9 mobile:w-10 mobile:h-10"
                scenarios={CustomerServiceScenarios.FOOTER}
              />
              {hyperlinks.length ? (
                <div
                  className="mt-6 mobile:mt-3 text-xs mobile:text-sm font-medium underline bgi-text-[var(--grayscale-100)]"
                  onClick={hyperlinks[2].onActionClick}
                >
                  {renderI18N(hyperlinks[2].labelKey, t)}
                </div>
              ) : null}
            </div>
            {/* 區塊二 */}
            <div
              className={cx(
                'py-3 px-5 box-border',
                'flex flex-col gap-2 basis-[62.8976%]',
                'bgi-[var(--grayscale-15)] rounded-xl'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="text-xs mobile:text-sm shrink-0">
                  {t('footer_about_us')}
                </div>
                <SocialList
                  className="justify-center tablet:justify-start shrink-0 gap-1"
                  imgClassName="w-6 h-6 mobile:w-7 mobile:h-7"
                  scenarios={SocialScenarios.FOOTER}
                />
              </div>
              <div className={'flex flex-col gap-2'}>
                <div className={'h-[1px] bgi-[var(--grayscale-50)]'}></div>
                <div className="text-xs mobile:text-sm bgi-text-[var(--grayscale-50)]">
                  {introduction.map((item, index) => (
                    <p key={`${index}`} className="mb-2">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 區塊三 */}
          <div className={'mt-6 mobile:mt-3 tablet:mt-5'}>
            <ManufacturerList sceneFrom={'footer'} />
          </div>

          <div className={'text-xs mobile:text-sm text-center mt-5'}>
            {copyrightInfo}
          </div>
        </div>
      </footer>
    ) : (
      <></>
    );
  })
);
