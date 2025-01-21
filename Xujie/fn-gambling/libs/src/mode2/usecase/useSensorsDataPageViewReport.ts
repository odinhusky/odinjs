import { Location } from 'react-router-dom';
import { BasePagePathObj, BasePagePaths } from '@mode2/routerTypes/types';
import sdkUtils from '@mode2/utils/sdk';
import {
  SensorsEventLabel,
  SensorsEventPayload,
  SensorsPayloadType,
} from '@mode2/utils/sdk/strategy/analytics/SensorsAnalytics';
import { WalletPageTabType } from '@mode2/@types/walletPageTabType';
import { KYC_BOTH_STATE, KYC_PERSONAL_STATE } from '@constant/KYC';
import { feedBackPageTabIdObj } from '@mode2/@types/feedBackPageTab';
import { ActivityPageTabType } from '@mode2/@types/activityPageTabType';
import { RecordPageTabs } from '@mode2/zustand/page/recordPageStore';
import { LoginFormType } from '@mode2/zustand/loginStore';
import { TeamClubPageTabType } from '@mode2/@types/teamClubPageTabType';

interface Description {
  description: string;
  event_name: string;
}

interface ViewPageData extends Description {
  path?: string;
  params: string | Record<string, Description>;
  isNeedState: boolean;
}

const mapPageViewData: Record<BasePagePaths | string, ViewPageData> = {
  [BasePagePathObj.PopPage]: {
    params: '?referral_code=xxxx',
    description: '邀請連結',
    event_name: 'activity_referral_code',
    isNeedState: false,
  },
  [BasePagePathObj.OfficialWebsite]: {
    params: '',
    description: '官網',
    event_name: 'official',
    isNeedState: false,
  },
  [BasePagePathObj.PwaInstallGuide]: {
    params: '',
    description: 'PWA 引導安裝',
    event_name: 'pwa_install_guide',
    isNeedState: false,
  },
  [BasePagePathObj.LoginPage]: {
    params: {
      [`${LoginFormType.LOGIN}`]: {
        description: '登入',
        event_name: 'login',
      },
      [`${LoginFormType.REGISTER}`]: {
        description: '註冊',
        event_name: 'register',
      },
    },
    description: '登入',
    event_name: 'login',
    isNeedState: true,
  },

  [BasePagePathObj.HallPage]: {
    params: {
      ['true']: {
        description: '邀請新客活動',
        event_name: 'activity_invite_new_user',
      },
      ['false']: {
        description: '邀請新客活動',
        event_name: 'activity_invite_new_user',
      },
    },
    description: '首頁',
    event_name: 'home',
    isNeedState: false,
  },
  [BasePagePathObj.InvitePage]: {
    params: '',
    description: '邀請，邀請功能描述、統計方式、週排行等',
    event_name: 'activity_referral_detail',
    isNeedState: false,
  },
  [BasePagePathObj.WalletPage]: {
    params: {
      [`${WalletPageTabType.DEPOSIT}`]: {
        description: '餘額充值',
        event_name: 'recharge',
      },
      [`${WalletPageTabType.WITHDRAW}`]: {
        description: '餘額提現',
        event_name: 'withdraw',
      },
    },
    description: '餘額充值',
    event_name: 'recharge',
    isNeedState: true,
  },
  [BasePagePathObj.MoreGamePage]: {
    params: '',
    description: '遊戲目錄',
    event_name: 'game_category',
    isNeedState: false,
  },
  [BasePagePathObj.ActivityPage]: {
    params: {
      [`${ActivityPageTabType.ACTIVITY}`]: {
        description: '活動列表',
        event_name: 'activity_list',
      },
      [`${ActivityPageTabType.VIP}`]: { description: 'VIP', event_name: 'vip' },
    },
    description: '活動列表',
    event_name: 'activity_list',
    isNeedState: true,
  },
  [BasePagePathObj.MyPage]: {
    params: '',
    description: '個人帳號',
    event_name: 'account',
    isNeedState: false,
  },
  [BasePagePathObj.BindKYCPage]: {
    params: {
      [KYC_PERSONAL_STATE]: {
        description: '個人資訊認證',
        event_name: 'profile_bank_info_bind',
      },
      [KYC_BOTH_STATE]: {
        description: '提現錢包資訊認證',
        event_name: 'wallet_bank_info_bind',
      },
    },
    description: '個人資訊認證',
    event_name: 'profile_bank_info_bind',
    isNeedState: true,
  },
  [BasePagePathObj.ChangePasswordPage]: {
    params: '',
    description: '個人密碼修改',
    event_name: 'profile_pwd_set',
    isNeedState: false,
  },
  [BasePagePathObj.FeedBackPage]: {
    params: {
      [`${feedBackPageTabIdObj.CUSTOMER_SUPPORT}`]: {
        description: '聯繫客服',
        event_name: 'customer_service',
      },
      [`${feedBackPageTabIdObj.FAQ}`]: {
        description: 'FAQ',
        event_name: 'faq',
      },
      [`${feedBackPageTabIdObj.INBOX}`]: {
        description: '站內信通知',
        event_name: 'notice',
      },
    },
    description: '聯繫客服',
    event_name: 'customer_service',
    isNeedState: true,
  },
  [BasePagePathObj.GameLobbyPage]: {
    params: '',
    description: '遊戲大廳，遊戲',
    event_name: 'game_play',
    isNeedState: false,
  },
  [BasePagePathObj.GamePage]: {
    params: '',
    description: '遊戲大廳，遊戲',
    event_name: 'game_play',
    isNeedState: false,
  },
  [BasePagePathObj.RecordPage]: {
    params: {
      [RecordPageTabs.RECORD]: {
        description: '餘額紀錄',
        event_name: 'balance',
      },
      [RecordPageTabs.REPORT]: {
        description: '餘額報告，遊戲投注記錄',
        event_name: 'balance_turnover_report',
      },
    },
    description: '餘額紀錄',
    event_name: 'balance',
    isNeedState: true,
  },

  [BasePagePathObj.TeamClubPage]: {
    params: {
      [TeamClubPageTabType.SHARE_FOR_BONUS]: {
        description: '邀請獎勵',
        event_name: 'share_for_bonus',
      },
      [TeamClubPageTabType.MY_REWARDS]: {
        description: '我的團隊獎勵',
        event_name: 'my_team_club_rewards',
      },
      [TeamClubPageTabType.INVITE_REWARDS]: {
        description: '邀請獎勵',
        event_name: 'invite_rewards',
      },
      [TeamClubPageTabType.RULES]: {
        description: '團隊俱樂部，規則',
        event_name: 'team_club_rules',
      },
    },
    description: '團隊俱樂部',
    event_name: 'team_club',
    isNeedState: true,
  },
  [BasePagePathObj.RewardsDetail]: {
    params: '',
    description: '團隊俱樂部，獎勵詳情',
    event_name: 'team_club_rewards_detail',
    isNeedState: false,
  },
  [BasePagePathObj.SubordinateDataPage]: {
    params: '',
    description: '下屬資料',
    event_name: 'subordinate_infos',
    isNeedState: false,
  },
  [BasePagePathObj.SharePage]: {
    params: '',
    description: '分享邀請連結',
    event_name: 'share',
    isNeedState: false,
  },
  [BasePagePathObj.ActivityRulePage]: {
    params: '',
    description: '活動規則',
    event_name: 'activity_rules',
    isNeedState: false,
  },
  [BasePagePathObj.RechargeWheelPage]: {
    params: '',
    description: '充值輪盤活動頁面',
    event_name: 'recharge_wheel',
    isNeedState: false,
  },
  [BasePagePathObj.InviteWheelPage]: {
    params: '',
    description: '邀請輪盤活動頁面',
    event_name: 'invite_wheel',
    isNeedState: false,
  },
};

