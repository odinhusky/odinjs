import { useTranslation } from 'react-i18next';
import { formatMoney } from '@mode2/utils';
import cx from '@commonUtils/cx';
import { PayActivationResult } from '@mode2API/endpoint/wallet/PostPayConfigInfoWithOptionsEndpoint';
import { ReactNode, useMemo, useState } from 'react';
import TutorialModal from '@modals/TutorialModal';
import isNull from 'lodash/isNull';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import handleGlobalClick from '@libs/mode2/action/handleGlobalClick';
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
        onClick={() => {
          handleGlobalClick({
            target: 'handleTutorialLinkClick',
            callback: () => {
              setShowTutorial(true);
            },
          });
        }}
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

  const currentAmount = formatMoney({ value: currentOptAmount || 0 });
  const currentRebateAmount = formatMoney({
    value: currentOptRebateAmount || 0,
  });
  const currentRatioAmount = formatMoney({
    value: (currentOptAmount || 0) * 1.5,
  });

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
      content: t('wallet_deposit_bonus_reminder_content_2'),
    },
    {
      content: t('wallet_deposit_bonus_reminder_content_3'),
    },
    {
      content: t(
        isFirstDeposit === true || isNull(isFirstDeposit)
          ? 'wallet_deposit_bonus_reminder_content_4'
          : 'wallet_deposit_bonus_reminder_content_4_1', // TODO Evan i18n check
        {
          payChannelName: currentPayChannel.displayName,
          cashBackRate: currentOptCashBackRate,
          currentAmount: currentAmount,
          currentRebateAmount: currentRebateAmount,
        }
      ),
    },
    {
      content: t('wallet_deposit_bonus_reminder_content_5'),
    },
    {
      className: 'bgi-text-[var(--state-error-main)]',
      content: t('wallet_deposit_bonus_reminder_content_6'),
    },
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
      content: t('wallet_deposit_content_reminder_2'),
    },
    {
      content: t('wallet_deposit_content_reminder_3'),
    },
    {
      content: t('wallet_deposit_content_reminder_4', {
        ratio: '1.5',
        currentAmount: currentAmount,
        currentRatioAmount: currentRatioAmount,
      }),
    },
    {
      content: t('wallet_deposit_content_reminder_5'),
    },
    {
      className: 'bgi-text-[var(--state-error-main)]',
      content: t('wallet_deposit_content_reminder_6'),
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
            {item.content}
          </p>
        ))}
      </div>
    </div>
  );
};
