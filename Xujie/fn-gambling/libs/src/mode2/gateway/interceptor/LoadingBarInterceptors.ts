import { AxiosInstance } from 'axios';
import { useLoadingStore } from '@mode2/zustand/components/loadingStore';
import {
  LOGIN_URL,
  POST_ACTIVE_CLAIM_SURPRISE_REWARD_URL,
  POST_BROKEN_BOX_CLAIM_URL,
  POST_GIFT_RANDOM_URL,
  POST_INVITE_WHEEL_SPIN_URL,
  POST_INVITE_WHEEL_WITHDRAW_URL,
  POST_MESSAGES_CLAIM_URL,
  POST_MESSAGES_DELETE_ALL_READ_URL,
  POST_MISSION_CLAIM_BOX_URL,
  POST_MISSION_CLAIM_URL,
  POST_PAY_BROKEN_RECHARGE_URL,
  POST_PAY_INBOX_RECHARGE_URL,
  POST_PAY_RECHARGE_URL,
  POST_PIGGY_BANK_WITHDRAW_URL,
  POST_PLAYER_BIND_ACCOUNT_URL,
  POST_PLAYER_BIND_REFER_CODE_URL,
  POST_PLAYER_OTP_LOGIN_URL,
  POST_PLAYER_SEND_OPT_URL,
  POST_PLAYER_UPDATE_AVATAR_URL,
  POST_RECHARGE_CLAIM_TUTORIAL_REWARD_URL,
  POST_RECHARGE_INTO_GAME_URL,
  POST_TEAM_INVITATION_TASK_REWARD_CLAIM_URL,
  POST_VIP_CLAIM_REBATE_URL,
} from '@mode2API/urls';

// 需要支援 loading bar 等待的 API path 白名單
const LoadingBarNeedWhitelist = [
  '/v1/api/pay/payout', // in payout
  POST_MISSION_CLAIM_URL,
  POST_MISSION_CLAIM_BOX_URL,
  POST_PAY_INBOX_RECHARGE_URL,
  POST_PAY_BROKEN_RECHARGE_URL,
  POST_GIFT_RANDOM_URL,
  POST_INVITE_WHEEL_WITHDRAW_URL,
  POST_PAY_RECHARGE_URL,
  POST_PIGGY_BANK_WITHDRAW_URL,
  POST_INVITE_WHEEL_SPIN_URL,
  POST_PLAYER_BIND_REFER_CODE_URL,
  POST_TEAM_INVITATION_TASK_REWARD_CLAIM_URL,
  POST_MESSAGES_CLAIM_URL,
  POST_PLAYER_UPDATE_AVATAR_URL,
  POST_RECHARGE_INTO_GAME_URL,
  POST_RECHARGE_CLAIM_TUTORIAL_REWARD_URL,
  POST_ACTIVE_CLAIM_SURPRISE_REWARD_URL,
  POST_VIP_CLAIM_REBATE_URL,
  POST_MESSAGES_DELETE_ALL_READ_URL,
  LOGIN_URL,
  POST_PLAYER_OTP_LOGIN_URL,
  POST_PLAYER_SEND_OPT_URL,
  POST_PLAYER_BIND_ACCOUNT_URL,
  POST_BROKEN_BOX_CLAIM_URL,
];
export const setupAxiosInstanceLoadingBarInterceptors = (
  instance: AxiosInstance
) => {
  instance.interceptors.request.use(
    async (config) => {
      if (LoadingBarNeedWhitelist.includes(config.url || '')) {
        useLoadingStore.getState().setShowLoading(true);
      }
      return config;
    },
    (error) => {
      useLoadingStore.getState().setShowLoading(false);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    async (response) => {
      if (LoadingBarNeedWhitelist.includes(response.config?.url || '')) {
        useLoadingStore.getState().setShowLoading(false);
      }
      return response;
    },
    (error) => {
      useLoadingStore.getState().setShowLoading(false);
      return Promise.reject(error);
    }
  );
};