const mapParamsKey: Record<BasePagePaths | string, string> = {
  [BasePagePathObj.WalletPage]: 'tab',
  [BasePagePathObj.BindKYCPage]: 'tab',
  [BasePagePathObj.FeedBackPage]: 'tab',
  [BasePagePathObj.ActivityPage]: 'tab',
  [BasePagePathObj.RecordPage]: 'tab',
  [BasePagePathObj.LoginPage]: 'tab',
  [BasePagePathObj.TeamClubPage]: 'tab',
};

export const useSensorsDataPageViewReport = () => {
  const mapPageViewEventData = (
    pathname: string,
    state: any
  ): ViewPageData | undefined => {
    const mapData: ViewPageData | undefined = mapPageViewData[pathname];
    if (mapData && mapData.isNeedState) {
      const key = mapParamsKey[pathname];
      const opt = state ? state[key] || '' : '';
      if (typeof mapData.params !== 'string') {
        const data = mapData.params[opt] || null;
        if (data) {
          return {
            ...mapData,
            ...data,
          };
        }
      }
    }
    return mapData;
  };

  const doPageViewReport = (location: Location) => {
    const pageViewEventData = mapPageViewEventData(
      location.pathname,
      location.state
    );

    if (pageViewEventData) {
      const { isNeedState, params, ...rest } = pageViewEventData;
      sdkUtils.sendAnalyticsEvent<SensorsEventPayload>({
        event: 'doPageViewReport',
        sensorsType: SensorsPayloadType.QUICK,
        label: SensorsEventLabel.AUTOT_RACKSINGLE_PAGE,
        profile: JSON.stringify(rest),
      });
    }
  };

  return {
    doPageViewReport,
  };
};
