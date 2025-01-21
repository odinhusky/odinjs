import { Trans, useTranslation } from 'react-i18next';
import { formatMoney } from '@mode2/utils';
import cx from '@commonUtils/cx';
import React, { ReactNode, useMemo, useState } from 'react';
import TutorialModal from '@modals/TutorialModal';
import { isNull } from 'lodash';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { PayActivationResult } from '@mode2API/endpoint/wallet/PostPayConfigInfoWithOptionsEndpoint';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';
import {
  RechargeCard,
  useWalletPageRechargeCardStore,
} from '@mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';

const TutorialLink = ({ children }: { children: ReactNode }) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const currentPayChannel = useWalletPageRechargeContentStore(
    (state) => state.currentPayChannel
  );
  return (
    <>
      <span
        className={cx(
          'bgi-text-[var(--state-warn-main)] relative cursor-pointer',
          'after:w-[calc(100%_-_0.3rem)] after:h-[1px] after:left-0.5 after:bottom-0 after:bgi-[var(--state-warn-main)] after:absolute'
        )}
        onClick={() => setShowTutorial(true)}
      >
        {children}
      </span>
      {showTutorial && (
        <TutorialModal
          type={currentPayChannel.payActivation || PayActivationResult.EXTERNAL}
          onClose={() => setShowTutorial(false)}
        />
      )}
    </>
  );
};

export const RechargeCardDescription = () => {
  const { t } = useTranslation();
  const currentRechargeCard = useWalletPageRechargeCardStore(
    (state) => state.currentRechargeCard
  );

  const currentPayChannel = useWalletPageRechargeContentStore(
    (state) => state.currentPayChannel
  );

  const currentOptAmount = useWalletPageRechargeContentStore(
    (state) => state.currentOptAmount
  );
  const currentOptRebateAmount = useWalletPageRechargeContentStore(
    (state) => state.currentOptRebateAmount
  );
  const currentOptCashBackRate = useWalletPageRechargeContentStore(
    (state) => state.currentOptCashBackRate
  );

  const isFirstDeposit = useUserProfileStore((state) => state.isFirstDeposit);

  const ratio = 1.5;
  const currentAmount = formatMoney(currentOptAmount || 0);
  const currentRebateAmount = formatMoney(currentOptRebateAmount || 0);
  const currentRatioAmount = formatMoney((currentOptAmount || 0) * ratio);
  const requiresBetAmount = formatMoney(
    (currentOptAmount || 0) * ratio - (currentOptAmount || 0)
  );

  <Trans
    i18nKey="wallet_deposit_bonus_reminder_content_2"
    // values={{
    //   bankCard: t('common_constants_bank_card')
    // }}
    components={{
      bankCard: <span className="">t('common_constants_bank_card') </span>,
    }}
  />;

  const topUpBonusDescriptionList = [
    {
      content: (
        <>
          {t('wallet_deposit_bonus_reminder_content_1')}
          <TutorialLink>{t('common_constants_picture')} </TutorialLink> /{' '}
          <TutorialLink>{t('common_constants_video')} </TutorialLink>
        </>
      ),
    },
    {
      content: (
        <Trans
          i18nKey="wallet_deposit_bonus_reminder_content_2"
          values={{
            bankCard: t('common_constants_bank_card'),
          }}
          components={{
            bankCard: <span className="font-bold" />,
          }}
        />
      ),
    },
    {
      content: t(
        isFirstDeposit === true || isNull(isFirstDeposit)
          ? 'wallet_deposit_bonus_reminder_content_3'
          : 'wallet_deposit_bonus_reminder_content_3_1',
        {
          payChannelName: currentPayChannel.displayName,
          cashBackRate: currentOptCashBackRate,
          currentAmount: currentAmount,
          currentRebateAmount: currentRebateAmount,
        }
      ),
    },
    {
      content: t('wallet_deposit_bonus_reminder_content_4', {
        ratio: ratio,
        currentAmount: currentAmount,
        currentRatioAmount: currentRatioAmount,
        requiresBetAmount: requiresBetAmount,
      }),
    },
    {
      content: t('wallet_deposit_bonus_reminder_content_5'),
      className: '',
    },
    // {
    //   className: 'bgi-text-[var(--state-error-main)]',
    //   content: t('wallet_deposit_bonus_reminder_content_6'),
    // },
  ];

  const descriptionList = [
    {
      content: (
        <>
          {t('wallet_deposit_content_reminder_1')}
          <TutorialLink>{t('common_constants_picture')} </TutorialLink> /{' '}
          <TutorialLink>{t('common_constants_video')} </TutorialLink>
        </>
      ),
    },
    {
      content: (
        <Trans
          i18nKey="wallet_deposit_bonus_reminder_content_2"
          values={{
            bankCard: t('common_constants_bank_card'),
          }}
          components={{
            bankCard: <span className="font-bold" />,
          }}
        />
      ),
    },
    {
      content: t('wallet_deposit_content_reminder_2', {
        ratio: '1.5',
        currentAmount: currentAmount,
        currentRatioAmount: currentRatioAmount,
      }),
    },
    {
      content: t('wallet_deposit_content_reminder_3'),
      className: '',
    },
  ];

  const descriptionItems = useMemo(() => {
    const list =
      currentRechargeCard === RechargeCard.TOP_UP_BONUS
        ? topUpBonusDescriptionList
        : descriptionList;
    return list.splice(1, list.length);
    // return list.filter((v, i) =>
    //   i === 0
    //     ? // 是否有支付教程
    //     !!TUTORIAL_DATA_MAP[currentPayChannel.payActivation]?.data?.length
    //     : true
    //     // i === 5
    //     //   ? //是否需要输入UTR
    //     //   [PayActivationResult.UPI].includes(currentPayChannel.payActivation)
    //     //   : true
    // );
  }, [
    currentRechargeCard,
    currentPayChannel,
    currentOptCashBackRate,
    currentOptAmount,
    currentOptRebateAmount,
    t,
  ]);

  return (
    <div className={cx('')}>
      <div className="bgi-text-[var(--state-warn-main)] text-base mobile:text-lg font-medium mb-2">
        {t('sign_up_popup_title_reminder')}
      </div>
      <div className="text-[var(--grayscale-70)] text-sm mobile:text-base">
        {descriptionItems.map((item, index) => (
          <p key={index} className={cx('numbered-item', item.className)}>
            <span>{item.content}</span>
          </p>
        ))}
      </div>
    </div>
  );
};
