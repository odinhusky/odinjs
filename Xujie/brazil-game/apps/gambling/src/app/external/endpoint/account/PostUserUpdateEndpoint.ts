import { ExternelEndpoint } from '../../types';
import { POST_USER_UPDATE_URL } from '../../ApiUrl';
import { LOGIN } from '../../tags';
import { ResponseStructure } from '../ResponseStructure';
import { IUserInfo } from '../../../persistant/IUserInfo';

interface UpdateUserInfoRequest {
  token: string;
  nickname: string;
  avatar: string;
  birthday: string;
  mail: string;
  whatsAppUserName: string;
  facebookUserName: string;
  telegramUserName: string;
  twitterUserName: string;
}

// type UpdateUserInfoResponse = {
//   code: number;
//   msg: string;
//   data: {
//     user_info: {
//       user_id: number;
//       player_id: number;
//       nickname: string;
//       avatar: string;
//       fb_avatar: string;
//       phone: string;
//       pay_account_id: number;
//       vip_level: number;
//       vip_level_max: number;
//       card_back: number;
//       avatar_frame: number;
//       app_package_name: string;
//       bind: number[];
//       invite_user_id: string;
//       invite_code: string;
//       invite: any;
//       recharge_amount: number;
//       withdraw_amount: number;
//       is_register: number;
//       token: string;
//       enable: number;
//       s_player: number;
//       c_player: number;
//       withdraw_model: number;
//       total_rounds: number;
//       bind_bank_reward: number;
//       first_rw_reward: number;
//       withdraw_control: number;
//       created_at: number;
//       tag: number;
//     };
//     bank: any;
//     pay_account: {
//       email: string;
//       phone: string;
//       name: string;
//     };
//     token: string;
//     connection: {
//       ip: string;
//       port: number;
//       server_id: number;
//       api: string;
//     };
//   };
// };

type UpdateUserInfoResponse = {
  user_info: IUserInfo;
  bank: any;
  pay_account: {
    email: string;
    phone: string;
    name: string;
  };
  token: string;
  connection: {
    ip: string;
    port: number;
    server_id: number;
    api: string;
  };
};

const PostUserUpdateEndpoint = (builder: ExternelEndpoint) =>
  builder.mutation<
    ResponseStructure<UpdateUserInfoResponse>,
    UpdateUserInfoRequest
  >({
    query: (data: UpdateUserInfoRequest) => ({
      method: 'post',
      url: POST_USER_UPDATE_URL,
      data,
    }),
    invalidatesTags: [LOGIN],
  });

export { PostUserUpdateEndpoint, UpdateUserInfoResponse };
