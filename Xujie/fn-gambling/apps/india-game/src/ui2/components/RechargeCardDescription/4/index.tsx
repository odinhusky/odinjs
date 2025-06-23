import { useTranslation } from 'react-i18next';
import cx from '@commonUtils/cx';
import renderI18N from '@commonUtils/renderI18N';
import sdkUtils from '@mode2/utils/sdk';

/**
 * Evan for [V6] Done
 */
export const RechargeCardDescription = () => {
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
    <div
      className={cx(
        'flex flex-col gap-2 bgi-text-[var(--base-2-variant2)] font-normal text-xs'
      )}
    >
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
    </div>
  );
};
