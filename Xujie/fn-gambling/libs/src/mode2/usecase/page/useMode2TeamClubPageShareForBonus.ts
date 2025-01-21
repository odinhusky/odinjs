import { useEffect } from 'react';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import sdkUtils from '@libs/mode2/utils/sdk';
import { useMode2TeamClubPageShareForBonusStore } from '@mode2/zustand/page/teamClubPageStore';

export const useMode2TeamClubPageShareForBonus = () => {
  const productName = sdkUtils.productName();
  const setEarnStepList = useMode2TeamClubPageShareForBonusStore(
    (state) => state.setEarnStepList
  );

  useEffect(() => {
    const earnStepList = [
      {
        id: 'Earn Step 1',
        title: {
          i18nKey: 'earn_money_invite_to_earn_share_your_referral_link',
        },
        url: getImgUrl(EResourceLevel.V, 'earn_step_1'),
        desc: {
          i18nKey: 'earn_money_invite_to_earn_just_copy_or_screenshot',
        },
      },
      {
        id: 'Earn Step 2',
        title: {
          i18nKey: 'earn_money_invite_to_earn_get_your_friends',
        },
        url: getImgUrl(EResourceLevel.V, 'earn_step_2'),
        desc: {
          i18nKey: 'earn_money_invite_to_earn_you_can_check',
        },
      },
      {
        id: 'Earn Step 3',
        title: {
          i18nKey: 'earn_money_invite_to_earn_start_earning_daily_commission',
        },
        url: getImgUrl(EResourceLevel.V, 'earn_step_3'),
        desc: {
          i18nKey: 'earn_money_invite_to_earn_you_will_be_reward',
          i18nOption: { productName: productName },
        },
      },
    ];

    setEarnStepList(earnStepList);
  }, [productName]);
};
export default useMode2TeamClubPageShareForBonus;
