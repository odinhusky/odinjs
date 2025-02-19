import {
  handleMyPageActivityLineBtnClick,
  handleMyPageAnnouncementsActionClick,
  handleMyPageBankAccountLineBtnClick,
  handleMyPageBannerBtnClick,
  handleMyPageChangePasswordLineBtnClick,
  handleMyPageCustomerSupportLineBtnClick,
  handleMyPageDepositBtnClick,
  handleMyPageEarnMoneyLineBtnClick,
  handleMyPageFAQLineBtnClick,
  handleMyPageGiftCodeLineBtnClick,
  handleMyPageHomeBtnClick,
  handleMyPageLogoutBtnClick,
  handleMyPagePersonalInformationLineBtnClick,
  handleMyPageReloadVersionLineBtnClick,
  handleMyPageTeamClubLineBtnClick,
  handleMyPageUserInfoAvatarSaveBtnClick,
  handleMyPageUserInfoCopyIDClick,
  handleMyPageVIPDetailBtnClick,
  handleMyPageVIPRecordBtnClick,
  handleMyPageVIPReportBtnClick,
  handleMyPageWithdrawBtnClick,
  handleLogoutBtnClick,
  handleCloseMyPageWeakTipsModal,
  handleMyPageAboutUsActionClick,
  handleMyPageBankDetailActionClick,
  handleMyPageMyInfoActionClick,
  handleMyPagSettingActionClick,
} from './acitonType';
import handleGlobalClick from '../handleGlobalClick';
import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import handleAction from '../common/handleAction';
import { logout } from '@mode2/usecase/useLogout';
import {
  RecordPageHeaderTabs,
  RecordPageTabs,
} from '@mode2/zustand/page/recordPageStore';
import { KYC_BOTH_STATE, KYC_PERSONAL_STATE } from '@libs/constant/KYC';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import { feedBackPageTabIdObj } from '@libs/mode2/@types/feedBackPageTab';
import { useClipboard } from '@libs/commonUtils';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { usePostPlayerUpdateAvatarMutation } from '@mode2API/index';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { WalletPageTabType } from '@mode2/@types/walletPageTabType';
import { ActivityPageTabType } from '@mode2/@types/activityPageTabType';
import { useMyPageStore } from '@mode2/zustand/page/myPageStore';
import { useMode2HallPageStore } from '@libs/mode2/zustand/page/hallPageStore';
import { useLoadingStore } from '@mode2/zustand/components/loadingStore';
import { AnnouncementResult } from '@mode2API/endpoint/user/PostHomeEndpoint';
import { TeamClubPageTabType } from '@mode2/@types/teamClubPageTabType';
import useAnnouncementActionBase, {
  AnnouncementScenariosType,
} from '@mode2/usecase/announcement/useAnnouncementActionBase';
import { useGiftCodeRedeemStore } from '@libs/mode2/zustand/page/GiftCodeRedeemPage/useGiftCodeRedeemStore';
import { useMessageStore } from '@mode2/zustand/components/messageStore';
import { SettingPageTypes } from '@libs/mode2/zustand/page/settingPageStore';
import { AccountPageTypes } from '@libs/mode2/zustand/page/accountPageStore';
import sdkUtils from '@libs/mode2/utils/sdk';

