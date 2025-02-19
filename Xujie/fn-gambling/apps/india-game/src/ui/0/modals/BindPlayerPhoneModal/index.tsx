import { PlayerBindAccountPayload } from '@libs/mode2/external/api/endpoint/user/PostPlayerBindAccountEndpoint';

type BindPlayerPhoneTypes = Pick<
  PlayerBindAccountPayload,
  'otpCode' | 'phone' | 'password' | 'referralCode'
>;

export const BindPlayerPhoneModal = () => {
  return null;
};

export default BindPlayerPhoneModal;
