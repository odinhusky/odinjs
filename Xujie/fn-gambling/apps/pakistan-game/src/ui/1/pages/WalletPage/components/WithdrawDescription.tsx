import { formatMoney } from '@mode2/utils';
import cx from '@commonUtils/cx';
import { useTranslation } from 'react-i18next';
import Icon from '@mode2/components/Icon';

// 先抽成變數未來要調整時就不用改字串
// const BANK_COMMISSION_PERCENTAGE = 3; // 3% 手續費
// const BANK_COMMISSION_FLAT_FEE = 6; // 固定手續費 6 INR

export const WithdrawDescription = () => {
  const { t } = useTranslation();

  const descriptionItems = [
    {
      content: t('wallet_withdraw_note_1'),
    },
    {
      content: t('wallet_withdraw_note_2'),
    },
    {
      content: t('wallet_withdraw_note_3', {
        limitWithdraw: formatMoney(50000),
      }),
    },
    {
      content: t('wallet_withdraw_note_4'),
    },
    {
      content: t('wallet_withdraw_note_5'),
    },
    {
      content: t('wallet_withdraw_note_6'),
      className: '',
    },
  ];

  return (
    <div
      className={cx(
        'gap-2 mt-3',
        'text-sm mobile:text-base',
        'bgi-text-[var(--state-warn-main)] font-medium'
      )}
    >
      <div className="flex gap-2 items-center">
        <Icon
          className={'w-6 h-6'}
          name={'ic_notice'}
          color={'var(--state-warn-main)'}
        />
        <span className="font-semibold">{t('wallet_withdraw_note_title')}</span>
      </div>

      <div className={cx('mt-1')}>
        <div className="">
          {descriptionItems.map((item, index) => (
            <p key={index} className={cx(item.className)}>
              {index+1}.{item.content}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