export type ActionClickPayloadMap = {
  [handleMyPageActivityLineBtnClick]: void;
  [handleMyPageGiftCodeLineBtnClick]: void;
  [handleMyPageEarnMoneyLineBtnClick]: void;
  [handleMyPageTeamClubLineBtnClick]: void;
  [handleMyPagePersonalInformationLineBtnClick]: void;
  [handleMyPageBankAccountLineBtnClick]: void;
  [handleMyPageChangePasswordLineBtnClick]: void;
  [handleMyPageFAQLineBtnClick]: void;
  [handleMyPageCustomerSupportLineBtnClick]: void;
  [handleMyPageLogoutBtnClick]: void;
  [handleMyPageBannerBtnClick]: void;
  [handleMyPageVIPDetailBtnClick]: void;
  [handleMyPageVIPRecordBtnClick]: void;
  [handleMyPageVIPReportBtnClick]: void;
  [handleMyPageUserInfoCopyIDClick]: void;
  [handleMyPageUserInfoAvatarSaveBtnClick]: {
    selectedAvatarOrder: string;
    selectedAvatarFrameOrder: string;
  };
  [handleMyPageHomeBtnClick]: void;
  [handleMyPageDepositBtnClick]: void;
  [handleMyPageWithdrawBtnClick]: void;
  [handleMyPageReloadVersionLineBtnClick]: void;
  [handleMyPageAnnouncementsActionClick]: { item: AnnouncementResult };
  [handleLogoutBtnClick]: void;
  [handleCloseMyPageWeakTipsModal]: void;
  [handleMyPageMyInfoActionClick]: { value: AccountPageTypes };
  [handleMyPageBankDetailActionClick]: void;
  [handleMyPageAboutUsActionClick]: void;
  [handleMyPagSettingActionClick]: void;
};

