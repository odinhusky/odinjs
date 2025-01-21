import { useFooterStore } from '@mode2/zustand/components/footerStore';
import useFooterAction from '@mode2/action/components/footer/useFooterAction';

import { handleFooterHyperlinkActionClick } from '@mode2/action/components/footer/acitonType';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import sdkUtils from '@mode2/utils/sdk';
import { useBreakPoint } from '@libs/commonUtils';

export const useFooterBase = () => {
  const deviceBreakPoint = useBreakPoint();
  const { t, i18n } = useTranslation();

  const { handleFooterClick } = useFooterAction();
  const setDisplayFooter = useFooterStore((state) => state.setDisplayFooter);
  const displayConfig = useFooterStore((state) => state.displayConfig);

  const setHyperlinks = useFooterStore((state) => state.setHyperlinks);

  const setIntroduction = useFooterStore((state) => state.setIntroduction);

  const productName = sdkUtils.productName();
  const setCopyrightInfo = useFooterStore((state) => state.setCopyrightInfo);
  const setCustomerServiceTitle = useFooterStore(
    (state) => state.setCustomerServiceTitle
  );

  useEffect(() => {
    setDisplayFooter(
      (displayConfig.isDesktop && deviceBreakPoint.isDesktop) ||
        (displayConfig.isTablet && deviceBreakPoint.isTablet) ||
        (displayConfig.isMobile && deviceBreakPoint.isMobile)
    );
  }, [displayConfig, deviceBreakPoint]);

  useEffect(() => {
    setHyperlinks([
      {
        labelKey: { i18nKey: 'footer_about_us' },
        icon: '',
        isAction: false,
        onActionClick: () => {},
      },
      {
        labelKey: { i18nKey: 'footer_contact_us' },
        icon: '',
        isAction: false,
        onActionClick: () => {},
      },
      {
        labelKey: { i18nKey: 'footer_privacy_policy' },
        icon: '',
        isAction: true,
        onActionClick: () => {
          handleFooterClick({
            actionName: handleFooterHyperlinkActionClick,
            payload: { isLink: false, target: BasePagePathObj.PolicyPage },
          });
        },
      },
    ]);

    setCustomerServiceTitle(
      t('footer_gamename_will_answer', { productName: productName })
    );

    setIntroduction([
      t('footer_welcome_to_1', { productName: productName }),
      t('footer_welcome_to_2', { productName: productName }),
      t('footer_welcome_to_3', { productName: productName }),
      t('footer_welcome_to_4'),
    ]);

    setCopyrightInfo(
      `Copyright © ${
        new Date().getFullYear() - 4
      }-${new Date().getFullYear()} Ganarhora. All rights reserved.`
    );
  }, [i18n.language]);
};
