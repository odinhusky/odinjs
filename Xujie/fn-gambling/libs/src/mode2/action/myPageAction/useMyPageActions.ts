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
} from './acitonType';
import handleGlobalClick from '../handleGlobalClick';
import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import handleAction from '../common/handleAction';
import { logout } from '@mode2/usecase/useLogout';
import { RecordPageTabs } from '@mode2/zustand/page/recordPageStore';
import { KYC_BOTH_STATE, KYC_PERSONAL_STATE } from '@libs/constant/KYC';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import { feedBackPageTabIdObj } from '@libs/mode2/@types/feedBackPageTab';
import { useClipboard } from '@libs/commonUtils';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { usePostPlayerUpdateAvatarMutation } from '@mode2API/index';
import useUserInfo from '@libs/mode2/usecase/useUserInfo';
import { useEffect } from 'react';
import { message } from 'antd';
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

export type ActionClickPayloadMap = {
  [handleMyPageActivityLineBtnClick]: void;
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
  } = useNavPageClick();

  const { copyToClipboard } = useClipboard();
  const { refreshUserData } = useUserInfo();
  const { onAnnouncementAction } = useAnnouncementActionBase();

  const id = useUserProfileStore((state) => state.id);
  const setOpenMyDrawer = useMyPageStore((state) => state.setOpenMyDrawer);

  const setIsRefresh = useMode2HallPageStore((state) => state.setIsRefresh);
  const setShowLoading = useLoadingStore((state) => state.setShowLoading);
  const [postUpdateAvatar, { isSuccess, isError }] =
    usePostPlayerUpdateAvatarMutation();

  useEffect(() => {
    if (isSuccess) {
      refreshUserData();
      message.success(
        `${t('earn_money_earn_btn_save')} ${t(
          'account_balance_record_add_cash_record_table_content_success'
        )}`
      );
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) t('account_balance_record_add_cash_record_table_content_fail');
  }, [isError]);

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
          navToChangePasswordPage();
          setOpenMyDrawer(false);
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
          navToFeedbackPage('', {
            state: { tab: feedBackPageTabIdObj.CUSTOMER_SUPPORT },
          });
          setOpenMyDrawer(false);
        },
      });
    },
    [handleMyPageLogoutBtnClick]: () => {
      handleGlobalClick({
        target: handleMyPageLogoutBtnClick,
        callback: () => {
          logout();
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
