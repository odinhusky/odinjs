import { ExternelEndpoint } from '../../types';
import { POST_LOGIN_URL } from '../../ApiUrl';
import { USER_PROFILE_MODIFY } from '../../tags';
import { IUserInfo } from '../../../persistant/IUserInfo';
import { ResponseStructure } from '../ResponseStructure';

interface LoginRequest {
  appChannel: string;
  appPackageName: string;
  appVersion: string;
  deviceId: string;
  deviceModel: string;
  deviceVersion: string;
  sysLanguage: string;
  sysTimezone: string;
  account: string;
  password: string;
  // phone?: string; // 棄用
}

interface LoginResponse {
  user_info: IUserInfo;
  bank: any;
  pay_account: {
    email: string;
    phone: string;
    name: string;
  };
  connection: {
    ip: string;
    port: number;
    server_id: number;
    api: string;
  };
  token: string;
  recharge_dot: [];
  hide_entrance: [];
  game_list: number[];
}

// 登入
export const PostLoginEndpoint = (builder: ExternelEndpoint) =>
  builder.mutation<ResponseStructure<LoginResponse>, LoginRequest>({
    query: (requestData: LoginRequest) => ({
      method: 'post',
      url: POST_LOGIN_URL,
      data: requestData,
    }),
    invalidatesTags: [USER_PROFILE_MODIFY],
  });
