import { usePostBindWithdrawPasswordMutation } from '../../index';

export const useBindWithdrawPasswordTransform = () => {
  const [triggerBind, { ...rest }] = usePostBindWithdrawPasswordMutation();

  const trigger = async (password: string) => {
    return triggerBind({ withdrawPassword: password });
  };

  return {
    trigger,
    ...rest,
  };
};
