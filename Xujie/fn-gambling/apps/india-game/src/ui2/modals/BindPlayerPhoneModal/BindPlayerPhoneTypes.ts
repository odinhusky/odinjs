import { PlayerBindAccountPayload } from "@libs/mode2/external/api/endpoint/user/PostPlayerBindAccountEndpoint";

export type BindPlayerPhoneTypes = Pick<
  PlayerBindAccountPayload,
  'otpCode' | 'phone' | 'password' | 'referralCode'
>;
