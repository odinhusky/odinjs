import { ExternelEndpoint } from '../../types';
import { POST_REGISTER_URL } from '../../ApiUrl';
import { REGISTER } from '../../tags';
import { IUserInfo } from '../../../persistant/IUserInfo';
import { ResponseStructure } from '../ResponseStructure';

interface WebFingerRequest {
  canvas: string;
  screenWidth: number;
  webgl: string;
  cpuSize: number;
  inviteUrl: string;
  userAgent: string;
}

interface RegisterRequest {
  appChannel: string;
  appPackageName: string;
  appVersion: string;
  deviceVersion: string;
  deviceId: string;
  deviceModel: string;
  sysLanguage: string;
  sysTimezone: string;
  account?: string;
  password: string;
  phone: string;
  verifyCode: string;
  installTime: string;
  captcha_image_key: string;
  captcha_image_code: string;
  web_finger: WebFingerRequest;
  web_uuid: string;
  isSimulator: number;
}

type RegisterResponse = {
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
};

// 註冊
export const PostRegisterEndpoint = (builder: ExternelEndpoint) =>
  builder.mutation<ResponseStructure<RegisterResponse>, RegisterRequest>({
    query: (requestData: RegisterRequest) => ({
      method: 'post',
      url: POST_REGISTER_URL,
      data: requestData,
    }),
    invalidatesTags: [REGISTER],
  });
