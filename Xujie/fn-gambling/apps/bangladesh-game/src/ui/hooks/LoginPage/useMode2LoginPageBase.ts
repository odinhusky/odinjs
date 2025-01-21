import useLoginPageFooterSetting from './useLoginPageFooterSetting';
import useLoginPageHeaderSetting from './useLoginPageHeaderSetting';
import { useLoginPageFABSetting } from './useLoginPageFABSetting';
import { useEffect } from 'react';
import sdkUtils from '@mode2/utils/sdk';
import { useNavigateClick } from '@mode2/usecase/useNavPageClick';

export const useMode2LoginPageBase = () => {
  // const navigate = useNavigateClick();
  // useEffect(() => {
  //   if (sdkUtils.isCurrentLogin()) {
  //     navigate(-1);
  //   }
  // }, []);

  // ==== LoginPage Header Setting
  useLoginPageHeaderSetting();

  // ==== LoginPage Footer Setting
  useLoginPageFooterSetting();

  // === LoginPage FloatActionButton setting
  useLoginPageFABSetting();
};

export default useMode2LoginPageBase;
