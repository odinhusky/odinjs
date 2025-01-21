import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { PayActivationResult } from '@mode2API/endpoint/wallet/PostPayConfigInfoWithOptionsEndpoint';
const defaultData = {
  title: '',
  logoUrl: '',
  baseInfo: [],
  noticeText: '',
  tutorialLinkText: '',
  showConfig: {
    countdownTime: false, //倒计时
    UTR: false, //UTR 输入
    morePayType: false, // and more logo
    downloadQR: false,
    copyCryptoAddress: false,
  },
  reminder: [],
};
export const PAY_CONTENT_MAP = {
  [PayActivationResult.UPI]: {
    title: 'UPIPay',
    logoUrl: getImgUrl(EResourceLevel.SHARED, '/paylogo/upi_pay_logo'),
    baseInfo: [
      {
        label: 'wallet_deposit_pay_upi_payment_amount',
        key: 'payAmount',
        copy: true,
      },
      {
        label: 'UPI ID',
        key: 'payAddress',
        copy: true,
      },
    ] as const,
    noticeText: 'wallet_deposit_pay_upi_notice_upi',
    tutorialLinkText: 'wallet_deposit_pay_upi_how_to_deposit_with_upipay',
    showConfig: {
      countdownTime: true,
      UTR: true,
      morePayType: true,
      downloadQR: true,
      copyCryptoAddress: false,
    },
    reminder: [
      'wallet_deposit_bonus_pay_channel_upi_content_reminder_1',
      'wallet_deposit_bonus_pay_channel_upi_content_reminder_2',
      'wallet_deposit_bonus_pay_channel_upi_content_reminder_3',
      'wallet_deposit_bonus_pay_channel_upi_content_reminder_4',
      'wallet_deposit_bonus_pay_channel_upi_content_reminder_5',
    ],
  },
  [PayActivationResult.CRYPTO_WALLET]: {
    title: 'USDT',
    logoUrl: '',
    baseInfo: [
      {
        label: 'wallet_deposit_pay_usdt_amount_to_pay',
        key: 'currency',
        copy: false,
      },
    ] as const,
    noticeText: 'wallet_deposit_pay_usdt_content_notice',
    tutorialLinkText: 'wallet_deposit_pay_usdt_link_usdt',
    showConfig: {
      countdownTime: false, //倒计时
      UTR: false, //UTR 输入
      morePayType: false, // and more logo
      downloadQR: false,
      copyCryptoAddress: true,
    },
    reminder: [
      'wallet_deposit_bonus_pay_channel_usdt_content_reminder_1',
      'wallet_deposit_bonus_pay_channel_usdt_content_reminder_2',
      'wallet_deposit_bonus_pay_channel_usdt_content_reminder_3',
      'wallet_deposit_bonus_pay_channel_usdt_content_reminder_4',
    ],
  },
  [PayActivationResult.PHONEPE]: defaultData,
  [PayActivationResult.INTERNAL]: defaultData,
  [PayActivationResult.EXTERNAL]: defaultData,
};
