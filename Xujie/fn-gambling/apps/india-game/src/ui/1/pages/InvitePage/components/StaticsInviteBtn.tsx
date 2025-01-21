import { InvitePageTabType } from '@libs/mode2/@types/invitePageTabTyp';
import { useTranslation } from 'react-i18next';
import { handleInvitePageTabClick } from '@mode2/action/invitePageAction/actionType';
import useInvitePageActions from '@mode2/action/invitePageAction/useInvitePageActions';
import { useCallback } from 'react';
import { cx } from '@libs/commonUtils';

export const StaticsInviteBtn = ({ className }: { className?: string }) => {
  const { t } = useTranslation();

  const { handleInvitePageClick } = useInvitePageActions();
  const clickToEarn = useCallback(() => {
    handleInvitePageClick({
      actionName: handleInvitePageTabClick,
      payload: {
        tabId: InvitePageTabType.EARN,
      },
    });
  }, []);

  return (
    <button
      className={cx('statistics-invite-btn', className)}
      onClick={() => {
        clickToEarn();
        window.scrollTo(0, 0);
      }}
    >
      <span className="bgi-text-[var(--linear-4)]">
        {t('earn_money_statistics_btn_invite_now')}
      </span>
    </button>
  );
};

export default StaticsInviteBtn;
