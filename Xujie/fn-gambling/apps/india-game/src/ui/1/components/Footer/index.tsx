import {
  LinkInfo,
  useFooterStore,
} from '@mode2/zustand/components/footerStore';
import { SocialList } from '@components/SocialList';
import { SocialScenarios } from '@mode2/zustand/components/socialListStore';
import { CustomerServiceList } from '@components/CustomerServiceList';
import { CustomerServiceScenarios } from '@mode2/zustand/components/customerServiceListStore';
import { BackTopButton } from '@components/BackTopButton';
import { useBreakPoint } from '@libs/commonUtils';
import cx from '@commonUtils/cx';
import { forwardRef, Ref, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ManufacturerList } from '@components/ManufacturerList';
import { memo } from 'react';
import renderI18N from '@libs/commonUtils/renderI18N';

interface HyperLinkInfo extends LinkInfo {
  isDecorate: boolean;
}

const DecorateLink: HyperLinkInfo = {
  labelKey: { i18nKey: '' },
  icon: '',
  isAction: false,
  onActionClick: () => {},
  isDecorate: true,
};
export const Footer = memo(
  forwardRef((_, ref: Ref<HTMLDivElement>) => {
    const { isDesktop } = useBreakPoint();
    const { t } = useTranslation();
    const isDisplayFooter = useFooterStore((state) => state.isDisplayFooter);
    const hyperlinks = useFooterStore((state) => state.hyperlinks);
    const introduction = useFooterStore((state) => state.introduction);
    const copyrightInfo = useFooterStore((state) => state.copyrightInfo);
    const customerServiceTitle = useFooterStore(
      (state) => state.customerServiceTitle
    );
    const hyperlinkItems: HyperLinkInfo[] = useMemo(() => {
      const result: HyperLinkInfo[] = hyperlinks.flatMap((item, index) =>
        index < hyperlinks.length - 1
          ? [
              { ...item, isDecorate: false },
              { ...DecorateLink, label: `${index}` },
            ]
          : [{ ...item, isDecorate: false }]
      );
      return isDesktop
        ? hyperlinks.map((item) => ({ ...item, isDecorate: false }))
        : result;
    }, [hyperlinks, isDesktop]);

    return isDisplayFooter ? (
      <footer
        ref={ref}
        id={'footer'}
        className={cx(
          'flex flex-col ',
          'gap-9 mobile:gap-6',
          'justify-center items-center',
          'bgi-text-[var(--grayscale-50)] text-center',
          'bgi-[var(--grayscale-10)] border-t border-[var(--grayscale-30)]'
        )}
      >
        <div
          className={cx(
            'm-auto max-w-[1200px] ',
            'px-4 pt-3 mobile:pt-6 desktop:pt-8'
          )}
        >
          <div className={cx('flex flex-col gap-9', 'tablet:text-start')}>
            {/* 區塊一 */}
            <div
              className={
                'flex flex-col tablet:flex-row justify-between gap-6 mobile:gap-3 w-full '
              }
            >
              {hyperlinkItems.length > 0 ? (
                <div
                  className={cx(
                    'flex justify-center tablet:justify-start h-full',
                    'flex-row tablet:flex-col',
                    'gap-4 tablet:gap-2 bgi-text-[var(--grayscale-100)]',
                    'basis-[37.1024%]'
                  )}
                >
                  {hyperlinkItems.map((item, index) => {
                    return item.isDecorate ? (
                      <div
                        key={`${renderI18N(item.labelKey, t)}_${index}`}
                        className={'bgi-[var(--grayscale-100)] h-auto w-[1px]'}
                      ></div>
                    ) : (
                      <div
                        key={renderI18N(item.labelKey, t)}
                        className={cx(
                          'text-sm mobile:text-base font-medium flex',
                          item.isAction ? 'cursor-pointer' : '',
                          'no-underline tablet:underline'
                        )}
                        onClick={item.onActionClick}
                      >
                        {renderI18N(item.labelKey, t)}
                      </div>
                    );
                  })}
                </div>
              ) : null}

              <div className="flex flex-col tablet:flex-row gap-6 mobile:gap-3 basis-[62.8976%]'">
                <div className={'text-white text-xs mobile:text-sm'}>
                  {customerServiceTitle}
                </div>

                <CustomerServiceList
                  className={'justify-center tablet:justify-start'}
                  scenarios={CustomerServiceScenarios.FOOTER}
                />
              </div>
            </div>

            {/* 區塊二 */}
            <div
              className={cx(
                'flex flex-col gap-1 bgi-[var(--grayscale-15)]',
                'px-5 py-3 tablet:px-4',
                'rounded tablet:rounded-lg'
              )}
            >
              <SocialList
                className={'justify-center tablet:justify-start'}
                scenarios={SocialScenarios.FOOTER}
              />
              <div className={'flex flex-col gap-1'}>
                <div>{t('footer_about_us')}</div>
                <div className={'h-[1px] bgi-[var(--grayscale-50)]'}></div>
                <div className={'text-sm'}>
                  {introduction.map((item, index) => (
                    <p key={`${index}`}>{item}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 區塊三 */}
          <div className={'mt-3'}>
            <ManufacturerList sceneFrom={'footer'} />
          </div>

          <div className={'text-xs mt-5'}>{copyrightInfo}</div>
        </div>

        {!isDesktop ? (
          <div
            className={
              'w-full justify-content flex flex-col items-center mt-3 mobile:mt-6 w-auto -mx-4'
            }
          >
            <BackTopButton className={' mt-7 mobile:mt-3 mb-12'} />
          </div>
        ) : null}
      </footer>
    ) : (
      <></>
    );
  })
);
