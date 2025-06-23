import { shouldUseOtherInfoVersionList } from '@libs/constant/versions';

/**
 * @author Odin
 * @description 判斷什麼版本下
 */
export const isUseOtherInfoWhenAntdFormInputValidate = (): boolean => {
  const version = import.meta.env['VITE_V_VERSION'];

  const shouldUseOtherInfo = shouldUseOtherInfoVersionList.includes(version);

  return shouldUseOtherInfo;
};
