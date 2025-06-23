export interface IconStateRes {
  suffix?: string;
  ext?: string;
}

export type IconState = 'def' | 'active' | string;

export type ActiveRes = Record<IconState, IconStateRes>;

export const ICON_MAPPING: Record<string, Record<string, ActiveRes>> = {
  ['v1']: {
    ic_home: { def: { suffix: '_inactive' }, active: { suffix: '_active' } },
    ic_wallet: { def: { suffix: '_inactive' }, active: { suffix: '_active' } },
    ic_activity: {
      def: { suffix: '_inactive' },
      active: { suffix: '_active' },
    },
    ic_user: { def: { suffix: '_inactive' }, active: { suffix: '_active' } },
    fab_add: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    fab_close: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    fab_facebook: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    fab_inbox: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    fab_instagram: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    fab_livechat: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    fab_telegram: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    fab_tiktok: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    fab_twitter: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    fab_whatsapp: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    fab_youtube: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_piggy_bank: { def: { ext: '.gif' }, active: { ext: '.gif' } },
  },
  ['v2']: {
    fab_add: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    fab_close: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    fab_facebook: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    fab_inbox: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    fab_instagram: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    fab_livechat: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    fab_telegram: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    fab_tiktok: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    fab_twitter: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    fab_whatsapp: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    fab_youtube: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_piggy_bank: { def: { ext: '.gif' }, active: { ext: '.gif' } },
  },
  ['v3']: {
    ic_home: { def: { suffix: '_inactive' }, active: { suffix: '_active_1' } },
    ic_wallet: {
      def: { suffix: '_inactive' },
      active: { suffix: '_active_1' },
    },
    ic_earn_money: {
      def: { suffix: '_inactive' },
      active: { suffix: '_inactive' },
    },
    ic_activity: {
      def: { suffix: '_inactive' },
      active: { suffix: '_active_1' },
    },
    ic_user: { def: { suffix: '_inactive' }, active: { suffix: '_active_1' } },
    fab_add: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    fab_close: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    fab_facebook: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    fab_inbox: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    fab_instagram: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    fab_livechat: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    fab_telegram: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    fab_tiktok: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    fab_twitter: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    fab_whatsapp: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    fab_youtube: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_piggy_bank: { def: { ext: '.gif' }, active: { ext: '.gif' } },
  },
  ['v4']: {
    fab_add: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    fab_close: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    fab_facebook: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    fab_inbox: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    fab_instagram: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    fab_livechat: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    fab_telegram: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    fab_tiktok: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    fab_twitter: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    fab_whatsapp: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    fab_youtube: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_piggy_bank: { def: { ext: '.gif' }, active: { ext: '.gif' } },
  },
  ['v5']: {
    fab_add: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    fab_close: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    fab_facebook: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    fab_inbox: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    fab_instagram: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    fab_livechat: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    fab_telegram: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    fab_tiktok: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    fab_twitter: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    fab_whatsapp: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    fab_youtube: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_invite_wheel: { def: { ext: '.gif' }, active: { ext: '.gif' } },
    ic_tab_menu_drop: { def: { ext: '.gif' }, active: { ext: '.gif' } },
    ic_piggy_bank: { def: { ext: '.gif' }, active: { ext: '.gif' } },
  },
  ['v6']: {
    // 底部導航
    ic_activity: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_earn_money: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    nav_bar_invitation_wheel: {
      def: { ext: '.webp' },
      active: { ext: '.webp' },
    },
    ic_home: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_mail_deposit_bonus: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    ic_user: { def: { suffix: '_default' }, active: { suffix: '_active' } },

    // 遊戲類型分類
    ic_casino: { active: { suffix: '_active', ext: '.webp' } },
    ic_fishing: { active: { suffix: '_active', ext: '.webp' } },
    ic_game: { active: { suffix: '_active', ext: '.webp' } },
    ic_original: { active: { suffix: '_active', ext: '.webp' } },
    ic_popular: { active: { suffix: '_active', ext: '.webp' } },
    ic_slots: { active: { suffix: '_active', ext: '.webp' } },
    ic_sports: { active: { suffix: '_active', ext: '.webp' } },

    ic_lucky_wheel: { def: { ext: '.webp' }, active: { ext: '.webp' } },

    // more game page  manufacturer icon 依照id
    ic_mfg_smartsoft: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    ic_mfg_fc: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_mfg_wickets: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    ic_mfg_sexybcrt: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    ic_mfg_toofun: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    ic_mfg_lottery777: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    ic_mfg_bng: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_mfg_pls: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_mfg_topbet: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    ic_mfg_evolution: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    ic_mfg_sw: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_mfg_qs: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_mfg_rg: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_mfg_pngo: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_mfg_wm: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_mfg_turbogames: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    ic_mfg_spribe: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    ic_mfg_pt: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_mfg_ot: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_mfg_ag: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_mfg_jili: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_mfg_pg: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_mfg_jdb: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_mfg_evort: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    ic_mfg_evontt: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    ic_mfg_cq9: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_mfg_wg: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_mfg_alize: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    ic_mfg_aviatrix: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    ic_mfg_t1: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_mfg_bgaming: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    ic_mfg_bg: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_mfg_saba: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_mfg_kerala: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    ic_mfg_omg: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_mfg_evonlc: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    ic_mfg_evobtg: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    ic_mfg_hacksaw: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    ic_mfg_km: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_mfg_habanero: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    ic_mfg_evoplay: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    ic_mfg_winfinity: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    ic_mfg_yellowbat: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    ic_mfg_yeebet: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
    ic_mfg_atg: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_mfg_pp: { def: { suffix: '_default' }, active: { suffix: '_active' } },
    ic_mfg_koolbet: {
      def: { suffix: '_default' },
      active: { suffix: '_active' },
    },
  },
};
