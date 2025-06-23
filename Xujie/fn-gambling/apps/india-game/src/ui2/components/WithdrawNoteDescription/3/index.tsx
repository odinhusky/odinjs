import { Trans, useTranslation } from 'react-i18next';
import React from 'react';
import cx from '@commonUtils/cx';

/**
 * Evan for [V6] Done
 */
export const WithdrawNoteDescription = () => {
  const { t } = useTranslation();
  return (
    <div
      className={cx(
        'pr-4',
        'bgi-text-[var(--base-2-variant2)]',
        'text-base font-medium'
      )}
    >
      <div>{t('withdrawal_remaining_withdrawal_limit_reminder')}</div>

      <p className="text-xs">
        {t('withdrawal_remaining_withdrawal_limit_reminder_linked_content')}
      </p>

      <p className="text-xs">
        <Trans
          i18nKey={
            'withdrawal_remaining_withdrawal_limit_reminder_unlinked_content'
          }
          values={{
            hours: t(
              'withdrawal_remaining_withdrawal_limit_reminder_unlinked_content_24_hours',
              { hours: '24' }
            ),
          }}
          components={{
            hoursTab: <span className="bgi-text-[var(--base-1-main)]" />,
          }}
        />
      </p>
    </div>
  );
};

export default WithdrawNoteDescription;
