import { usePostVerifyWithdrawPasswordMutation } from '../../index';

export const useVerifyWithdrawPasswordTransform = () => {
  const [triggerBind, { ...rest }] = usePostVerifyWithdrawPasswordMutation();

  const trigger = async (password: string) => {
    return triggerBind({ withdrawPassword: password });
  };

  return {
    trigger,
    ...rest,
  };
};
