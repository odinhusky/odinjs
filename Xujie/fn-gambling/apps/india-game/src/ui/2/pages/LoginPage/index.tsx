import useMode2LoginPageBase from '@libs/mode2/usecase/page/LoginPage/useMode2LoginPageBase';
import { LoginContent } from '@components/LoginContent';
import { LoginFormType } from '@libs/mode2/zustand/loginStore';
import { useLocation } from 'react-router-dom';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';

const LoginPage = () => {
  const { state } = useLocation();
  const { navToHallPage } = useNavPageClick();
  useMode2LoginPageBase();

  return (
    <LoginContent
      type={state?.tab ? state.tab : LoginFormType.LOGIN}
      onSuccess={() => navToHallPage()}
    />
  );
};

export default LoginPage;
