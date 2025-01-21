import { PayActivationResult } from '@mode2API/endpoint/wallet/PostPayConfigInfoWithOptionsEndpoint';

export const TUTORIAL_DATA_MAP: Record<
  PayActivationResult,
  {
    title: string;
    data: { title: string; image: string; dec: string }[];
  }
> = {
  [PayActivationResult.UPI]: {
    title: 'UPI deposit tutorial',
    data: [
      {
        image: 'deposit_tutorial_common_1',
        title: 'Enter amount',
        dec: 'On the payment page, start by entering the amount you wish to pay.',
      },
      {
        image: 'deposit_tutorial_upi_step_2',
        title: 'Copy UPI ID or download QR code',
        dec: `If you have the recipient's UPI ID, you can copy and paste it. Alternatively, download the QR code to scan for easier payment.`,
      },
      {
        image: 'deposit_tutorial_upi_step_3',
        title: 'Open your UPI app',
        dec: `To transfer using a UPI ID in an external payment app, open the app. Enter or paste the recipient’s UPI ID, then verify the ID and recipient's name before proceeding.`,
      },
      {
        image: 'deposit_tutorial_common_4',
        title: 'View transaction details',
        dec: 'After a successful transaction, tap on “View Details” to open the transaction details page, then locate the UTR number and long press to copy it to your clipboard.',
      },
      {
        image: 'deposit_tutorial_common_5',
        title: 'Copying UTR after transaction',
        dec: ' On the payment page, start by entering the amount you wish to pay.',
      },
      {
        image: 'deposit_tutorial_common_6',
        title: 'Pasting and submitting UTR',
        dec: 'Open {51play} and paste UTR number.',
      },
      {
        image: 'deposit_tutorial_common_7',
        title: 'Payment successful',
        dec: 'Once the transaction is complete, you will receive a notification confirming the payment.',
      },
    ],
  },
  [PayActivationResult.CRYPTO_WALLET]: {
    title: 'USDT deposit tutorial',
    data: [
      {
        image: 'deposit_tutorial_common_1',
        title: 'Enter amount',
        dec: 'On the payment page, start by entering the amount you wish to pay.',
      },
      {
        image: 'deposit_tutorial_usdt_step_2',
        title: 'Copy UPI ID or download QR code',
        dec: `If you have the recipient's UPI ID, you can copy and paste it. Alternatively, download the QR code to scan for easier payment.`,
      },
      {
        image: 'deposit_tutorial_usdt_step_3',
        title: 'Open your UPI app',
        dec: `To transfer using a UPI ID in an external payment app, open the app. Enter or paste the recipient’s UPI ID, then verify the ID and recipient's name before proceeding.`,
      },
      {
        image: 'deposit_tutorial_usdt_step_4',
        title: 'View transaction details',
        dec: 'After a successful transaction, tap on “View Details” to open the transaction details page, then locate the UTR number and long press to copy it to your clipboard.',
      },
      {
        image: 'deposit_tutorial_common_7',
        title: 'Payment successful',
        dec: 'Once the transaction is complete, you will receive a notification confirming the payment.',
      },
    ],
  },
  [PayActivationResult.PHONEPE]: { title: '', data: [] },
  [PayActivationResult.EXTERNAL]: { title: '', data: [] },
  [PayActivationResult.INTERNAL]: { title: '', data: [] },
};