export interface HandleMyPageClickProps<T extends keyof ActionClickPayloadMap>
  extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useMyPageActions = () => {
  const { t } = useTranslation();

  const {
    navToBindKYCPage,
    navToRecordPage,
    navToActivityPage,
    navToInvitePage,
    navToChangePasswordPage,
    navToFeedbackPage,
    navToWalletPage,
    navToHallPage,
    navToTeamClubPage,
    navToAccountPage,
    navToSettingPage,
  } = useNavPageClick();

  const { copyToClipboard } = useClipboard();
  const { onAnnouncementAction } = useAnnouncementActionBase();

  const id = useUserProfileStore((state) => state.id);
  const refreshUserData = useUserProfileStore((state) => state.refreshUserData);

  const setOpenMyDrawer = useMyPageStore((state) => state.setOpenMyDrawer);
  const setIsLogoutWeakTipsModalShow = useUserProfileStore(
    (state) => state.setIsLogoutWeakTipsModalShow
  );

  const setShowRedeemGiftCodeModal = useGiftCodeRedeemStore(
    (state) => state.setShowRedeemGiftCodeModal
  );

  const setIsRefresh = useMode2HallPageStore((state) => state.setIsRefresh);
  const setShowLoading = useLoadingStore((state) => state.setShowLoading);

  // const userRole = useUserProfileStore((state) => state.userRole);

  // const setBindType = useBindPlayerPhoneModalStore(
  //   (state) => state.setBindType
  // );

  // const setShowBindPlayerPhoneModal = useBindPlayerPhoneModalStore(
  //   (state) => state.setShowBindPlayerPhoneModal
  // );

  const [postUpdateAvatar, { isSuccess, isError }] =
    usePostPlayerUpdateAvatarMutation();

  useEffect(() => {
    if (isSuccess) {
      refreshUserData();
      useMessageStore
        .getState()
        .success(
          `${t('earn_money_earn_btn_save')} ${t(
            'account_balance_record_add_cash_record_table_content_success'
          )}`
        );
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) t('account_balance_record_add_cash_record_table_content_fail');
  }, [isError]);

  // TODO Ronan
  const handleChangePassword = () => {
    navToChangePasswordPage();
    setOpenMyDrawer(false);

    // 上一階段暫未釋出
    // if (userRole === UserRoleType.PLAYER) {
    //   // 開啟綁定 phone number 以及密碼的 Modal
    //   setBindType(BindType.BIND_PHONE_AND_PASSWORD);

    //   setShowBindPlayerPhoneModal(true);
    // }
  };

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleMyPageActivityLineBtnClick]: () => {
      handleGlobalClick({
        target: handleMyPageActivityLineBtnClick,
        callback: () => {
          navToActivityPage();
          setOpenMyDrawer(false);
        },
      });
    },
    [handleMyPageGiftCodeLineBtnClick]: () => {
      handleGlobalClick({
        target: handleMyPageGiftCodeLineBtnClick,
        callback: () => {
          setShowRedeemGiftCodeModal(true);
          setOpenMyDrawer(false);
        },
      });
    },
    [handleMyPageEarnMoneyLineBtnClick]: () => {
      handleGlobalClick({
        target: handleMyPageEarnMoneyLineBtnClick,
        callback: () => {
          navToInvitePage();
          setOpenMyDrawer(false);
        },
      });
    },
    [handleMyPageTeamClubLineBtnClick]: () => {
      handleGlobalClick({
        target: handleMyPageTeamClubLineBtnClick,
        callback: () => {
          navToTeamClubPage('', {
            state: { tab: TeamClubPageTabType.MY_REWARDS },
          });
          setOpenMyDrawer(false);
        },
      });
    },
    [handleMyPagePersonalInformationLineBtnClick]: () => {
      handleGlobalClick({
        target: handleMyPagePersonalInformationLineBtnClick,
        callback: () => {
          navToBindKYCPage('', { state: { tab: KYC_PERSONAL_STATE } });
          setOpenMyDrawer(false);
        },
      });
    },
    [handleMyPageBankAccountLineBtnClick]: () => {
      handleGlobalClick({
        target: handleMyPageBankAccountLineBtnClick,
        callback: () => {
          navToBindKYCPage('', { state: { tab: KYC_BOTH_STATE } });
          setOpenMyDrawer(false);
        },
      });
    },
    [handleMyPageChangePasswordLineBtnClick]: () => {
      handleGlobalClick({
        target: handleMyPageChangePasswordLineBtnClick,
        callback: () => {
          handleChangePassword();
        },
      });
    },
    [handleMyPageFAQLineBtnClick]: () => {
      handleGlobalClick({
        target: handleMyPageFAQLineBtnClick,
        callback: () => {
          navToFeedbackPage('', { state: { tab: feedBackPageTabIdObj.FAQ } });
          setOpenMyDrawer(false);
        },
      });
    },
    [handleMyPageCustomerSupportLineBtnClick]: () => {
      handleGlobalClick({
        target: handleMyPageCustomerSupportLineBtnClick,
        callback: () => {
          // navToFeedbackPage('', {
          //   state: { tab: feedBackPageTabIdObj.CUSTOMER_SUPPORT },
          // });
          sdkUtils.openChat(() => {});
          setOpenMyDrawer(false);
        },
      });
    },
    // 這個是 MyPage Logout 的按鈕被點選的時候，依照身份出現不同的 WeakTipModal 內容
    [handleMyPageLogoutBtnClick]: () => {
      handleGlobalClick({
        target: handleMyPageLogoutBtnClick,
        callback: () => {
          setIsLogoutWeakTipsModalShow(true);
        },
      });
    },
    // 這個是真的要登出的按鈕行為
    [handleLogoutBtnClick]: () => {
      handleGlobalClick({
        target: handleLogoutBtnClick,
        callback: () => {
          logout();
        },
      });
    },
    [handleCloseMyPageWeakTipsModal]: () => {
      handleGlobalClick({
        target: handleCloseMyPageWeakTipsModal,
        callback: () => {
          setIsLogoutWeakTipsModalShow(false);
        },
      });
    },
    [handleMyPageBannerBtnClick]: () => {
      handleGlobalClick({
        target: handleMyPageBannerBtnClick,
        callback: () => {
          navToWalletPage();
          setOpenMyDrawer(false);
        },
      });
    },
    [handleMyPageVIPDetailBtnClick]: () => {
      handleGlobalClick({
        target: handleMyPageVIPDetailBtnClick,
        callback: () => {
          navToActivityPage('', { state: { tab: ActivityPageTabType.VIP } });
          setOpenMyDrawer(false);
        },
      });
    },
    [handleMyPageVIPRecordBtnClick]: () => {
      handleGlobalClick({
        target: handleMyPageVIPRecordBtnClick,
        callback: () => {
          navToRecordPage('', {
            state: {
              tab: RecordPageTabs.RECORD,
            },
          });
          setOpenMyDrawer(false);
        },
      });
    },
    [handleMyPageVIPReportBtnClick]: () => {
      handleGlobalClick({
        target: handleMyPageVIPReportBtnClick,
        callback: () => {
          navToRecordPage('', {
            state: {
              tab: RecordPageTabs.REPORT,
            },
          });
          setOpenMyDrawer(false);
        },
      });
    },
    [handleMyPageUserInfoCopyIDClick]: () => {
      handleGlobalClick({
        target: handleMyPageUserInfoCopyIDClick,
        callback: () => {
          copyToClipboard(`${id}`);
        },
      });
    },
    [handleMyPageUserInfoAvatarSaveBtnClick]: ({
      selectedAvatarOrder,
      selectedAvatarFrameOrder,
    }) => {
      handleGlobalClick({
        target: handleMyPageUserInfoAvatarSaveBtnClick,
        callback: () => {
          postUpdateAvatar({
            avatar: selectedAvatarOrder,
            avatarFrame: selectedAvatarFrameOrder,
          });
        },
      });
    },
    [handleMyPageHomeBtnClick]: () => {
      handleGlobalClick({
        target: handleMyPageHomeBtnClick,
        callback: () => {
          navToHallPage();
          setOpenMyDrawer(false);
        },
      });
    },
    [handleMyPageDepositBtnClick]: () => {
      handleGlobalClick({
        target: handleMyPageDepositBtnClick,
        callback: () => {
          navToWalletPage('', { state: { tab: WalletPageTabType.DEPOSIT } });
          setOpenMyDrawer(false);
        },
      });
    },
    [handleMyPageWithdrawBtnClick]: () => {
      handleGlobalClick({
        target: handleMyPageWithdrawBtnClick,
        callback: () => {
          navToWalletPage('', { state: { tab: WalletPageTabType.WITHDRAW } });
          setOpenMyDrawer(false);
        },
      });
    },
    [handleMyPageReloadVersionLineBtnClick]: () => {
      handleGlobalClick({
        target: handleMyPageReloadVersionLineBtnClick,
        callback: () => {
          setShowLoading(true);
          navToHallPage();
          setIsRefresh(true);
        },
      });
    },
    [handleMyPageAnnouncementsActionClick]: ({ item }) => {
      handleGlobalClick({
        target: handleMyPageAnnouncementsActionClick,
        callback: () => {
          onAnnouncementAction(AnnouncementScenariosType.HOME, {
            type: item.type,
            gameObj: item.gameObj,
          });
          setOpenMyDrawer(false);
        },
      });
    },

    [handleMyPageMyInfoActionClick]: ({ value }) => {
      handleGlobalClick({
        target: handleMyPageMyInfoActionClick,
        callback: () => {
          navToAccountPage('', {
            state: { tab: value },
          });
          setOpenMyDrawer(false);
        },
      });
    },

    [handleMyPageBankDetailActionClick]: () => {
      handleGlobalClick({
        target: handleMyPageBankDetailActionClick,
        callback: () => {
          navToRecordPage('', {
            state: {
              tab: RecordPageHeaderTabs.DETAIL,
            },
          });
          setOpenMyDrawer(false);
        },
      });
    },

    [handleMyPageAboutUsActionClick]: () => {
      handleGlobalClick({
        target: handleMyPageAboutUsActionClick,
        callback: () => {
          navToSettingPage('', {
            state: { tab: SettingPageTypes.SOCIALLIST },
          });
          setOpenMyDrawer(false);
        },
      });
    },

    [handleMyPagSettingActionClick]: () => {
      handleGlobalClick({
        target: handleMyPagSettingActionClick,
        callback: () => {
          navToSettingPage('', {
            state: { tab: SettingPageTypes.MUSIC_SETTING },
          });
          setOpenMyDrawer(false);
        },
      });
    },
  };

  const handleMyPageClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleMyPageClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleMyPageClick,
  };
};

export default useMyPageActions;
