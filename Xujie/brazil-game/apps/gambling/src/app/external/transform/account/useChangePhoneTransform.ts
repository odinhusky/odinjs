import { usePostChangePhoneMutation } from '../../index';

type TriggerData = {
  phone: string;
};
export const useChangePhoneTransform = () => {
  const [triggerChange, { ...rest }] = usePostChangePhoneMutation();

  const trigger = async (data: TriggerData) => {
    return triggerChange({ ...data });
  };

  return {
    trigger,
    ...rest,
  };
};
