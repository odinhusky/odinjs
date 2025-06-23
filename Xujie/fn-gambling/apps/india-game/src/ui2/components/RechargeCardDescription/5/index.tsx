import { useTranslation } from 'react-i18next';
import cx from '@commonUtils/cx';
import renderI18N from '@commonUtils/renderI18N';
import sdkUtils from '@mode2/utils/sdk';
import useDepositJackpotWheelModalStore from '@mode2/zustand/modal/DepositJackpotWheelModal';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { useDurationCountDown } from '@libs/commonUtils';

const DescriptionList = () => {
  const { t } = useTranslation();
  const descriptions = [
    { i18nKey: 'deposit_deposit_tips_list_1' },
    { i18nKey: 'deposit_deposit_tips_list_2' },
    { i18nKey: 'deposit_deposit_tips_list_3' },
  ];

  const descriptionsNotes = [
    { i18nKey: 'deposit_important_notes' },
    { i18nKey: 'deposit_important_notes_content' },
  ];

  return (
    <>
      <div className="text-base font-medium">{t('Deposit tips:')}</div>
      <div className="">
        {descriptions.map((item, index) => (
          <p key={index} className={cx('numbered-item', '')}>
            {renderI18N(
              { ...item, i18nOption: { productName: sdkUtils.productName() } },
              t
            )}
          </p>
        ))}
      </div>
      <div>
        {descriptionsNotes.map((item, index) => (
          <p key={index} className={cx('', '')}>
            {renderI18N(item, t)}
          </p>
        ))}
      </div>
    </>
  );
};

const DepositJackpotDescriptionList = () => {
  const descriptions = [
    { i18nKey: 'This offer is valid for 2 hours only.' },
    {
      i18nKey:
        'Unlimited times during promo. Get 2x bonus every time you deposit.',
    },
    {
      i18nKey:
        'All deposit bonuses will be added to your wallet after your last deposit.',
    },
    { i18nKey: 'You must meet the wagering requirements before withdrawing.' },
  ];

  const descriptionsNotes = [
    {
      i18nKey: `Deposits to ${sdkUtils.productName()} usually reflect in 1 to 5 minutes.`,
    },
    {
      i18nKey:
        'If your deposit is delayed for more than 15 minutes, please send your UTR number to customer support.',
    },
  ];

  return (
    <>
      <div className="text-base font-medium">{'How this works:'}</div>
      <div className="">
        {descriptions.map((item, index) => (
          <p key={index} className={cx('numbered-item', '')}>
            {item.i18nKey}
          </p>
        ))}
      </div>
      <div className="text-base font-medium mt-1">{'Important notes:'}</div>
      <div className="">
        {descriptionsNotes.map((item, index) => (
          <p key={index} className={cx('dots-item', '')}>
            {item.i18nKey}
          </p>
        ))}
      </div>
    </>
  );
};

export const RechargeCardDescription = () => {
  // const { t } = useTranslation();
  const doubleBuffRechargeBonusLimitedEndTime =
    useDepositJackpotWheelModalStore(
      (state) => state.doubleBuffRechargeBonusLimitedEndTime
    );

  const countdownTime = useMemo(() => {
    const nowUnix = dayjs().unix();
    return doubleBuffRechargeBonusLimitedEndTime > nowUnix
      ? doubleBuffRechargeBonusLimitedEndTime - nowUnix
      : 0;
  }, [doubleBuffRechargeBonusLimitedEndTime]);

  const { remainSec } = useDurationCountDown({
    duration: countdownTime,
    onEnd: () => {
      console.log('Happy New Year!');
    },
  });

  return (
    <div
      className={cx(
        'flex flex-col gap-2 bgi-text-[var(--base-2-variant2)] font-normal text-xs'
      )}
    >
      {remainSec > 0 ? <DepositJackpotDescriptionList /> : <DescriptionList />}
    </div>
  );
};
