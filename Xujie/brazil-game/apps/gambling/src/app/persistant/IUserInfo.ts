export type IUserInfo = {
  client_ip: string;
  user_id: number;
  nickname: string;
  avatar: string;
  fb_avatar: string;
  phone: string;
  pay_account_id: number;
  vip_level: number;
  vip_level_max: number;
  card_back: number;
  avatar_frame: number;
  app_package_name: string;
  bind: number[];
  invite_user_id: string;
  invite_code: string;
  invite: any;
  is_register: number;
  enable: number;
  recharge_amount: number;
  withdraw_amount: number;
  s_player: number;
  c_player: number;
  withdraw_model: number;
  total_rounds: number;
  bind_bank_reward: number;
  first_rw_reward: number;
  withdraw_control: number;
  created_at: number;
  ab: string;
  ab_open: number;
  alterarImg: string;

  // NOTE: 用 Token 刷新 Token 才有
  player_id?: number;
  // NOTE: 用 Token 刷新 Token 才有
  token?: string;

  // 2024/02/01 新增
  birthday: string;
  mail: string;
  facebook_username: string;
  whatsapp_username: string;
  twitter_username: string;
  telegram_username: string;
};
