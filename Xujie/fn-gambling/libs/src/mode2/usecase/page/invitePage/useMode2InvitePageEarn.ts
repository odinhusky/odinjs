import { useEffect } from 'react';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { useMode2InviteEarnStore } from '@mode2/zustand/page/invitePageStore';
import sdkUtils from '@libs/mode2/utils/sdk';

export const useMode2InvitePageEarn = () => {
  const productName = sdkUtils.productName();
  const setEarnHeaderList = useMode2InviteEarnStore(
    (state) => state.setEarnHeaderList
  );

  useEffect(() => {
    const earnList = [
      {
        id: 'Earn List 1',
        title: {
          i18nKey: 'earn_money_invite_to_earn_share_your_referral_link',
        },
        url: getImgUrl(EResourceLevel.V, 'earn_step_1'),
        desc: {
          i18nKey: 'earn_money_invite_to_earn_just_copy_or_screenshot',
        },
      },
      {
        id: 'Earn List 2',
        title: {
          i18nKey: 'earn_money_invite_to_earn_get_your_friends',
        },
        url: getImgUrl(EResourceLevel.V, 'earn_step_2'),
        desc: {
          i18nKey: 'earn_money_invite_to_earn_you_can_check',
        },
      },
      {
        id: 'Earn List 3',
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

    setEarnHeaderList(earnList);
  }, [productName]);
};
export default useMode2InvitePageEarn;
