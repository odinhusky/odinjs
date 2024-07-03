import { ExternelEndpoint } from '../../types';
import { POST_FORGET_PASSWORD_URL } from '../../ApiUrl';
import { IUserInfo } from '../../../persistant/IUserInfo';
import { ResponseStructure } from '../ResponseStructure';

// ResponseStructure.ts;

interface ForgetPasswordRequest {
  appChannel: string;
  appPackageName: string;
  appVersion: string;
  deviceId: string;
  deviceModel: string;
  deviceVersion: string;
  sysLanguage: string;
  sysTimezone: string;
  phone: string;
  password: string;
  verifyCode: string;
}
interface ForgetPasswordResponse {
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

export const PostForgetPasswordEndpoint = (builder: ExternelEndpoint) =>
  builder.mutation<
    ResponseStructure<ForgetPasswordResponse>,
    ForgetPasswordRequest
  >({
    query: (data: ForgetPasswordRequest) => ({
      method: 'post',
      url: POST_FORGET_PASSWORD_URL,
      data: data,
    }),
  });
