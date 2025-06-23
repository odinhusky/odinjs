import { cx } from '@libs/commonUtils';
import {
  LoginFormType,
  useIsShowLoginModalStore,
} from '@mode2/zustand/loginStore';
import { ILoginModalProps } from '@/hooks/modals/useLoginForm';
import SwitchFormTab from './components/SwitchFormTab';
import LoginForm from './components/LoginForm';
import useLoginPageSwitchForm from '@libs/mode2/usecase/page/LoginPage/useLoginPageSwitchForm';
import OTPLoginForm from './components/OTPLoginForm';
import './index.scss';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';

export const LoginContent = (props: ILoginModalProps) => {
  useLoginPageSwitchForm();

  // 是否顯示 註冊贈金廣告
  // const isDisplayRegisterReward = usePlatformDynamicConfigStore(
  //   (state) => state.isDisplayRegisterReward
  // );

  const currentFormTab = useIsShowLoginModalStore(
    (state) => state.currentFormTab
  );

  return (
    <div className="overflow-auto">
      <div className={cx('pt-10', props.className)}>
        <div className="flex justify-center mb-10">
          <img
            className={cx('h-28')}
            alt={'logo'}
            src={getImgUrl(EResourceLevel.LOGO, 'game_logo_512')}
          />
        </div>
        {/* 註冊 赠金 廣告*/}
        {/* {isDisplayRegisterReward && props.type === LoginFormType.REGISTER ? (
            <img
              className={cx('my-4 rounded-lg', { 'mb-4 -mt-4': isMobile })}
              alt={'register_banner'}
              // src={getImgUrl(EResourceLevel.V, 'register_banner')}
              src={getImgUrl(EResourceLevel.V, 'signin_banner')}
            />
          ) : null}
          {props.type === LoginFormType.LOGIN ? (
            <img
              className={cx('my-4 rounded-lg', { 'mb-4 -mt-4': isMobile })}
              alt={'signin_banner'}
              src={getImgUrl(EResourceLevel.V, 'signin_banner')}
            />
          ) : null} */}

        <div className="px-[5px]">
          {currentFormTab === LoginFormType.LOGIN && <LoginForm {...props} />}

          {currentFormTab === LoginFormType.OTP_LOGIN && (
            <OTPLoginForm {...props} />
          )}

          <SwitchFormTab />
        </div>
      </div>
    </div>
  );
};

export default LoginContent;
