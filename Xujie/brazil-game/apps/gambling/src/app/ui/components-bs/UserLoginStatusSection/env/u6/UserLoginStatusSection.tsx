import cx from 'classnames';
import { useState } from 'react';
import { UserLoginForm } from '../../forms/UserLoginForm';
import { UserRegisterForm } from '../../forms/UserRegisterForm';
import { UserForgetPasswordForm } from '../../forms/UserForgetPasswordForm';
import { LoginModalLogo } from '../../../Logos/LoginModalLogo';
import { IUserLoginStatusSection } from '../../types';
import { TabItem } from '../../components/TabItem';
import { Tabs } from '../../../../components/Tabs';
import { ArrowLeft } from '../../../Icons/ArrowLeft';
import { ILoginUIStatusType } from '../../../../../reduxStore/appSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import { environment } from '../../../../../../environments/environment';

export const UserLoginStatusSection = (props: IUserLoginStatusSection) => {
  const loginUIStatusType = useSelector(
    (rootState: RootState) => rootState.app.loginUIStatusType
  );
  const [switchToLoginOrRegister, setSwitchToLoginOrRegister] =
    useState<ILoginUIStatusType>(loginUIStatusType);

  return (
    <div className={'flex flex-col box-border rounded-[20px]'}>
      {switchToLoginOrRegister === 'forget' ? (
        <section>
          <button
            className="absolute md:top-4 lg:top-[18px] left-3"
            onClick={() => {
              setSwitchToLoginOrRegister('login');
            }}
          >
            <ArrowLeft className="lg:!w-7 lg:!h-7" />
          </button>
          <div
            className={cx(
              'text-white mt-2 mb-6 md:mb-8 lg:mb-9 md:text-lg lg:text-xl text-center'
            )}
          >
            Esqueça a senha
          </div>
        </section>
      ) : (
        <>
          <section className={'flex justify-start h-auto'}>
            <Tabs
              className={cx('w-[216px] rounded-lg bg-transparente-gray-30')}
            >
              <TabItem
                key="login"
                className={cx('text-base !py-1.5 !font-normal !shadow-none', {
                  'bg-linear-2-main': switchToLoginOrRegister == 'login',
                })}
                name={'Entrar'}
                active={switchToLoginOrRegister === 'login'}
                onClick={() => {
                  setSwitchToLoginOrRegister('login');
                }}
              />
              <TabItem
                key="register"
                className={cx('text-base !py-1.5 !font-normal !shadow-none', {
                  'bg-linear-2-main': switchToLoginOrRegister == 'register',
                })}
                name={'Registro'}
                active={switchToLoginOrRegister === 'register'}
                onClick={() => {
                  setSwitchToLoginOrRegister('register');
                }}
              />
            </Tabs>
          </section>
          <section
            className={'flex flex-col justify-center items-center mb-3 mt-6'}
          >
            <LoginModalLogo />
            <div className="mt-1 text-white text-sm font-medium">
              {environment.platformName}{' '}
            </div>
          </section>
        </>
      )}

      {switchToLoginOrRegister === 'login' ? (
        <div className={''}>
          <UserLoginForm
            confirmToLogin={() => {
              props.confirmToLogin();
            }}
            openNotificationWithIcon={props.openNotificationWithIcon}
            onSwitchToForgetPassword={() => {
              setSwitchToLoginOrRegister('forget');
            }}
          />
        </div>
      ) : switchToLoginOrRegister === 'register' ? (
        <div>
          <UserRegisterForm
            confirmToRegister={() => {
              props.confirmToLogin();
            }}
            openNotificationWithIcon={props.openNotificationWithIcon}
          />
        </div>
      ) : (
        <div>
          <UserForgetPasswordForm
            confirmToRegister={() => {
              props.confirmToLogin();
            }}
            openNotificationWithIcon={props.openNotificationWithIcon}
          />
        </div>
      )}
    </div>
  );
};
