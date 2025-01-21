import { useTranslation } from 'react-i18next';
import cx from '@commonUtils/cx';
import renderI18N from '@commonUtils/renderI18N';
import useHighBonusRechargeDescription from '@/usecase/useHighBonusRechargeDescription';

export const RechargeCardDescription = () => {
  const { descriptionOptions, descriptionList } =
    useHighBonusRechargeDescription();
  const { t } = useTranslation();

  return (
    <div className={cx('')}>
      <div className="bgi-text-[var(--state-warn-main)] text-base mobile:text-lg font-medium mb-2">
        {t('sign_up_popup_title_reminder')}
      </div>
      <div className="text-[var(--grayscale-70)] text-sm mobile:text-base">
        {descriptionList.map((item, index) => (
          <p key={index} className={cx('numbered-item', item.className)}>
            {renderI18N(
              {
                i18nKey: item.i18nKey,
                i18nOption: item.useI18nOption ? descriptionOptions : undefined,
              },
              t
            )}
          </p>
        ))}
      </div>
    </div>
  );
};
