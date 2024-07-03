import { usePostChangeLoginPasswordMutation } from '../../index';

type TriggerData = {
  oldPassword: string;
  newPassword: string;
};

export const useChangeLoginPasswordTransform = () => {
  const [triggerChange, { ...rest }] = usePostChangeLoginPasswordMutation();

  const trigger = async (data: TriggerData) => {
    return triggerChange({ ...data });
  };

  return {
    trigger,
    ...rest,
  };
};
