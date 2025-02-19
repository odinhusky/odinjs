import { UserRoleType } from '@libs/mode2/@types/userRoleTypes';
import handleGlobalClick from '@libs/mode2/action/handleGlobalClick';
import useBindPlayerPhoneModalStore from '@libs/mode2/zustand/modal/BindPlayerPhoneModal';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import WeakTipsModal from '@modals/WeakTipsModal';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { logout } from '@mode2/usecase/useLogout';

export const LogoutWeakTipsModal = () => {
  const { t } = useTranslation();
  const isLogoutWeakTipsModalShow = useUserProfileStore(
    (state) => state.isLogoutWeakTipsModalShow
  );

  const setIsLogoutWeakTipsModalShow = useUserProfileStore(
    (state) => state.setIsLogoutWeakTipsModalShow
  );

  const setShowBindPlayerPhoneModal = useBindPlayerPhoneModalStore(
    (state) => state.setShowBindPlayerPhoneModal
  );

  const userRole = useUserProfileStore((state) => state.userRole);

  const handleLogoutAtWeakTipsModal = useCallback(() => {
    handleGlobalClick({
      target: 'handleLogoutBtnClick@TemplateModals',
      callback: () => {
        setIsLogoutWeakTipsModalShow(false);
        logout();
      },
    });
  }, []);

  const modalSettings = useMemo(() => {
    // 不是 User 就是 Player
    const isUser = userRole === UserRoleType.USER;

    return {
      isShow: isLogoutWeakTipsModalShow,
      title: t('logout_reminder_title'),
      content: isUser
        ? t('logout_reminder_for_user_content')
        : t('logout_reminder_for_guest_account_content'),
      primaryBtnText: isUser
        ? t('logout_reminder_confirm_button')
        : t('logout_reminder_set_button'),
      secondaryBtnText: isUser
        ? t('logout_reminder_cancel_button')
        : t('logout_reminder_log_out_button'),
      onPrimaryBtnClick: () => {
        if (isUser) {
          handleLogoutAtWeakTipsModal();
        } else {
          handleGlobalClick({
            target: 'handleSetPlayerPhoneBtnClick@TemplateModals',
            callback: () => {
              setIsLogoutWeakTipsModalShow(false);
              setShowBindPlayerPhoneModal(true);
            },
          });
        }
      },
      onSecondaryBtnClick: () => {
        if (isUser) {
          handleGlobalClick({
            target: 'handleCancelSetPlayerPhoneBtnClick@TemplateModals',
            callback: () => {
              setShowBindPlayerPhoneModal(false);
            },
          });
        } else {
          handleLogoutAtWeakTipsModal();
        }
      },
    };
  }, [isLogoutWeakTipsModalShow, userRole]);

  return <WeakTipsModal {...modalSettings} />;
};

export default LogoutWeakTipsModal;
