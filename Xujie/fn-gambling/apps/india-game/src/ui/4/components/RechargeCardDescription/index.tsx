import { useTranslation } from 'react-i18next';
import cx from '@commonUtils/cx';
import renderI18N from '@commonUtils/renderI18N';

export const RechargeCardDescription = () => {
  const { t } = useTranslation();
  // const currentRechargeCard = useWalletPageRechargeCardStore(
  //   (state) => state.currentRechargeCard
  // );
  //
  // const currentPayChannel = useWalletPageRechargeContentStore(
  //   (state) => state.currentPayChannel
  // );
  //
  // const currentOptAmount = useWalletPageRechargeContentStore(
  //   (state) => state.currentOptAmount
  // );
  // const currentOptRebateAmount = useWalletPageRechargeContentStore(
  //   (state) => state.currentOptRebateAmount
  // );
  // const currentOptCashBackRate = useWalletPageRechargeContentStore(
  //   (state) => state.currentOptCashBackRate
  // );
  //
  // const isFirstDeposit = useUserProfileStore((state) => state.isFirstDeposit);
  //
  // const currentAmount = formatMoney(currentOptAmount || 0);
  // const currentRebateAmount = formatMoney(currentOptRebateAmount || 0);
  // const currentRatioAmount = formatMoney((currentOptAmount || 0) * 1.5);

  const descriptions = [
    {
      i18nKey:
        'Deposits to {{IN V6}} are typically credited within 1 to 5 minutes.',
    },
    {
      i18nKey:
        'After a successful payment, please return to the {{IN V6}} deposit page and enter your payment receipt UTR to expedite the process.',
    },
    {
      i18nKey:
        'If your deposit has not been credited within 30 minutes, please contact customer service or upload your UTR for self-service processing.',
    },
  ];

  const descriptionsNotes = [
    { i18nKey: 'Important Notes:' },
    {
      i18nKey:
        'Please do not modify the payment amount. Avoid reusing saved QR codes or UPI accounts for multiple payments.',
    },
  ];

  return (
    <div
      className={cx(
        'flex flex-col gap-2 bgi-text-[var(--base-2-variant2)] font-normal text-xs'
      )}
    >
      <div className="text-base font-medium">{t('Deposit tips:')}</div>

      <div className="">
        {descriptions.map((item, index) => (
          <p key={index} className={cx('numbered-item', '')}>
            {/*{item.content}*/}
            {renderI18N(item, t)}
          </p>
        ))}
      </div>

      <div>
        {descriptionsNotes.map((item, index) => (
          <p key={index} className={cx('', '')}>
            {/*{item.content}*/}
            {renderI18N(item, t)}
          </p>
        ))}
      </div>
    </div>
  );
};
