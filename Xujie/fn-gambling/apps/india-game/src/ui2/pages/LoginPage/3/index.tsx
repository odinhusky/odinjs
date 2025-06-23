import useMode2LoginPageBase from '@libs/mode2/usecase/page/LoginPage/useMode2LoginPageBase';
import useLoginPageHeaderSettingOverride from '@libs/mode2/usecase/page/LoginPage/useLoginPageHeaderSettingOverride';
import { LoginFormType } from '@libs/mode2/zustand/loginStore';
import { useLocation } from 'react-router-dom';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import LoginContent from '@components/LoginContent';

export const LoginPage = () => {
  const { state } = useLocation();
  const { navToHallPage } = useNavPageClick();
  useMode2LoginPageBase();
  useLoginPageHeaderSettingOverride();

  return (
    <LoginContent
      type={state?.tab ? state.tab : LoginFormType.LOGIN}
      onSuccess={() => navToHallPage()}
    />
  );
};

export default LoginPage;
