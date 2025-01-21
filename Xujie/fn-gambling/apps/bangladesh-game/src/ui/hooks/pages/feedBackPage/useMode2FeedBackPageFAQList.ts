import sdkUtils from '@libs/mode2/utils/sdk';
import { useMode2FeedBackPageFAQStore } from '@mode2/zustand/page/feedbackPageStore';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useMode2FeedBackPageFAQList = () => {
  const setFaqList = useMode2FeedBackPageFAQStore((state) => state.setFaqList);
  const { t } = useTranslation();
  const productName = sdkUtils.productName();

  useEffect(() => {
    const faqList = [
      {
        titleKey: {
          i18nKey:
            'help_center_faq_how_to_create_title',
        },
        desc: [
          {
            i18nKey:
              'help_center_faq_how_to_create_content',
            i18nOption: { productName },
          },
        ],
      },
      {
        titleKey: {
          i18nKey:
            'help_center_faq_how_to_place_title',
        },
        desc: [
          {
            i18nKey:
              'help_center_faq_how_to_place_content',
          },
        ],
      },
      {
        titleKey: {
          i18nKey:
            'help_center_faq_check_my_betting_title',
        },
        desc: [
          {
            i18nKey:
              'help_center_faq_check_my_betting_content',
          },
        ],
      },
      {
        titleKey: {
          i18nKey:
            'help_center_faq_join_group_title',
        },
        desc: [
          {
            i18nKey:
              'help_center_faq_join_group_content',
            i18nOption: { productName },
          },
        ],
      },
      {
        titleKey: {
          i18nKey:
            'help_center_faq_how_to_make_money_title',
        },
        desc: [
          {
            i18nKey:
              'help_center_faq_how_to_make_money_content',
          },
        ],
      },
      {
        titleKey: {
          i18nKey: 'help_center_faq_check_my_vip_title',
        },
        desc: [
          {
            i18nKey:
              'help_center_faq_check_my_vip_content',
          },
        ],
      },
      {
        titleKey: {
          i18nKey:
            'help_center_faq_how_to_withdraw_cash_title',
        },
        desc: [
          {
            i18nKey:
              'help_center_faq_how_to_withdraw_cash_content',
          },
        ],
      },
      {
        titleKey: {
          i18nKey:
            'help_center_faq_how_to_recharge_title',
        },
        desc: [
          {
            i18nKey:
              'help_center_faq_div_how_to_recharge_div_content_click_deposit_1',
          },
          {
            i18nKey:
              'help_center_faq_div_how_to_recharge_div_content_click_deposit_2',
          },
          {
            i18nKey:
              'help_center_faq_div_how_to_recharge_div_content_click_deposit_3',
          },
        ],
      },
      {
        titleKey: {
          i18nKey:
            'help_center_faq_withdrawal_title',
        },
        desc: [
          {
            i18nKey:
              'help_center_faq_withdrawal_content',
          },
        ],
      },
      {
        titleKey: {
          i18nKey:
            'help_center_faq_the_recharge_title',
        },
        desc: [
          {
            i18nKey:
              'help_center_faq_the_recharge_content',
          },
        ],
      },
    ];

    setFaqList(faqList);
  }, [t]);
};
export default useMode2FeedBackPageFAQList;
